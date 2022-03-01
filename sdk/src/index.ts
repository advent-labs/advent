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

export class AdventSDK {
  public program: Omit<Program<AdventType>, "rpc">

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
    private program: Omit<Program<AdventType>, "rpc">,
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
    const space = this.program.account.settlementTable.size
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

  async initReserveIX(
    authority: PublicKey,
    settlementTable: PublicKey,
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
            settlementTable,
            systemProgram: SystemProgram.programId,
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

export class Portfolio {
  constructor(
    private program: Omit<Program<AdventType>, "rpc">,
    public authority: PublicKey,
    public market: PublicKey,
    public positionsKey: PublicKey,
    public variableDeposits: VariableDeposit[]
  ) {}
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
