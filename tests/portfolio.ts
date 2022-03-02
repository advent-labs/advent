import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import { initialize, initMarket } from "./common"

describe("portfolio", () => {
  const admin = Keypair.generate()
  const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
  })
  const wallet = new anchor.Wallet(admin)
  const provider = new anchor.Provider(connection, wallet, {
    commitment: "confirmed",
  })
  anchor.setProvider(provider)

  it("inits portfolio", async () => {
    const sdk = await initialize(admin, connection)
    const market = await initMarket(admin, connection, sdk)
    const positions = Keypair.generate()

    const ixs = await market.initPortfolioIX(
      admin.publicKey,
      positions.publicKey
    )

    await signAllAndSend(ixs, [admin, positions], admin.publicKey, connection)
    const portfolio = await market.portfolio(admin.publicKey)
    assert.equal(portfolio.authority.toBase58(), admin.publicKey.toBase58())
  })
})
