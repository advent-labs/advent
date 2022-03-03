import { PublicKey } from "@solana/web3.js"
import { AdventMarket, VariableDepositAccount } from "."
import { ReadonlyProgram } from "./models"

import * as sab from "@saberhq/token-utils"
import { BN } from "@project-serum/anchor"
import { getATAAddress } from "@saberhq/token-utils"

export class AdventPortfolio {
  constructor(
    private program: ReadonlyProgram,
    public address: PublicKey,
    public authority: PublicKey,
    public market: AdventMarket,
    public positionsKey: PublicKey,
    private _variableDeposits: VariableDepositAccount[]
  ) {}

  async refresh() {
    const positions = await this.program.account.positions.fetch(
      this.positionsKey
    )

    this._variableDeposits =
      positions.variableDeposits as VariableDepositAccount[]
  }

  get variableDeposits() {
    return this._variableDeposits.filter(
      (x) => x.token.toBase58() !== PublicKey.default.toBase58()
    )
  }

  async getVariableDeposits() {
    const vds = this.variableDeposits
    const collateralVaultAccounts = vds.map((v) => v.collateralVaultAccount)
    const tokenAccounts = await Promise.all(
      vds.map((v) => getATAAddress({ mint: v.token, owner: this.authority }))
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

    return this.program.instruction.variableDepositTokens(new BN(amount), {
      accounts: {
        authority: this.authority,
        market: this.market.address,
        reserve,
        depositNoteMint: r.depositNoteMint,
        reserveVault,
        reserveUser,
        depositNoteUser,
        tokenProgram: sab.TOKEN_PROGRAM_ID,
      },
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

  async collateralVaultByToken(token: PublicKey) {
    const [reserve] = await this.market.reservePDA(token)
    const [collateral] = await this.market.collateralVaultPDA(
      reserve,
      this.authority
    )
    return collateral
  }
}
