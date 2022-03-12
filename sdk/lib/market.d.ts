import { PublicKey } from "@solana/web3.js";
import { ReadonlyProgram, ReserveAccount, SettlementTableAccount } from "./models";
import { AdventPortfolio } from "./portfolio";
import { Reserve } from "./reserve";
export declare class AdventMarket {
    private program;
    address: PublicKey;
    rewardTokenMint: PublicKey;
    authority: PublicKey;
    bump: number;
    reserves: Reserve[];
    constructor(program: ReadonlyProgram, address: PublicKey, rewardTokenMint: PublicKey, authority: PublicKey, bump: number, reserves?: Reserve[]);
    refresh(): Promise<void>;
    fetchAllReserves(): Promise<import("@project-serum/anchor").ProgramAccount<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "market";
        type: {
            kind: "struct";
            fields: [{
                name: "rewardTokenMint";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "quoteTokenMint";
                type: "publicKey";
            }, {
                name: "quoteTokenDecimals";
                type: "u8";
            }, {
                name: "bump";
                type: {
                    array: ["u8", 1];
                };
            }, {
                name: "reserves";
                type: {
                    array: [{
                        defined: "ReserveInfo";
                    }, 16];
                };
            }];
        };
    } | {
        name: "positions";
        type: {
            kind: "struct";
            fields: [{
                name: "variableDeposits";
                type: {
                    array: [{
                        defined: "VariableDeposit";
                    }, 16];
                };
            }, {
                name: "variableBorrows";
                type: {
                    array: [{
                        defined: "VariableBorrow";
                    }, 16];
                };
            }, {
                name: "fixedDeposits";
                type: {
                    array: [{
                        defined: "FixedDeposit";
                    }, 32];
                };
            }, {
                name: "fixedBorrows";
                type: {
                    array: [{
                        defined: "FixedBorrow";
                    }, 32];
                };
            }];
        };
    } | {
        name: "portfolio";
        type: {
            kind: "struct";
            fields: [{
                name: "main";
                type: "publicKey";
            }, {
                name: "positions";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "reserve";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "token";
                type: "publicKey";
            }, {
                name: "decimals";
                type: "i16";
            }, {
                name: "cachedPriceQuote";
                type: "u64";
            }, {
                name: "depositNoteMint";
                type: "publicKey";
            }, {
                name: "totalDebt";
                type: "u64";
            }, {
                name: "fixedDebt";
                type: "u64";
            }, {
                name: "fixedDeposits";
                type: "u64";
            }, {
                name: "totalDepositNotes";
                type: "u64";
            }, {
                name: "totalDepositTokens";
                type: "u64";
            }, {
                name: "vault";
                type: "publicKey";
            }, {
                name: "pythOraclePrice";
                type: "publicKey";
            }, {
                name: "settlementTable";
                type: "publicKey";
            }, {
                name: "minBorrowRate";
                type: "u64";
            }, {
                name: "maxBorrowRate";
                type: "u64";
            }, {
                name: "pivotBorrowRate";
                type: "u64";
            }, {
                name: "targetUtilization";
                type: "u64";
            }, {
                name: "variablePoolSubsidy";
                type: "u64";
            }, {
                name: "durationFee";
                type: "u64";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "settlementTable";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "reserve";
                type: "publicKey";
            }, {
                name: "periods";
                type: {
                    array: [{
                        defined: "SettlementPeriod";
                    }, 365];
                };
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import("./program").Advent>>>[]>;
    fetchAllSettlementTables(): Promise<import("@project-serum/anchor").ProgramAccount<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "market";
        type: {
            kind: "struct";
            fields: [{
                name: "rewardTokenMint";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "quoteTokenMint";
                type: "publicKey";
            }, {
                name: "quoteTokenDecimals";
                type: "u8";
            }, {
                name: "bump";
                type: {
                    array: ["u8", 1];
                };
            }, {
                name: "reserves";
                type: {
                    array: [{
                        defined: "ReserveInfo";
                    }, 16];
                };
            }];
        };
    } | {
        name: "positions";
        type: {
            kind: "struct";
            fields: [{
                name: "variableDeposits";
                type: {
                    array: [{
                        defined: "VariableDeposit";
                    }, 16];
                };
            }, {
                name: "variableBorrows";
                type: {
                    array: [{
                        defined: "VariableBorrow";
                    }, 16];
                };
            }, {
                name: "fixedDeposits";
                type: {
                    array: [{
                        defined: "FixedDeposit";
                    }, 32];
                };
            }, {
                name: "fixedBorrows";
                type: {
                    array: [{
                        defined: "FixedBorrow";
                    }, 32];
                };
            }];
        };
    } | {
        name: "portfolio";
        type: {
            kind: "struct";
            fields: [{
                name: "main";
                type: "publicKey";
            }, {
                name: "positions";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "reserve";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "token";
                type: "publicKey";
            }, {
                name: "decimals";
                type: "i16";
            }, {
                name: "cachedPriceQuote";
                type: "u64";
            }, {
                name: "depositNoteMint";
                type: "publicKey";
            }, {
                name: "totalDebt";
                type: "u64";
            }, {
                name: "fixedDebt";
                type: "u64";
            }, {
                name: "fixedDeposits";
                type: "u64";
            }, {
                name: "totalDepositNotes";
                type: "u64";
            }, {
                name: "totalDepositTokens";
                type: "u64";
            }, {
                name: "vault";
                type: "publicKey";
            }, {
                name: "pythOraclePrice";
                type: "publicKey";
            }, {
                name: "settlementTable";
                type: "publicKey";
            }, {
                name: "minBorrowRate";
                type: "u64";
            }, {
                name: "maxBorrowRate";
                type: "u64";
            }, {
                name: "pivotBorrowRate";
                type: "u64";
            }, {
                name: "targetUtilization";
                type: "u64";
            }, {
                name: "variablePoolSubsidy";
                type: "u64";
            }, {
                name: "durationFee";
                type: "u64";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "settlementTable";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "reserve";
                type: "publicKey";
            }, {
                name: "periods";
                type: {
                    array: [{
                        defined: "SettlementPeriod";
                    }, 365];
                };
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import("./program").Advent>>>[]>;
    portfolio(authority: PublicKey): Promise<AdventPortfolio>;
    fetchPositions(address: PublicKey): Promise<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "market";
        type: {
            kind: "struct";
            fields: [{
                name: "rewardTokenMint";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "quoteTokenMint";
                type: "publicKey";
            }, {
                name: "quoteTokenDecimals";
                type: "u8";
            }, {
                name: "bump";
                type: {
                    array: ["u8", 1];
                };
            }, {
                name: "reserves";
                type: {
                    array: [{
                        defined: "ReserveInfo";
                    }, 16];
                };
            }];
        };
    } | {
        name: "positions";
        type: {
            kind: "struct";
            fields: [{
                name: "variableDeposits";
                type: {
                    array: [{
                        defined: "VariableDeposit";
                    }, 16];
                };
            }, {
                name: "variableBorrows";
                type: {
                    array: [{
                        defined: "VariableBorrow";
                    }, 16];
                };
            }, {
                name: "fixedDeposits";
                type: {
                    array: [{
                        defined: "FixedDeposit";
                    }, 32];
                };
            }, {
                name: "fixedBorrows";
                type: {
                    array: [{
                        defined: "FixedBorrow";
                    }, 32];
                };
            }];
        };
    } | {
        name: "portfolio";
        type: {
            kind: "struct";
            fields: [{
                name: "main";
                type: "publicKey";
            }, {
                name: "positions";
                type: "publicKey";
            }, {
                name: "authority";
                type: "publicKey";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "reserve";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "token";
                type: "publicKey";
            }, {
                name: "decimals";
                type: "i16";
            }, {
                name: "cachedPriceQuote";
                type: "u64";
            }, {
                name: "depositNoteMint";
                type: "publicKey";
            }, {
                name: "totalDebt";
                type: "u64";
            }, {
                name: "fixedDebt";
                type: "u64";
            }, {
                name: "fixedDeposits";
                type: "u64";
            }, {
                name: "totalDepositNotes";
                type: "u64";
            }, {
                name: "totalDepositTokens";
                type: "u64";
            }, {
                name: "vault";
                type: "publicKey";
            }, {
                name: "pythOraclePrice";
                type: "publicKey";
            }, {
                name: "settlementTable";
                type: "publicKey";
            }, {
                name: "minBorrowRate";
                type: "u64";
            }, {
                name: "maxBorrowRate";
                type: "u64";
            }, {
                name: "pivotBorrowRate";
                type: "u64";
            }, {
                name: "targetUtilization";
                type: "u64";
            }, {
                name: "variablePoolSubsidy";
                type: "u64";
            }, {
                name: "durationFee";
                type: "u64";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "settlementTable";
        type: {
            kind: "struct";
            fields: [{
                name: "market";
                type: "publicKey";
            }, {
                name: "reserve";
                type: "publicKey";
            }, {
                name: "periods";
                type: {
                    array: [{
                        defined: "SettlementPeriod";
                    }, 365];
                };
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import("./program").Advent>>>;
    fetchReserve(address: PublicKey): Promise<ReserveAccount>;
    fetchSettlmentTable(address: PublicKey): Promise<SettlementTableAccount>;
    reserve(token: PublicKey): Promise<Reserve>;
    allReserves(): Promise<Reserve[]>;
    reserveByToken(token: PublicKey): Reserve;
    initPositionsIX(authority: PublicKey, positions: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    initSettlementTableIX(authority: PublicKey, target: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    initVariableDepositIX(authority: PublicKey, token: PublicKey, positions: PublicKey, reserveDepositNoteMint: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableDepositCollateralIX(token: PublicKey, amount: number, authority: PublicKey, positions: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    variableDepositTokensIX(token: PublicKey, amount: number, authority: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction>;
    initReserveIX(authority: PublicKey, settlementTable: PublicKey, depositNoteMint: PublicKey, token: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction[]>;
    initPortfolioIX(authority: PublicKey, positions: PublicKey): Promise<import("@solana/web3.js").TransactionInstruction[]>;
    portfolioPDA(authority: PublicKey): Promise<[PublicKey, number]>;
    reservePDA(token: PublicKey): Promise<[PublicKey, number]>;
    reserveVaultPDA(token: PublicKey): Promise<[PublicKey, number]>;
    depositNoteMintPDA(token: PublicKey): Promise<[PublicKey, number]>;
    collateralVaultPDA(reserve: PublicKey, authority: PublicKey): Promise<[PublicKey, number]>;
}
