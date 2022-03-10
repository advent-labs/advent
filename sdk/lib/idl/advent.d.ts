export declare type Advent = {
    "version": "0.1.0";
    "name": "advent";
    "instructions": [
        {
            "name": "initMarket";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "rewardTokenMint";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "initPortfolio";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "portfolio";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "initVariableDeposit";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "collateralVaultAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "variableDepositTokens";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteUser";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveUser";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "variableDepositCollateral";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteUser";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "variableWithdrawCollateral";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteUser";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "variableWithdrawTokens";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteUser";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userReserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "fixedBorrow";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "settlementTable";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "portfolio";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userReserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                },
                {
                    "name": "duration";
                    "type": "u32";
                }
            ];
        },
        {
            "name": "fixedDeposit";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "portfolio";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "positions";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userReserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amount";
                    "type": "u64";
                },
                {
                    "name": "duration";
                    "type": "u32";
                }
            ];
        },
        {
            "name": "initReserve";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "market";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "token";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reserve";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "depositNoteMint";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "vault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "settlementTable";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "minBorrowRate";
                    "type": "u64";
                },
                {
                    "name": "maxBorrowRate";
                    "type": "u64";
                },
                {
                    "name": "pivotBorrowRate";
                    "type": "u64";
                },
                {
                    "name": "targetUtilization";
                    "type": "u64";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "market";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "rewardTokenMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "authority";
                        "type": "publicKey";
                    },
                    {
                        "name": "quoteTokenMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "quoteTokenDecimals";
                        "type": "u8";
                    },
                    {
                        "name": "bump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    },
                    {
                        "name": "reserves";
                        "type": {
                            "array": [
                                {
                                    "defined": "ReserveInfo";
                                },
                                16
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "positions";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "variableDeposits";
                        "type": {
                            "array": [
                                {
                                    "defined": "VariableDeposit";
                                },
                                16
                            ];
                        };
                    },
                    {
                        "name": "fixedDeposits";
                        "type": {
                            "array": [
                                {
                                    "defined": "FixedDeposit";
                                },
                                32
                            ];
                        };
                    },
                    {
                        "name": "fixedBorrows";
                        "type": {
                            "array": [
                                {
                                    "defined": "FixedBorrow";
                                },
                                32
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "portfolio";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "main";
                        "type": "publicKey";
                    },
                    {
                        "name": "positions";
                        "type": "publicKey";
                    },
                    {
                        "name": "authority";
                        "type": "publicKey";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "reserve";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "market";
                        "type": "publicKey";
                    },
                    {
                        "name": "token";
                        "type": "publicKey";
                    },
                    {
                        "name": "decimals";
                        "type": "i16";
                    },
                    {
                        "name": "cachedPriceQuote";
                        "type": "u64";
                    },
                    {
                        "name": "depositNoteMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "totalDebt";
                        "type": "u64";
                    },
                    {
                        "name": "fixedDebt";
                        "type": "u64";
                    },
                    {
                        "name": "fixedDeposits";
                        "type": "u64";
                    },
                    {
                        "name": "totalDepositNotes";
                        "type": "u64";
                    },
                    {
                        "name": "totalDepositTokens";
                        "type": "u64";
                    },
                    {
                        "name": "vault";
                        "type": "publicKey";
                    },
                    {
                        "name": "pythOraclePrice";
                        "type": "publicKey";
                    },
                    {
                        "name": "settlementTable";
                        "type": "publicKey";
                    },
                    {
                        "name": "minBorrowRate";
                        "type": "u64";
                    },
                    {
                        "name": "maxBorrowRate";
                        "type": "u64";
                    },
                    {
                        "name": "pivotBorrowRate";
                        "type": "u64";
                    },
                    {
                        "name": "targetUtilization";
                        "type": "u64";
                    },
                    {
                        "name": "variablePoolSubsidy";
                        "type": "u64";
                    },
                    {
                        "name": "durationFee";
                        "type": "u64";
                    },
                    {
                        "name": "bump";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "settlementTable";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "market";
                        "type": "publicKey";
                    },
                    {
                        "name": "reserve";
                        "type": "publicKey";
                    },
                    {
                        "name": "periods";
                        "type": {
                            "array": [
                                {
                                    "defined": "SettlementPeriod";
                                },
                                365
                            ];
                        };
                    }
                ];
            };
        }
    ];
    "types": [
        {
            "name": "Number";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "val";
                        "type": "i128";
                    }
                ];
            };
        },
        {
            "name": "ReserveInfo";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "reserve";
                        "type": "publicKey";
                    },
                    {
                        "name": "price";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "FixedDeposit";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "token";
                        "type": "publicKey";
                    },
                    {
                        "name": "start";
                        "type": "u64";
                    },
                    {
                        "name": "duration";
                        "type": "u64";
                    },
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "interestAmount";
                        "type": "u64";
                    },
                    {
                        "name": "depositNoteVault";
                        "type": "publicKey";
                    }
                ];
            };
        },
        {
            "name": "FixedBorrow";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "token";
                        "type": "publicKey";
                    },
                    {
                        "name": "start";
                        "type": "u32";
                    },
                    {
                        "name": "duration";
                        "type": "u32";
                    },
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "interestAmount";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "VariableDeposit";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "token";
                        "type": "publicKey";
                    },
                    {
                        "name": "collateralVaultAccount";
                        "type": "publicKey";
                    },
                    {
                        "name": "collateralAmount";
                        "type": "u64";
                    },
                    {
                        "name": "collateralCoefficient";
                        "type": "u64";
                    }
                ];
            };
        },
        {
            "name": "SettlementPeriod";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "deposited";
                        "type": "u64";
                    },
                    {
                        "name": "borrowed";
                        "type": "u64";
                    },
                    {
                        "name": "freeInterest";
                        "type": "u64";
                    }
                ];
            };
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "NoFreeReserves";
            "msg": "no free space left to add a new reserve in the market";
        },
        {
            "code": 6001;
            "name": "NoFreeVariableDeposits";
            "msg": "no free space left to add a new variable deposit to the portfolio";
        },
        {
            "code": 6002;
            "name": "NoFreeFixedBorrow";
            "msg": "no free space left to add a new fixed borrow to the portfolio";
        },
        {
            "code": 6003;
            "name": "UnregisteredVariableDeposit";
            "msg": "unregistered variable deposit";
        }
    ];
};
export declare const IDL: Advent;
