import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import {
  assertTokenBalance,
  createATA,
  initialize,
  initMarket,
  initPortfolio,
  initReserve,
} from "./common"
import { AdventMarket, AdventPortfolio } from "../sdk/src"
import { Token } from "@solana/spl-token"
import * as sab from "@saberhq/token-utils"

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
  let tokenA: Token
  let tokenB: Token

  it("inits variable deposit", async () => {
    const sdk = await initialize(admin, connection)
    market = await initMarket(admin, connection, sdk)
    portfolio = await initPortfolio(admin, connection, market)
    const { reserve, token: _token } = await initReserve(
      admin,
      connection,
      market
    )
    tokenA = _token

    const ix = await market.initVariableDepositIX(
      admin.publicKey,
      reserve.token,
      portfolio.positionsKey,
      reserve.depositNoteMint
    )

    await signAllAndSend([ix], [admin], admin.publicKey, connection)

    await portfolio.refresh()

    assert.equal(
      portfolio.variableDeposits[0].token.toBase58(),
      reserve.token.toBase58()
    )
  })

  it("can handle multiple reserves", async () => {
    const { reserve, token } = await initReserve(admin, connection, market)
    tokenB = token
    const ix = await market.initVariableDepositIX(
      admin.publicKey,
      reserve.token,
      portfolio.positionsKey,
      reserve.depositNoteMint
    )

    await signAllAndSend([ix], [admin], admin.publicKey, connection)

    await portfolio.refresh()

    assert.equal(
      portfolio.variableDeposits[1].token.toBase58(),
      reserve.token.toBase58()
    )

    assert.equal(portfolio.variableDeposits.length, 2)
  })

  it("deposits", async () => {
    await market.refresh()
    const reserve = market.reserveByToken(tokenA.publicKey)
    const depositNoteMint = reserve.depositNoteMint
    const notesAddress = await createATA(depositNoteMint, admin, connection)
    const reserveAddress = await createATA(tokenA.publicKey, admin, connection)
    await tokenA.mintTo(reserveAddress, admin, [], 10e6)

    const ix = await portfolio.variableDepositIX(tokenA.publicKey, 1e6)

    await signAllAndSend([ix], [admin], admin.publicKey, connection)

    await assertTokenBalance(reserveAddress, 9, connection)
    await assertTokenBalance(notesAddress, 0, connection)
    const collateralVault = await portfolio.collateralVaultByToken(
      tokenA.publicKey
    )
    await assertTokenBalance(collateralVault, 1, connection)
  })

  it("widthdraws", async () => {
    const ix = await portfolio.withdrawVariableDepositIX(tokenA.publicKey, 1e6)
    await signAllAndSend([ix], [admin], admin.publicKey, connection)

    const reserveAddress = await sab.getATAAddress({
      mint: tokenA.publicKey,
      owner: admin.publicKey,
    })
    await assertTokenBalance(reserveAddress, 10, connection)
    const collateralVault = await portfolio.collateralVaultByToken(
      tokenA.publicKey
    )
    await assertTokenBalance(collateralVault, 0, connection)
  })
})
