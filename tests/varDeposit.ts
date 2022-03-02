import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import { initialize, initMarket, initPortfolio, initReserve } from "./common"
import { AdventMarket, AdventPortfolio } from "../sdk/src"

describe("varable deposit", () => {
  const admin = Keypair.generate()
  const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
  })
  const wallet = new anchor.Wallet(admin)
  const provider = new anchor.Provider(connection, wallet, {
    commitment: "confirmed",
  })
  anchor.setProvider(provider)
  let market: AdventMarket
  let portfolio: AdventPortfolio

  it("inits variable deposit", async () => {
    const sdk = await initialize(admin, connection)
    market = await initMarket(admin, connection, sdk)
    portfolio = await initPortfolio(admin, connection, market)
    const reserve = await initReserve(admin, connection, market)

    const collateralVaultAccount = Keypair.generate()

    const ix = await market.initVariableDepositIX(
      admin.publicKey,
      reserve.token,
      portfolio.positionsKey,
      collateralVaultAccount.publicKey,
      reserve.depositNoteMint
    )

    await signAllAndSend(
      [ix],
      [admin, collateralVaultAccount],
      admin.publicKey,
      connection
    )

    await portfolio.refresh()

    assert.equal(
      portfolio.variableDeposits[0].token.toBase58(),
      reserve.token.toBase58()
    )
  })

  it("can handle multiple reserves", async () => {
    const reserve = await initReserve(admin, connection, market)

    const collateralVaultAccount = Keypair.generate()

    const ix = await market.initVariableDepositIX(
      admin.publicKey,
      reserve.token,
      portfolio.positionsKey,
      collateralVaultAccount.publicKey,
      reserve.depositNoteMint
    )

    await signAllAndSend(
      [ix],
      [admin, collateralVaultAccount],
      admin.publicKey,
      connection
    )

    await portfolio.refresh()

    assert.equal(
      portfolio.variableDeposits[1].token.toBase58(),
      reserve.token.toBase58()
    )

    assert.equal(portfolio.variableDeposits.length, 2)
  })
})
