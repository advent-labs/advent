import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { Prog as AdventType, IDL } from "./program"

export type ReadonlyProgram = Omit<Program<AdventType>, "rpc">

export interface SettlementTable {
  periods: SettlementPeriod[]
}

export interface SettlementPeriod {
  deposited: BN
  borrowed: BN
  freeInterest: BN
}
