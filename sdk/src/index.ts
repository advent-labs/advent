import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  Connection,
  Keypair,
  PublicKey,
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
      m.authority
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
    public authority: PublicKey
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
    const p = await this.program.account.portfolio.fetch(a)
  }

  ///////// PDAS
  portfolioPDA(authority: PublicKey) {
    return PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("portfolio"), authority.toBuffer()],
      this.program.programId
    )
  }
}

export class Portfolio {
  constructor(
    private program: Omit<Program<AdventType>, "rpc">,
    public authority: PublicKey,
    public market: PublicKey,
    public variableDeposits: VariableDeposit[]
  ) {}
}

export interface VariableDeposit {
  amount: BN
  token: PublicKey
}
