import { PublicKey } from "@solana/web3.js"
import { AdventMarket, VariableDepositAccount } from "."
import { ReadonlyProgram } from "./models"

import * as sab from "@saberhq/token-utils"
import { BN } from "@project-serum/anchor"
import { getATAAddress } from "@saberhq/token-utils"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

export interface FixedBorrow {
  token: PublicKey
  start: number
  duration: number
  amount: number
  interestAmount: number
}
export interface FixedBorrowRaw {
  token: PublicKey
  start: BN
  duration: BN
  amount: BN
  interestAmount: BN
}
export class AdventPortfolio {
  constructor(
    private program: ReadonlyProgram,
    public address: PublicKey,
    public authority: PublicKey,
    public market: AdventMarket,
    public positionsKey: PublicKey,
    private _variableDeposits: VariableDepositAccount[],
    private _fixedBorrows: FixedBorrowRaw[]
  ) {}

  async refresh() {
    const positions = await this.program.account.positions.fetch(
      this.positionsKey
    )

    this._variableDeposits =
      positions.variableDeposits as VariableDepositAccount[]

    this._fixedBorrows = positions.fixedBorrows as FixedBorrowRaw[]
  }

  get variableDeposits() {
    return this._variableDeposits.filter(
      (x) => x.token.toBase58() !== PublicKey.default.toBase58()
    )
  }

  get fixedBorrows() {
    return this._fixedBorrows.filter(
      (x) => x.token.toBase58() !== PublicKey.default.toBase58()
    )
  }

  async variableDepositTokensIX(token: PublicKey, amount: number) {
    const [reserve] = await this.market.reservePDA(token)
    const [reserveVault] = await this.market.reserveVaultPDA(token)

    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )

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

  async variableDepositCollateralIX(token: PublicKey, amount: number) {
    const [reserve] = await this.market.reservePDA(token)
    const [depositNoteVault] = await this.market.collateralVaultPDA(
      reserve,
      this.authority
    )
    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )
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
    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )
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

    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )

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

    const r = this.market.reserves.find(
      (r) => r.token.toBase58() === token.toBase58()
    )

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
          settlementTable: r.settlementTableKey,
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
