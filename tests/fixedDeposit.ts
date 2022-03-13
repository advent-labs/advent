import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import {
  addCollateralFromScratch,
  assertTokenBalance,
  initialize,
  initMarket,
  initPortfolio,
  initReserve,
} from "./common"
import { AdventMarket, AdventPortfolio, Reserve } from "../sdk/src"
import { Token } from "@solana/spl-token"
import * as sab from "@saberhq/token-utils"
describe("fixed borrow", () => {
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
  let reserveA: Reserve
  let reserveB: Reserve
  it("inits & adds collateral", async () => {
    const sdk = await initialize(admin, connection)
    market = await initMarket(admin, connection, sdk)
    portfolio = await initPortfolio(admin, connection, market)

    const { reserve: _reserveA, token: _tokenA } = await initReserve(
      admin,
      connection,
      market
    )
    tokenA = _tokenA
    reserveA = _reserveA

    const { reserve: _reserveB, token: _tokenB } = await initReserve(
      admin,
      connection,
      market
    )
    tokenB = _tokenB
    reserveB = _reserveB

    await market.refresh()

    await addCollateralFromScratch(
      admin,
      connection,
      tokenA,
      market,
      portfolio,
      reserveA
    )
    await addCollateralFromScratch(
      admin,
      connection,
      tokenB,
      market,
      portfolio,
      reserveB
    )
  })

  it("creates a fixed borrow", async () => {
    {
      const userReserve = await sab.getATAAddress({
        owner: admin.publicKey,
        mint: tokenA.publicKey,
      })

      const ix = await portfolio.fixedBorrowIX(tokenA.publicKey, 1e6, 10)
      await signAllAndSend([ix], [admin], admin.publicKey, connection)

      await assertTokenBalance(userReserve, 1, connection)
    }
    await portfolio.refresh()
    assert.equal(portfolio.fixedBorrows.length, 1)
    {
      const userReserve = await sab.getATAAddress({
        owner: admin.publicKey,
        mint: tokenB.publicKey,
      })

      const ix = await portfolio.fixedBorrowIX(tokenB.publicKey, 2e6, 10)
      await signAllAndSend([ix], [admin], admin.publicKey, connection)

      await assertTokenBalance(userReserve, 2, connection)
    }
    await portfolio.refresh()
    assert.equal(portfolio.fixedBorrows.length, 2)

    {
      const userReserve = await sab.getATAAddress({
        owner: admin.publicKey,
        mint: tokenB.publicKey,
      })

      const ix = await portfolio.fixedBorrowIX(tokenB.publicKey, 1e6, 10)
      await signAllAndSend([ix], [admin], admin.publicKey, connection)

      await assertTokenBalance(userReserve, 3, connection)
    }
    await portfolio.refresh()
    assert.equal(portfolio.fixedBorrows.length, 3)
  })
})
