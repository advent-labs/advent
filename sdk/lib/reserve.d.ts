import { PublicKey } from "@solana/web3.js";
import { ReadonlyProgram, ReserveAccount, SettlementTableAccount } from "./models";
export interface ISettlementPeriod {
    deposited: number;
    borrowed: number;
    freeInterest: number;
}
export interface ISettlementTable {
    periods: ISettlementPeriod[];
}
export interface IReserve {
    market: PublicKey;
    token: PublicKey;
    decimals: number;
    vault: PublicKey;
    depositNoteMint: PublicKey;
    settlementTable: ISettlementTable;
    totalDepositNotes: number;
    totalDepositTokens: number;
    totalDebt: number;
    fixedDebt: number;
    fixedDeposits: number;
    minBorrowRate: number;
    maxBorrowRate: number;
    pivotBorrowRate: number;
    targetUtilization: number;
    variablePoolSubsidy: number;
    durationFee: number;
}
export declare class Reserve {
    private program;
    market: PublicKey;
    token: PublicKey;
    decimals: number;
    depositNoteMint: PublicKey;
    vault: PublicKey;
    settlementTableAddress: PublicKey;
    settlementTable: ISettlementTable;
    totalDepositNotes: number;
    totalDepositTokens: number;
    totalDebt: number;
    fixedDebt: number;
    fixedDeposits: number;
    minBorrowRate: number;
    maxBorrowRate: number;
    pivotBorrowRate: number;
    targetUtilization: number;
    variablePoolSubsidy: number;
    durationFee: number;
    static math: {
        allocatedInterestAmountForPeriod: typeof allocatedInterestAmountForPeriod;
        allocatedInterestRateForPeriod: typeof allocatedInterestRateForPeriod;
        availableInterestForDuration: typeof availableInterestForDuration;
        floatingInterestRate: typeof floatingInterestRate;
        utilization: typeof utilization;
    };
    constructor(program: ReadonlyProgram, t: SettlementTableAccount, r: ReserveAccount);
    serialize(): IReserve;
    refresh(): Promise<void>;
    utilization(): number;
    floatingInterestRate(): number;
    /** Calculate the fixed borrow rate for a hypothetical borrow */
    calcFixedBorrowInterest(amount: number, duration: number): number;
    /** How much interest will a deposit receive? */
    availableInterestForDuration(amount: number, duration: number): number;
}
declare function availableInterestForDuration(settlementTable: ISettlementTable, amount: number, duration: number): number;
declare function allocatedInterestRateForPeriod(p: ISettlementPeriod): number;
declare function allocatedInterestAmountForPeriod(p: ISettlementPeriod): number;
declare function utilization(totalDebt: number, totalDeposits: number): number;
declare function floatingInterestRate(utilization: number, minBorrowRate: number, maxBorrowRate: number, pivotBorrowRate: number, targetUtilization: number): number;
export {};
