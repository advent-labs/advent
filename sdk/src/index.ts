import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { Prog as AdventType, IDL } from "./program"

export class AdventSDK {
  public program: Omit<Program<AdventType>, "rpc">

  constructor(public connection: Connection, program: string) {
    const wallet = new Wallet(Keypair.generate())
    const provider = new Provider(
      this.connection,
      wallet,
      Provider.defaultOptions()
    )
    this.program = new Program(IDL, new PublicKey(program), provider)
  }

  async market(market: string) {
    const address = new PublicKey(market)
    const m = await this.program.account.main.fetch(address)
    return new AdventMarket(
      this.program,
      address,
      m.rewardTokenMint,
      m.authority
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
    const m = this.program.account.main.fetch(this.address)
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
