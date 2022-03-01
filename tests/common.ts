import { Keypair, Connection } from "@solana/web3.js"
import { AdventSDK } from "../sdk/src"
import { signAllAndSend } from "../sdk/src/util"

export async function initialize(admin: Keypair, con: Connection) {
  const sig = await con.requestAirdrop(admin.publicKey, 100e10)
  await con.confirmTransaction(sig)
  const sdk = new AdventSDK(con)
  return sdk
}

export async function initMarket(
  admin: Keypair,
  connection: Connection,
  sdk: AdventSDK
) {
  const rewardTokenMint = Keypair.generate()
  const ix = await sdk.initMarketIX(admin.publicKey, rewardTokenMint.publicKey)

  await signAllAndSend(
    [ix],
    [admin, rewardTokenMint],
    admin.publicKey,
    connection
  )

  const [marketAddress, bump] = await sdk.marketPDA(rewardTokenMint.publicKey)
  const market = await sdk.market(marketAddress)

  return market
}
