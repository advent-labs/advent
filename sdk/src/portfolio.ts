import { PublicKey } from "@solana/web3.js"
import { AdventMarket } from "./market"
import {
  FixedBorrowAccount,
  FixedDepositAccount,
  ReadonlyProgram,
  VariableBorrowAccount,
  VariableDepositAccount,
} from "./models"

import * as sab from "@saberhq/token-utils"
import { BN } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

export interface IFixedBorrow {
  token: PublicKey
  start: number
  duration: number
  amount: number
  interestAmount: number
}

export interface IFixedDeposit {
  token: PublicKey
  start: number
  duration: number
  amount: number
  interestAmount: number
}

export interface IVariableDeposit {
  token: PublicKey
  collateralAmount: number
  collateralCoefficient: number
  collateralVaultAccount: PublicKey
}
export interface IVariableBorrow {
  amount: number
  token: PublicKey
}

export interface IPortfolio {
  positionsAddress: PublicKey
  variableDeposits: IVariableDeposit[]
  variableBorrows: IVariableBorrow[]
  fixedBorrows: IFixedBorrow[]
  fixedDeposits: IFixedDeposit[]
}

function serializeVariableDepositAccount(
  v: VariableDepositAccount
): IVariableDeposit {
  return {
    token: v.token,
    collateralVaultAccount: v.collateralVaultAccount,
    collateralAmount: v.collateralAmount.toNumber(),
    collateralCoefficient: v.collateralCoefficient.toNumber(),
  }
}

function serializeVariableBorrowAccount(
  x: VariableBorrowAccount
): IVariableBorrow {
  return {
    ...x,
    amount: x.amount.toNumber(),
  }
}

function serializeFixedBorrowAccount(x: FixedBorrowAccount): IFixedBorrow {
  return {
    ...x,
    start: x.start.toNumber(),
    duration: x.duration.toNumber(),
    amount: x.amount.toNumber(),
    interestAmount: x.amount.toNumber(),
  }
}

function serializeFixedDepositAccount(x: FixedDepositAccount): IFixedDeposit {
  return {
    ...x,
    start: x.start.toNumber(),
    duration: x.duration.toNumber(),
    amount: x.amount.toNumber(),
    interestAmount: x.amount.toNumber(),
  }
}
export class AdventPortfolio {
  constructor(
    private program: ReadonlyProgram,
    public address: PublicKey,
    public authority: PublicKey,
    public market: AdventMarket,
    public positionsKey: PublicKey,
    private _variableDeposits: VariableDepositAccount[],
    private _variableBorrows: VariableBorrowAccount[],
    private _fixedDeposits: FixedDepositAccount[],
    private _fixedBorrows: FixedBorrowAccount[]
  ) {}

  async refresh() {
    const positions = await this.program.account.positions.fetch(
      this.positionsKey
    )

    this._variableDeposits =
      positions.variableDeposits as VariableDepositAccount[]
    this._fixedBorrows = positions.fixedBorrows as FixedBorrowAccount[]
    this._variableBorrows = positions.variableBorrows as VariableBorrowAccount[]
    this._fixedDeposits = positions.fixedDeposits as FixedDepositAccount[]
  }

  serialize(): IPortfolio {
    return {
      positionsAddress: this.positionsKey,
      variableDeposits: this.variableDeposits,
      variableBorrows: this.variableBorrows,
      fixedBorrows: this.fixedBorrows,
      fixedDeposits: this.fixedDeposits,
    }
  }

  get variableDeposits() {
    return this._variableDeposits
      .filter((x) => x.token.toBase58() !== PublicKey.default.toBase58())
      .map(serializeVariableDepositAccount)
  }

  get variableBorrows() {
    return this._variableBorrows
      .filter((x) => x.token.toBase58() !== PublicKey.default.toBase58())
      .map(serializeVariableBorrowAccount)
  }

  get fixedBorrows() {
    return this._fixedBorrows
      .filter((x) => x.token.toBase58() !== PublicKey.default.toBase58())
      .map(serializeFixedBorrowAccount)
  }

  get fixedDeposits() {
    return this._fixedDeposits
      .filter((x) => x.token.toBase58() !== PublicKey.default.toBase58())
      .map(serializeFixedDepositAccount)
  }

  variableDepositTokensIX(token: PublicKey, amount: number) {
    return this.market.variableDepositTokensIX(token, amount, this.authority)
  }

  reserveByToken(token: PublicKey) {
    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )
    if (!r) {
      throw new Error(`No reserve for token ${token.toBase58()}`)
    }
    return r
  }

  variableDepositCollateralIX(token: PublicKey, amount: number) {
    return this.market.variableDepositCollateralIX(
      token,
      amount,
      this.authority,
      this.positionsKey
    )
  }

  async variableWithdrawCollateralIX(token: PublicKey, amount: number) {
    const [reserve] = await this.market.reservePDA(token)
    const [depositNoteVault] = await this.market.collateralVaultPDA(
      reserve,
      this.authority
    )
    const r = this.reserveByToken(token)
    const depositNoteUser = await sab.getATAAddress({
      mint: r.depositNoteMint,
      owner: this.authority,
    })
    return this.program.instruction.variableWithdrawCollateral(new BN(amount), {
      accounts: {
        authority: this.authority,
        market: this.market.address,
        reserve,
        positions: this.positionsKey,
        depositNoteVault,
        depositNoteUser,
        tokenProgram: sab.TOKEN_PROGRAM_ID,
      },
    })
  }

  async variableWithdrawTokensIX(token: PublicKey, amount: number) {
    const [reserve] = await this.market.reservePDA(token)

    const r = this.reserveByToken(token)

    const depositNoteUser = await sab.getATAAddress({
      mint: r.depositNoteMint,
      owner: this.authority,
    })

    const userReserve = await sab.getATAAddress({
      mint: token,
      owner: this.authority,
    })

    return this.program.instruction.variableWithdrawTokens(new BN(amount), {
      accounts: {
        authority: this.authority,
        market: this.market.address,
        reserve,
        positions: this.positionsKey,
        depositNoteMint: r.depositNoteMint,
        reserveVault: r.vault,
        userReserve,
        depositNoteUser,
        tokenProgram: sab.TOKEN_PROGRAM_ID,
      },
    })
  }

  fixedBorrowIX(token: PublicKey, amount: number, duration: number) {
    return this.market.fixedBorrowIX(
      token,
      amount,
      duration,
      this.authority,
      this.positionsKey
    )
  }

  async collateralVaultByToken(token: PublicKey) {
    const [reserve] = await this.market.reservePDA(token)
    const [collateral] = await this.market.collateralVaultPDA(
      reserve,
      this.authority
    )
    return collateral
  }
}
