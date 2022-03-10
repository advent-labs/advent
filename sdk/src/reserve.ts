import { BN } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { floatingInterestRate, utilization } from "./eqs"
import {
  ReadonlyProgram,
  ReserveAccount,
  SettlementPeriod,
  SettlementTable,
} from "./models"

interface IReserve {
  market: PublicKey
  token: PublicKey
  decimals: number
  vault: PublicKey
  settlementTable: SettlementTable
  depositNoteMint: PublicKey
  totalDepositNotes: number
  totalDepositTokens: number
  totalDebt: number
  fixedDebt: number
  fixedDeposits: number
  minBorrowRate: number
  maxBorrowRate: number
  pivotBorrowRate: number
  targetUtilization: number
  variablePoolSubsidy: number
  durationFee: number
}
export class Reserve implements IReserve {
  public market: PublicKey
  public token: PublicKey
  public decimals: number
  // the mint for the deposit notes
  public depositNoteMint: PublicKey
  // the vault that holds the reserve tokens
  public vault: PublicKey
  // the address of the settlement table
  public settlementTableAddress: PublicKey
  // The settlement table's data
  public settlementTable: SettlementTable

  // how many deposit notes for variable-rate lenders
  public totalDepositNotes: number
  // how many tokens have been deposited
  public totalDepositTokens: number
  // total debt in tokens
  public totalDebt: number
  // how much fixed debt in tokens
  public fixedDebt: number
  // how much fixed deposits in tokens
  public fixedDeposits: number

  // The minimum interest rate when the vault has 0 utilization
  public minBorrowRate: number
  // The minimum interest rate when the vault has 0 utilization
  public maxBorrowRate: number
  // rate at the point between the first and second interest regimes
  public pivotBorrowRate: number
  // ratio for target utilization
  public targetUtilization: number

  public variablePoolSubsidy: number
  public durationFee: number
  constructor(
    private program: ReadonlyProgram,
    t: SettlementTable,
    r: ReserveAccount
  ) {
    const RATIO_DENOM = 1000
    this.market = r.market
    this.token = r.token
    this.decimals = r.decimals
    this.depositNoteMint = r.depositNoteMint
    this.vault = r.vault
    this.settlementTableAddress = r.settlementTable
    this.settlementTable = t
    this.totalDepositNotes = r.totalDepositNotes.toNumber()
    this.totalDepositTokens = r.totalDepositTokens.toNumber()
    this.totalDebt = r.totalDebt.toNumber()
    this.fixedDebt = r.fixedDebt.toNumber()
    this.fixedDeposits = r.fixedDeposits.toNumber()
    this.minBorrowRate = r.minBorrowRate.toNumber() / RATIO_DENOM
    this.maxBorrowRate = r.maxBorrowRate.toNumber() / RATIO_DENOM
    this.pivotBorrowRate = r.pivotBorrowRate.toNumber() / RATIO_DENOM
    this.targetUtilization = r.targetUtilization.toNumber() / RATIO_DENOM
    this.variablePoolSubsidy = r.variablePoolSubsidy.toNumber() / RATIO_DENOM
    this.durationFee = r.durationFee.toNumber() / RATIO_DENOM
  }

  async refresh() {
    const settlementTable = (await this.program.account.settlementTable.fetch(
      this.settlementTableAddress
    )) as SettlementTable
    this.settlementTable = settlementTable
  }

  utilization() {
    return utilization(this.totalDebt, this.totalDepositTokens)
  }

  floatingInterestRate() {
    const utilization = this.utilization()
    return floatingInterestRate(
      utilization,
      this.minBorrowRate,
      this.maxBorrowRate,
      this.pivotBorrowRate,
      this.targetUtilization
    )
  }

  /** Calculate the fixed borrow rate for a hypothetical borrow */
  calcFixedBorrowInterest(amount: number, duration: number) {
    const newUtilization = utilization(
      this.totalDebt + amount,
      this.totalDepositTokens
    )
    const durationFee = this.durationFee * duration
    const subsidyFee = this.variablePoolSubsidy

    return (
      durationFee +
      subsidyFee +
      floatingInterestRate(
        newUtilization,
        this.minBorrowRate,
        this.maxBorrowRate,
        this.pivotBorrowRate,
        this.targetUtilization
      )
    )
  }

  /** How much interest will a deposit receive? */
  availableInterestForDuration(amount: number, duration: number) {
    return this.settlementTable.periods
      .slice(0, duration)
      .map((p) =>
        // Calculate interest amount factoring in deposit
        Reserve.allocatedInterestAmountForPeriod({
          ...p,
          deposited: p.deposited.add(new BN(amount)),
        })
      )
      .reduce((a, x) => x + a, 0)
  }

  static allocatedInterestRateForPeriod(p: SettlementPeriod) {
    // (1 - ratio^2) * (1 - Interest^2) = 1)
    const ratio = p.deposited.toNumber() / p.borrowed.toNumber()
    return Math.sqrt(1 - 1 / (1 + ratio ** 2))
  }

  static allocatedInterestAmountForPeriod(p: SettlementPeriod) {
    if (p.borrowed.toNumber() === 0) return 0
    const rate = Reserve.allocatedInterestRateForPeriod(p)
    return rate * p.freeInterest.toNumber()
  }
}
