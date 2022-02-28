export type Prog = {
  "version": "0.1.0",
  "name": "prog",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "main",
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
            "type": "u8"
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
            "name": "main",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoFreeReserves",
      "msg": "no free space left to add a new reserve in the market"
    },
    {
      "code": 6001,
      "name": "NoFreeVariableDeposits",
      "msg": "no free space left to add a new variable deposit to the portfolio"
    },
    {
      "code": 6002,
      "name": "NoFreeFixedBorrow",
      "msg": "no free space left to add a new fixed borrow to the portfolio"
    },
    {
      "code": 6003,
      "name": "UnregisteredVariableDeposit",
      "msg": "unregistered variable deposit"
    }
  ]
};

export const IDL: Prog = {
  "version": "0.1.0",
  "name": "prog",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "main",
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
            "type": "u8"
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
            "name": "main",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoFreeReserves",
      "msg": "no free space left to add a new reserve in the market"
    },
    {
      "code": 6001,
      "name": "NoFreeVariableDeposits",
      "msg": "no free space left to add a new variable deposit to the portfolio"
    },
    {
      "code": 6002,
      "name": "NoFreeFixedBorrow",
      "msg": "no free space left to add a new fixed borrow to the portfolio"
    },
    {
      "code": 6003,
      "name": "UnregisteredVariableDeposit",
      "msg": "unregistered variable deposit"
    }
  ]
};
