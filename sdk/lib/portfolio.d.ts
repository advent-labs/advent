import { PublicKey } from "@solana/web3.js";
import { AdventMarket } from "./market";
import { FixedBorrowAccount, FixedDepositAccount, ReadonlyProgram, VariableBorrowAccount, VariableDepositAccount } from "./models";
export interface IFixedBorrow {
    token: PublicKey;
    start: number;
    duration: number;
    amount: number;
    interestAmount: number;
}
export interface IFixedDeposit {
    token: PublicKey;
    start: number;
    duration: number;
    amount: number;
    interestAmount: number;
}
export interface IVariableDeposit {
    token: PublicKey;
    collateralAmount: number;
    collateralCoefficient: number;
    collateralVaultAccount: PublicKey;
}
export interface IVariableBorrow {
    amount: number;
    token: PublicKey;
}
export interface IPortfolio {
    variableDeposits: IVariableDeposit[];
    variableBorrows: IVariableBorrow[];
    fixedBorrows: IFixedBorrow[];
    fixedDeposits: IFixedDeposit[];
}
export declare class AdventPortfolio {
    private program;
    address: PublicKey;
    authority: PublicKey;
    market: AdventMarket;
    positionsKey: PublicKey;
    private _variableDeposits;
    private _variableBorrows;
    private _fixedDeposits;
    private _fixedBorrows;
    constructor(program: ReadonlyProgram, address: PublicKey, authority: PublicKey, market: AdventMarket, positionsKey: PublicKey, _variableDeposits: VariableDepositAccount[], _variableBorrows: VariableBorrowAccount[], _fixedDeposits: FixedDepositAccount[], _fixedBorrows: FixedBorrowAccount[]);
    refresh(): Promise<void>;
    serialize(): IPortfolio;
    get variableDeposits(): IVariableDeposit[];
    get variableBorrows(): IVariableBorrow[];
    get fixedBorrows(): IFixedBorrow[];
    get fixedDeposits(): IFixedDeposit[];
    variableDepositTokensIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    reserveByToken(token: PublicKey): import("./reserve").Reserve;
    variableDepositCollateralIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableWithdrawCollateralIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableWithdrawTokensIX(token: PublicKey, amount: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    fixedBorrowIX(token: PublicKey, amount: number, duration: number): Promise<import("@solana/web3.js").TransactionInstruction>;
    collateralVaultByToken(token: PublicKey): Promise<PublicKey>;
}
