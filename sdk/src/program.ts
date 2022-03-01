export type Prog = {
  "version": "0.1.0",
  "name": "prog",
  "instructions": [
    {
      "name": "initMarket",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initPortfolio",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initVariableDeposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "variableDeposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initReserve",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetUtilization",
          "type": "u64"
        },
        {
          "name": "borrowRate0",
          "type": "u64"
        },
        {
          "name": "borrowRate1",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenDecimals",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "reserves",
            "type": {
              "array": [
                {
                  "defined": "ReserveInfo"
                },
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "portfolio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "main",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "fixedDeposits",
            "type": {
              "array": [
                {
                  "defined": "FixedDeposit"
                },
                32
              ]
            }
          },
          {
            "name": "fixedBorrows",
            "type": {
              "array": [
                {
                  "defined": "FixedBorrow"
                },
                32
              ]
            }
          },
          {
            "name": "variableDeposits",
            "type": {
              "array": [
                {
                  "defined": "VariableDeposit"
                },
                16
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reserve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "cachedPriceQuote",
            "type": "u64"
          },
          {
            "name": "totalDebt",
            "type": "u64"
          },
          {
            "name": "totalDeposits",
            "type": "u64"
          },
          {
            "name": "totalLoanNotes",
            "type": "u64"
          },
          {
            "name": "totalDepositNotes",
            "type": "u64"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "pythOraclePrice",
            "type": "publicKey"
          },
          {
            "name": "depositNoteMint",
            "type": "publicKey"
          },
          {
            "name": "periods",
            "type": {
              "array": [
                {
                  "defined": "SettlementPeriod"
                },
                365
              ]
            }
          },
          {
            "name": "policy",
            "type": {
              "defined": "ReservePolicy"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ReserveInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reserve",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FixedDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FixedBorrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "VariableDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "depositNotes",
            "type": "u64"
          },
          {
            "name": "collateralCoefficient",
            "type": "u64"
          },
          {
            "name": "collateralVaultAccount",
            "type": "publicKey"
          },
          {
            "name": "collateralVaultAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ReservePolicy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "targetUtilization",
            "type": "u64"
          },
          {
            "name": "borrowRate0",
            "type": "u64"
          },
          {
            "name": "borrowRate1",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SettlementPeriod",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deposited",
            "type": "u64"
          },
          {
            "name": "borrowed",
            "type": "u64"
          },
          {
            "name": "freeInterest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ErrorCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoFreeReserves"
          },
          {
            "name": "NoFreeVariableDeposits"
          },
          {
            "name": "NoFreeFixedBorrow"
          },
          {
            "name": "UnregisteredVariableDeposit"
          }
        ]
      }
    }
  ]
};

export const IDL: Prog = {
  "version": "0.1.0",
  "name": "prog",
  "instructions": [
    {
      "name": "initMarket",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initPortfolio",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initVariableDeposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "variableDeposit",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "portfolio",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositNoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initReserve",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserve",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetUtilization",
          "type": "u64"
        },
        {
          "name": "borrowRate0",
          "type": "u64"
        },
        {
          "name": "borrowRate1",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardTokenMint",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenDecimals",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "reserves",
            "type": {
              "array": [
                {
                  "defined": "ReserveInfo"
                },
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "portfolio",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "main",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "fixedDeposits",
            "type": {
              "array": [
                {
                  "defined": "FixedDeposit"
                },
                32
              ]
            }
          },
          {
            "name": "fixedBorrows",
            "type": {
              "array": [
                {
                  "defined": "FixedBorrow"
                },
                32
              ]
            }
          },
          {
            "name": "variableDeposits",
            "type": {
              "array": [
                {
                  "defined": "VariableDeposit"
                },
                16
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reserve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "cachedPriceQuote",
            "type": "u64"
          },
          {
            "name": "totalDebt",
            "type": "u64"
          },
          {
            "name": "totalDeposits",
            "type": "u64"
          },
          {
            "name": "totalLoanNotes",
            "type": "u64"
          },
          {
            "name": "totalDepositNotes",
            "type": "u64"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "pythOraclePrice",
            "type": "publicKey"
          },
          {
            "name": "depositNoteMint",
            "type": "publicKey"
          },
          {
            "name": "periods",
            "type": {
              "array": [
                {
                  "defined": "SettlementPeriod"
                },
                365
              ]
            }
          },
          {
            "name": "policy",
            "type": {
              "defined": "ReservePolicy"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ReserveInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reserve",
            "type": "publicKey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FixedDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FixedBorrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "VariableDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "depositNotes",
            "type": "u64"
          },
          {
            "name": "collateralCoefficient",
            "type": "u64"
          },
          {
            "name": "collateralVaultAccount",
            "type": "publicKey"
          },
          {
            "name": "collateralVaultAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ReservePolicy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "targetUtilization",
            "type": "u64"
          },
          {
            "name": "borrowRate0",
            "type": "u64"
          },
          {
            "name": "borrowRate1",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SettlementPeriod",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deposited",
            "type": "u64"
          },
          {
            "name": "borrowed",
            "type": "u64"
          },
          {
            "name": "freeInterest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ErrorCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoFreeReserves"
          },
          {
            "name": "NoFreeVariableDeposits"
          },
          {
            "name": "NoFreeFixedBorrow"
          },
          {
            "name": "UnregisteredVariableDeposit"
          }
        ]
      }
    }
  ]
};
