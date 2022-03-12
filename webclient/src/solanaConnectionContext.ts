import { Connection } from "@solana/web3.js"
import { addresses, Addresses } from "./addresses"
import { Wallet } from "@project-serum/anchor/src/provider"
import { IRealworldService } from "./realworld.service"
import { AdventMarket as OldAdventMarket } from "./sdk"
import { AdventMarket, AdventPortfolio } from "@advent/sdk"
export interface SolanaConnectionContext {
  wallet: Wallet | null
  connection: Connection | null
  addresses: Addresses
  sdk?: OldAdventMarket
  adventMarketSDK?: AdventMarket
  adventPortfolioSDK?: AdventPortfolio
  realWorld: IRealworldService | null
}

export const solanaConnectionContext: SolanaConnectionContext = {
  addresses: addresses.dev,
  connection: null,
  wallet: null,
  realWorld: null,
}
