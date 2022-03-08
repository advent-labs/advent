import { BN } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { ReadonlyProgram, SettlementPeriod, SettlementTable } from "./models"

export class Reserve {
  constructor(
    private program: ReadonlyProgram,
    public market: PublicKey,
    public token: PublicKey,
    public depositNoteMint: PublicKey,
    public vault: PublicKey,
    public settlementTableKey: PublicKey,
    public settlementTable: SettlementTable
  ) {}

  async refresh() {
    const settlementTable = (await this.program.account.settlementTable.fetch(
      this.settlementTableKey
    )) as SettlementTable
    this.settlementTable = settlementTable
  }

  availableInterestForDuration(amount: number, duration: number) {
    return this.settlementTable.periods
      .slice(0, duration)
      .reduce((a, x) => x.freeInterest.add(a), new BN(0))
      .toNumber()
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
