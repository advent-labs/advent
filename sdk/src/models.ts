import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { Advent as AdventType, IDL } from "./program"

export type ReadonlyProgram = Omit<Program<AdventType>, "rpc">

export interface SettlementTable {
  periods: SettlementPeriod[]
}

export interface SettlementPeriod {
  deposited: BN
  borrowed: BN
  freeInterest: BN
}

export interface ReserveAccount {
  market: PublicKey
  token: PublicKey
  decimals: number
  vault: PublicKey
  settlementTable: PublicKey
  depositNoteMint: PublicKey
  totalDepositNotes: BN
  totalDepositTokens: BN
  totalDebt: BN
  fixedDebt: BN
  fixedDeposits: BN
  minBorrowRate: BN
  maxBorrowRate: BN
  pivotBorrowRate: BN
  targetUtilization: BN
  variablePoolSubsidy: BN
  durationFee: BN
}
