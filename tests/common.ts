import { Keypair, Connection, PublicKey } from "@solana/web3.js"
import { AdventMarket, AdventPortfolio, AdventSDK, Reserve } from "../sdk/src"
import { signAllAndSend } from "../sdk/src/util"
import * as spl from "@solana/spl-token"
import * as sab from "@saberhq/token-utils"
import * as assert from "assert"

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
  connection: Connection,
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
  return { reserve, token }
}

export async function addCollateralFromScratch(
  admin: Keypair,
  connection: Connection,
  token: spl.Token,
  market: AdventMarket,
  portfolio: AdventPortfolio,
  reserve: Reserve,
  amount = 10e6
) {
  {
    const ix = await market.initVariableDepositIX(
      admin.publicKey,
      reserve.token,
      portfolio.positionsKey,
      reserve.depositNoteMint
    )

    await signAllAndSend([ix], [admin], admin.publicKey, connection)
  }
  await portfolio.refresh()
  const depositNoteMint = reserve.depositNoteMint
  const userToken = await createATA(token.publicKey, admin, connection)
  await createATA(depositNoteMint, admin, connection)
  await token.mintTo(userToken, admin, [], amount)

  {
    const ix = await portfolio.variableDepositTokensIX(token.publicKey, 10e6)
    await signAllAndSend([ix], [admin], admin.publicKey, connection)
  }

  {
    const ix = await portfolio.variableDepositCollateralIX(
      token.publicKey,
      amount
    )
    await signAllAndSend([ix], [admin], admin.publicKey, connection)
  }
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

export async function createATA(
  mint: PublicKey,
  admin: Keypair,
  connection: Connection
) {
  const address = await sab.getATAAddress({ mint, owner: admin.publicKey })
  const ix = sab.createATAInstruction({
    address,
    mint,
    owner: admin.publicKey,
    payer: admin.publicKey,
  })
  await signAllAndSend([ix], [admin], admin.publicKey, connection)
  return address
}

export async function assertTokenBalance(
  address: PublicKey,
  amount: number,
  connection: Connection
) {
  const bal = await connection.getTokenAccountBalance(address)
  assert.equal(bal.value.uiAmount, amount)
}
