/// <reference types="bn.js" />
import { PublicKey } from "@solana/web3.js";
import { AdventMarket } from "./market";
import { ReadonlyProgram, VariableDepositAccount } from "./models";
import { BN } from "@project-serum/anchor";
export interface FixedBorrow {
    token: PublicKey;
    start: number;
    duration: number;
    amount: number;
    interestAmount: number;
}
export interface FixedBorrowRaw {
    token: PublicKey;
    start: BN;
    duration: BN;
    amount: BN;
    interestAmount: BN;
}
export declare class AdventPortfolio {
    private program;
    address: PublicKey;
    authority: PublicKey;
    market: AdventMarket;
    positionsKey: PublicKey;
    private _variableDeposits;
    private _fixedBorrows;
    constructor(program: ReadonlyProgram, address: PublicKey, authority: PublicKey, market: AdventMarket, positionsKey: PublicKey, _variableDeposits: VariableDepositAccount[], _fixedBorrows: FixedBorrowRaw[]);
    refresh(): Promise<void>;
    get variableDeposits(): VariableDepositAccount[];
    get fixedBorrows(): FixedBorrowRaw[];
    variableDepositTokensIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    reserveByToken(token: PublicKey): import("./reserve").Reserve;
    variableDepositCollateralIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableWithdrawCollateralIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableWithdrawTokensIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    fixedBorrowIX(token: PublicKey, amount: number, duration: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    collateralVaultByToken(token: PublicKey): Promise<PublicKey>;
}
