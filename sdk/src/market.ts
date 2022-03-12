import { BN, utils } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import {
  FixedBorrowAccount,
  FixedDepositAccount,
  ReadonlyProgram,
  ReserveAccount,
  SettlementTableAccount,
  VariableBorrowAccount,
  VariableDepositAccount,
} from "./models"
import { AdventPortfolio } from "./portfolio"
import { Reserve } from "./reserve"
import * as sab from "@saberhq/token-utils"

function reserveAccountToClass(
  r: ReserveAccount,
  p: ReadonlyProgram,
  t: SettlementTableAccount
) {
  return new Reserve(p, t, r)
}
export class AdventMarket {
  constructor(
    private program: ReadonlyProgram,
    public address: PublicKey,
    public rewardTokenMint: PublicKey,
    public authority: PublicKey,
    public bump: number,
    public reserves: Reserve[] = []
  ) {}

  async refresh() {
    this.reserves = await this.allReserves()
  }

  async fetchAllReserves() {
    return this.program.account.reserve.all([
      {
        memcmp: {
          bytes: utils.bytes.bs58.encode(this.address.toBuffer()),
          offset: 8,
        },
      },
    ])
  }

  async fetchAllSettlementTables() {
    return this.program.account.settlementTable.all([
      {
        memcmp: {
          bytes: utils.bytes.bs58.encode(this.address.toBuffer()),
          offset: 8,
        },
      },
    ])
  }

  async portfolio(authority: PublicKey) {
    const [a] = await this.portfolioPDA(authority)
    const portfolio = await this.program.account.portfolio.fetch(a)
    const positions = await this.fetchPositions(portfolio.positions)

    return new AdventPortfolio(
      this.program,
      a,
      authority,
      this,
      portfolio.positions,
      positions.variableDeposits as VariableDepositAccount[],
      positions.variableBorrows as VariableBorrowAccount[],
      positions.fixedDeposits as FixedDepositAccount[],
      positions.fixedBorrows as FixedBorrowAccount[]
    )
  }

  async fetchPositions(address: PublicKey) {
    return this.program.account.positions.fetch(address)
  }

  async fetchReserve(address: PublicKey) {
    return (await this.program.account.reserve.fetch(address)) as ReserveAccount
  }

  async fetchSettlmentTable(address: PublicKey) {
    return (await this.program.account.settlementTable.fetch(
      address
    )) as SettlementTableAccount
  }

  async reserve(token: PublicKey) {
    const [a, _] = await this.reservePDA(token)
    const r = await this.fetchReserve(a)
    const t = r.settlementTable
    const table = await this.fetchSettlmentTable(t)

    return reserveAccountToClass(r, this.program, table)
  }

  async allReserves() {
    const rs = await this.fetchAllReserves()
    const ts = await this.fetchAllSettlementTables()

    const findTable = (r: PublicKey) =>
      ts.find((t) => t.account.reserve.toBase58() === r.toBase58())
        ?.account as SettlementTableAccount

    return rs.map((r) =>
      reserveAccountToClass(
        r.account as ReserveAccount,
        this.program,
        findTable(r.publicKey)
      )
    )
  }

  reserveByToken(token: PublicKey) {
    return this.reserves.find((r) => r.token.equals(token))
  }

  async initPositionsIX(authority: PublicKey, positions: PublicKey) {
    const space = 7048
    const lamports =
      await this.program.provider.connection.getMinimumBalanceForRentExemption(
        space
      )
    return SystemProgram.createAccount({
      fromPubkey: authority,
      newAccountPubkey: positions,
      space,
      lamports,
      programId: this.program.programId,
    })
  }

  async initSettlementTableIX(authority: PublicKey, target: PublicKey) {
    const space = 11752
    const lamports =
      await this.program.provider.connection.getMinimumBalanceForRentExemption(
        space
      )

    return SystemProgram.createAccount({
      fromPubkey: authority,
      newAccountPubkey: target,
      space,
      lamports,
      programId: this.program.programId,
    })
  }

  async initVariableDepositIX(
    authority: PublicKey,
    token: PublicKey,
    positions: PublicKey,
    reserveDepositNoteMint: PublicKey
  ) {
    const [reserve] = await this.reservePDA(token)
    const [collateralVaultAccount] = await this.collateralVaultPDA(
      reserve,
      authority
    )

    return this.program.instruction.initVariableDeposit({
      accounts: {
        authority,
        market: this.address,
        collateralVaultAccount,
        reserve,
        positions,
        depositNoteMint: reserveDepositNoteMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
  }

  async variableDepositTokensIX(
    token: PublicKey,
    amount: number,
    authority: PublicKey
  ) {
    const [reserve] = await this.reservePDA(token)
    const [reserveVault] = await this.reserveVaultPDA(token)

    const r = this.reserveByToken(token)

    if (!r) {
      throw new Error(`Reserve not found for ${token.toBase58()}`)
    }

    const reserveUser = await sab.getATAAddress({
      mint: r.token,
      owner: authority,
    })

    const depositNoteUser = await sab.getATAAddress({
      mint: r.depositNoteMint,
      owner: authority,
    })

    const accounts = {
      authority: authority,
      market: this.address,
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

  async initReserveIX(
    authority: PublicKey,
    settlementTable: PublicKey,
    depositNoteMint: PublicKey,
    token: PublicKey
  ) {
    const [reserve, _] = await this.reservePDA(token)
    const [vault, _v] = await this.reserveVaultPDA(token)

    const settlementTableIX = await this.initSettlementTableIX(
      authority,
      settlementTable
    )
    return [
      settlementTableIX,
      this.program.instruction.initReserve(
        new BN(0),
        new BN(0),
        new BN(0),
        new BN(0),

        {
          accounts: {
            authority,
            market: this.address,
            token,
            reserve,
            vault,
            depositNoteMint,
            settlementTable,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
          },
        }
      ),
    ]
  }

  async initPortfolioIX(authority: PublicKey, positions: PublicKey) {
    const [portfolio, _] = await this.portfolioPDA(authority)
    const positionsIX = await this.initPositionsIX(authority, positions)

    return [
      positionsIX,
      this.program.instruction.initPortfolio({
        accounts: {
          authority,
          market: this.address,
          portfolio,
          positions,
          systemProgram: SystemProgram.programId,
        },
      }),
    ]
  }

  // PDAS
  portfolioPDA(authority: PublicKey) {
    return PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("portfolio"),
        this.address.toBuffer(),
        authority.toBuffer(),
      ],
      this.program.programId
    )
  }

  reservePDA(token: PublicKey) {
    return PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("reserve"),
        this.address.toBuffer(),
        token.toBuffer(),
      ],
      this.program.programId
    )
  }

  reserveVaultPDA(token: PublicKey) {
    return PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("vault"),
        this.address.toBuffer(),
        token.toBuffer(),
      ],
      this.program.programId
    )
  }

  depositNoteMintPDA(token: PublicKey) {
    return PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("deposit-note-mint"),
        this.address.toBuffer(),
        token.toBuffer(),
      ],
      this.program.programId
    )
  }

  collateralVaultPDA(reserve: PublicKey, authority: PublicKey) {
    return PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("collateral"),
        reserve.toBuffer(),
        authority.toBuffer(),
      ],
      this.program.programId
    )
  }
}
