import { Connection, Transaction } from "@solana/web3.js"
import { AdventMarket, AdventSDK } from "../sdk/src/index"
import { Provider, web3, BN } from "@project-serum/anchor"
import * as fs from "fs"
import { Keypair } from "@solana/web3.js"
import { PublicKey } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"

const USDT_DEV = "39pF3Ror7MY8NZRM724LSskCLVFBb8ytqeNRk2cuY4YN"
const USDC_DEV = "FAW3w68Vx9Ps2R5nU8mG6q8gGwj75a3h6YZchgqhJ852"
const FRAX_DEV = "5mLBvi1mPB5ZNyVWCFynMZepHeyDncL3qdedKLggh1h"
const UST_DEV = "A7hFeZJwQuSrwgQPscN2mVG7ZUu951VRGGBcAGZdQD1N"
const XUSD_DEV = "DtT5V69SgJRcvfZmpYmd9LRJVhMLmvMresUABCpEmfRf"

const endpoint = "https://api.devnet.solana.com"
const connection = new Connection(endpoint, "confirmed")
const provider = Provider.local(endpoint)
const wallet = provider.wallet as any

async function createReserve(market: AdventMarket, token: PublicKey) {
  const table = Keypair.generate()
  const depositNoteMint = Keypair.generate()
  const ixs = await market.initReserveIX(
    wallet.publicKey,
    table.publicKey,
    depositNoteMint.publicKey,
    token
  )
  const sig = await signAllAndSend(
    ixs,
    [wallet.payer, table, depositNoteMint],
    wallet.publicKey,
    connection
  )
  console.log(`Created reserve: ${sig}`)
}

export async function main() {
  const sdk = new AdventSDK(connection)
  const rewardTokenMint = Keypair.generate()
  {
    const ix = await sdk.initMarketIX(
      wallet.publicKey,
      rewardTokenMint.publicKey
    )

    const sig = await signAllAndSend(
      [ix],
      [wallet.payer, rewardTokenMint],
      wallet.publicKey,
      connection
    )

    console.log(`Created market: ${sig}`)
  }

  const [marketAddress] = await sdk.marketPDA(rewardTokenMint.publicKey)
  const market = await sdk.market(marketAddress)

  const tokens = [USDC_DEV, USDT_DEV, FRAX_DEV, UST_DEV]

  await Promise.all(tokens.map((t) => createReserve(market, new PublicKey(t))))

  const addresses = {
    market: marketAddress,
  }
  fs.writeFileSync("../adventAddresses.json", JSON.stringify(addresses))
  console.log("Done")
}

main()
