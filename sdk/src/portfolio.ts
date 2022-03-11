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

  async variableDepositTokensIX(token: PublicKey, amount: number) {
    const [reserve] = await this.market.reservePDA(token)
    const [reserveVault] = await this.market.reserveVaultPDA(token)

    const r = this.reserveByToken(token)

    const reserveUser = await sab.getATAAddress({
      mint: r.token,
      owner: this.authority,
    })

    const depositNoteUser = await sab.getATAAddress({
      mint: r.depositNoteMint,
      owner: this.authority,
    })

    const accounts = {
      authority: this.authority,
      market: this.market.address,
      reserve,
      depositNoteMint: r.depositNoteMint,
      reserveVault,
      reserveUser,
      depositNoteUser,
      tokenProgram: sab.TOKEN_PROGRAM_ID,
    }
    return this.program.instruction.variableDepositTokens(new BN(amount), {
      accounts,
    })
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

  async variableDepositCollateralIX(token: PublicKey, amount: number) {
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
    return this.program.instruction.variableDepositCollateral(new BN(amount), {
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

  async fixedBorrowIX(token: PublicKey, amount: number, duration: number) {
    const [reserve] = await this.market.reservePDA(token)

    const r = this.reserveByToken(token)

    const userReserve = await sab.getATAAddress({
      mint: token,
      owner: this.authority,
    })

    return this.program.instruction.fixedBorrow(
      new BN(amount),
      new BN(duration),
      {
        accounts: {
          authority: this.authority,
          market: this.market.address,
          reserve,
          settlementTable: r.settlementTableAddress,
          portfolio: this.address,
          positions: this.positionsKey,
          reserveVault: r.vault,
          userReserve,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
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
