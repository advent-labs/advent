import { BN } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import {
  ReadonlyProgram,
  ReserveAccount,
  SettlementTableAccount,
} from "./models"
export interface ISettlementPeriod {
  deposited: number
  borrowed: number
  freeInterest: number
}
export interface ISettlementTable {
  periods: ISettlementPeriod[]
}
export interface IReserve {
  market: PublicKey
  token: PublicKey
  decimals: number
  vault: PublicKey
  depositNoteMint: PublicKey
  settlementTable: ISettlementTable
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

function settlementTableAccountToState(
  t: SettlementTableAccount
): ISettlementTable {
  return {
    periods: t.periods.map((p) => ({
      deposited: p.deposited.toNumber(),
      freeInterest: p.freeInterest.toNumber(),
      borrowed: p.borrowed.toNumber(),
    })),
  }
}
export class Reserve {
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
  public settlementTable: ISettlementTable

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
  static math = {
    allocatedInterestAmountForPeriod,
    allocatedInterestRateForPeriod,
    availableInterestForDuration,
    floatingInterestRate,
    utilization,
  }
  constructor(
    private program: ReadonlyProgram,
    t: SettlementTableAccount,
    r: ReserveAccount
  ) {
    const RATIO_DENOM = 1000
    this.market = r.market
    this.token = r.token
    this.decimals = r.decimals
    this.depositNoteMint = r.depositNoteMint
    this.vault = r.vault
    this.settlementTableAddress = r.settlementTable
    this.settlementTable = settlementTableAccountToState(t)
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

  serialize(): IReserve {
    return {
      market: this.market,
      token: this.token,
      decimals: this.decimals,
      vault: this.vault,
      depositNoteMint: this.depositNoteMint,
      settlementTable: this.settlementTable,
      totalDepositNotes: this.totalDepositNotes,
      totalDepositTokens: this.totalDepositTokens,
      totalDebt: this.totalDebt,
      fixedDebt: this.fixedDebt,
      fixedDeposits: this.fixedDeposits,
      minBorrowRate: this.minBorrowRate,
      maxBorrowRate: this.maxBorrowRate,
      pivotBorrowRate: this.pivotBorrowRate,
      targetUtilization: this.targetUtilization,
      variablePoolSubsidy: this.variablePoolSubsidy,
      durationFee: this.durationFee,
    }
  }

  async refresh() {
    const t = (await this.program.account.settlementTable.fetch(
      this.settlementTableAddress
    )) as SettlementTableAccount
    this.settlementTable = settlementTableAccountToState(t)
  }

  utilization() {
    return Reserve.math.utilization(this.totalDebt, this.totalDepositTokens)
  }

  floatingInterestRate() {
    const utilization = this.utilization()
    return Reserve.math.floatingInterestRate(
      utilization,
      this.minBorrowRate,
      this.maxBorrowRate,
      this.pivotBorrowRate,
      this.targetUtilization
    )
  }

  /** Calculate the fixed borrow rate for a hypothetical borrow */
  calcFixedBorrowInterest(amount: number, duration: number) {
    const newUtilization = Reserve.math.utilization(
      this.totalDebt + amount,
      this.totalDepositTokens
    )
    const durationFee = this.durationFee * duration
    const subsidyFee = this.variablePoolSubsidy

    return (
      durationFee +
      subsidyFee +
      Reserve.math.floatingInterestRate(
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
    return Reserve.math.availableInterestForDuration(
      this.settlementTable,
      amount,
      duration
    )
  }
}

function availableInterestForDuration(
  settlementTable: ISettlementTable,
  amount: number,
  duration: number
) {
  return settlementTable.periods
    .slice(0, duration)
    .map((p) =>
      // Calculate interest amount factoring in deposit
      allocatedInterestAmountForPeriod({
        ...p,
        deposited: p.deposited + amount,
      })
    )
    .reduce((a, x) => x + a, 0)
}

function allocatedInterestRateForPeriod(p: ISettlementPeriod) {
  // (1 - ratio^2) * (1 - Interest^2) = 1)
  const ratio = p.deposited / p.borrowed
  return Math.sqrt(1 - 1 / (1 + ratio ** 2))
}

function allocatedInterestAmountForPeriod(p: ISettlementPeriod) {
  if (p.borrowed === 0) return 0
  const rate = allocatedInterestRateForPeriod(p)
  return rate * p.freeInterest
}

type Point = { x: number; y: number }

/** find the y-value between points a & b at x */
function interpolate(x: number, a: Point, b: Point) {
  const { x: x0, y: y0 } = a
  const { x: x1, y: y1 } = b

  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0)
}

function utilization(totalDebt: number, totalDeposits: number) {
  return totalDebt / (totalDebt + totalDeposits)
}

function floatingInterestRate(
  utilization: number,
  minBorrowRate: number,
  maxBorrowRate: number,
  pivotBorrowRate: number,
  targetUtilization: number
) {
  if (utilization <= 0) {
    return minBorrowRate
  }

  if (utilization < targetUtilization) {
    return interpolate(
      utilization,
      { x: 0, y: minBorrowRate },
      { x: targetUtilization, y: pivotBorrowRate }
    )
  }

  if (utilization < 1) {
    return interpolate(
      utilization,
      { x: targetUtilization, y: pivotBorrowRate },
      { x: 1, y: maxBorrowRate }
    )
  }

  return maxBorrowRate
}
