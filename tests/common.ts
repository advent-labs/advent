import { Keypair, Connection } from "@solana/web3.js"
import { AdventMarket, AdventSDK } from "../sdk/src"
import { signAllAndSend } from "../sdk/src/util"
import * as spl from "@solana/spl-token"

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

export async function initReserve(
  admin: Keypair,
  connection,
  market: AdventMarket
) {
  const table = Keypair.generate()
  const depositNoteMint = Keypair.generate()
  const token = await spl.Token.createMint(
    connection,
    admin,
    admin.publicKey,
    admin.publicKey,
    6,
    spl.TOKEN_PROGRAM_ID
  )
  const ixs = await market.initReserveIX(
    admin.publicKey,
    table.publicKey,
    depositNoteMint.publicKey,
    token.publicKey
  )
  await signAllAndSend(
    ixs,
    [admin, table, depositNoteMint],
    admin.publicKey,
    connection
  )

  const reserve = await market.reserve(token.publicKey)
  return reserve
}

export async function initPortfolio(
  admin: Keypair,
  connection: Connection,
  market: AdventMarket
) {
  const positions = Keypair.generate()

  const ixs = await market.initPortfolioIX(admin.publicKey, positions.publicKey)

  await signAllAndSend(ixs, [admin, positions], admin.publicKey, connection)

  return market.portfolio(admin.publicKey)
}
