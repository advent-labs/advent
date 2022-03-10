/// <reference types="bn.js" />
import { BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Advent as AdventType } from "./program";
export declare type ReadonlyProgram = Omit<Program<AdventType>, "rpc">;
export interface SettlementTableAccount {
    periods: SettlementPeriodAccount[];
}
export interface SettlementPeriodAccount {
    deposited: BN;
    borrowed: BN;
    freeInterest: BN;
}
export interface ReserveAccount {
    market: PublicKey;
    token: PublicKey;
    decimals: number;
    vault: PublicKey;
    settlementTable: PublicKey;
    depositNoteMint: PublicKey;
    totalDepositNotes: BN;
    totalDepositTokens: BN;
    totalDebt: BN;
    fixedDebt: BN;
    fixedDeposits: BN;
    minBorrowRate: BN;
    maxBorrowRate: BN;
    pivotBorrowRate: BN;
    targetUtilization: BN;
    variablePoolSubsidy: BN;
    durationFee: BN;
}
export interface SettlementTableAccount {
    reserve: PublicKey;
    periods: {
        deposited: BN;
        borrowed: BN;
        freeInterest: BN;
    }[];
}
export interface VariableDepositAccount {
    amount: BN;
    token: PublicKey;
    collateralVaultAccount: PublicKey;
}
