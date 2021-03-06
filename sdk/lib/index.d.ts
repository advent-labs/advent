import { Connection, PublicKey } from "@solana/web3.js";
import { ReadonlyProgram } from "./models";
import { AdventPortfolio, IPortfolio, IFixedBorrow, IFixedDeposit, IVariableBorrow, IVariableDeposit } from "./portfolio";
import { IReserve, Reserve, ISettlementPeriod, ISettlementTable } from "./reserve";
import { AdventMarket } from "./market";
import { IDLERRORS, parseError } from "./errors";
export { AdventPortfolio, AdventMarket, Reserve, IReserve, ISettlementPeriod, ISettlementTable, IPortfolio, IFixedBorrow, IFixedDeposit, IVariableBorrow, IVariableDeposit, IDLERRORS, parseError, };
export declare class AdventSDK {
    connection: Connection;
    program: ReadonlyProgram;
    constructor(connection: Connection, program?: string);
    market(marketAddress: PublicKey): Promise<AdventMarket>;
    initMarketIX(authority: PublicKey, rewardTokenMint: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    marketPDA(rewardMint: PublicKey): Promise<[PublicKey, number]>;
}
export interface Positions {
    fixedBorrows: any[];
    fixedDeposits: any[];
    variableBorrows: any[];
    variableDeposits: any[];
}
