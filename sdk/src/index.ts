import { BN, Program, Provider, utils, Wallet } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js"
import { IDL } from "./program"
import { ReadonlyProgram } from "./models"
import { AdventPortfolio } from "./portfolio"
import {
  IReserve,
  Reserve,
  ISettlementPeriod,
  ISettlementTable,
} from "./reserve"
import { AdventMarket } from "./market"

export {
  AdventPortfolio,
  AdventMarket,
  Reserve,
  IReserve,
  ISettlementPeriod,
  ISettlementTable,
}

const DEFAULT_PROGRAM_ID = "ke798ave2o7MMZkriRUPSCz1aLrrmPQY2zHdrikJ298"

export class AdventSDK {
  public program: ReadonlyProgram

  constructor(public connection: Connection, program = DEFAULT_PROGRAM_ID) {
    // const wallet = new Wallet(Keypair.generate())
    const provider = new Provider(
      this.connection,
      { publicKey: Keypair.generate().publicKey } as Wallet,
      Provider.defaultOptions()
    )
    this.program = new Program(IDL, new PublicKey(program), provider)
  }

  async market(marketAddress: PublicKey) {
    const m = (await this.program.account.market.fetch(marketAddress)) as any

    const market = new AdventMarket(
      this.program,
      marketAddress,
      m.rewardTokenMint,
      m.authority,
      m.bump[0]
    )

    await market.refresh()
    return market
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

export interface Positions {
  fixedBorrows: any[]
  fixedDeposits: any[]
  variableBorrows: any[]
  variableDeposits: any[]
}
