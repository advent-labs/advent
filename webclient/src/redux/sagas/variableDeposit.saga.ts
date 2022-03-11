import { AdventMarket, AdventPortfolio } from "@advent/sdk"
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js"
import { getContext } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"

async function doVariableDeposit(
  sdk: AdventMarket,
  user: PublicKey,
  portfolioInitialized: boolean
) {
  const ixs: TransactionInstruction[] = []
  if (!portfolioInitialized) {
    const positions = Keypair.generate()
    const initPortfolioIXs = await sdk.initPortfolioIX(
      user,
      positions.publicKey
    )
    initPortfolioIXs.forEach((ix) => ixs.push(ix))
  }
}

export function* variableDeposit() {
  const { adventMarketSDK, wallet, adventPortfolioSDK } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext
}
