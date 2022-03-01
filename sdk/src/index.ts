import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js"
import { Prog as AdventType, IDL } from "./program"

const DEFAULT_PROGRAM_ID = "ke798ave2o7MMZkriRUPSCz1aLrrmPQY2zHdrikJ298"
type ReadonlyProgram = Omit<Program<AdventType>, "rpc">

export class AdventSDK {
  public program: ReadonlyProgram

  constructor(public connection: Connection, program = DEFAULT_PROGRAM_ID) {
    const wallet = new Wallet(Keypair.generate())
    const provider = new Provider(
      this.connection,
      wallet,
      Provider.defaultOptions()
    )
    this.program = new Program(IDL, new PublicKey(program), provider)
  }

  async market(market: PublicKey) {
    const m = await this.program.account.market.fetch(market)
    return new AdventMarket(
      this.program,
      market,
      m.rewardTokenMint,
      m.authority,
      m.bump[0]
    )
  }

  async initMarketIX(authority: PublicKey, rewardTokenMint: PublicKey) {
    const [market, bump] = await this.marketPDA(rewardTokenMint)

    return this.program.instruction.initMarket({
      accounts: {
        authority,
        market,
        rewardTokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
  }

  // PDAS //
  marketPDA(rewardMint: PublicKey) {
    return PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("market"), rewardMint.toBuffer()],
      this.program.programId
    )
  }
}

export class AdventMarket {
  constructor(
    private program: ReadonlyProgram,
    public address: PublicKey,
    public rewardTokenMint: PublicKey,
    public authority: PublicKey,
    public bump: number
  ) {}

  async refresh() {
    const m = this.program.account.market.fetch(this.address)
    const rs = await this.fetchAllReserves()
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
    const [a, _] = await this.portfolioPDA(authority)
    const portfolio = await this.program.account.portfolio.fetch(a)
    const positions = await this.fetchPositions(portfolio.positions)
    return new Portfolio(
      this.program,
      authority,
      this.address,
      portfolio.positions,
      positions.variableDeposits as VariableDeposit[]
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
        .account as SettlementTableAccount

    return rs.map((r) =>
      reserveAccountToClass(r.account, this.program, findTable(r.publicKey))
    )
  }

  async initPositionsIX(authority: PublicKey, positions: PublicKey) {
    const space = 5640
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
    const space = 8832
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
    collateralVaultAccount: PublicKey,
    reserveDepositNoteMint: PublicKey
  ) {
    const [reserve, _] = await this.reservePDA(token)
    const [portfolio, __] = await this.portfolioPDA(token)

    return this.program.instruction.initVariableDeposit({
      accounts: {
        authority,
        market: this.address,
        collateralVaultAccount,
        reserve,
        portfolio,
        depositNoteMint: reserveDepositNoteMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
  }

  async initReserveIX(
    authority: PublicKey,
    settlementTable: PublicKey,
    depositNoteMint: PublicKey,
    token: PublicKey
  ) {
    const [reserve, _] = await this.reservePDA(token)
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

        {
          accounts: {
            authority,
            market: this.address,
            token,
            reserve,
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
}

function reserveAccountToClass(
  r: ReserveAccount,
  p: ReadonlyProgram,
  t: SettlementTableAccount
) {
  return new Reserve(p, r.market, r.token, r.settlementTable, t)
}

interface ReserveAccount {
  market: PublicKey
  token: PublicKey
  decimals: number
  settlementTable: PublicKey
}

interface SettlementTableAccount {
  reserve: PublicKey
  periods: { deposited: BN; borrowed: BN; freeInterest: BN }[]
}

export class Portfolio {
  constructor(
    private program: Omit<Program<AdventType>, "rpc">,
    public authority: PublicKey,
    public market: PublicKey,
    public positionsKey: PublicKey,
    public variableDeposits: VariableDeposit[]
  ) {}
}

export class Reserve {
  constructor(
    private program: Omit<Program<AdventType>, "rpc">,
    public market: PublicKey,
    public token: PublicKey,
    public settlementTableKey: PublicKey,
    public settlementTable: SettlementTable
  ) {}
}

export interface SettlementTable {
  periods: SettlementPeriod[]
}

export interface SettlementPeriod {
  deposited: BN
  borrowed: BN
  freeInterest: BN
}
export interface VariableDeposit {
  amount: BN
  token: PublicKey
}

export interface Positions {
  fixedBorrows: any[]
  fixedDeposits: any[]
  variableBorrows: any[]
  variableDeposits: any[]
}
