import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import { initialize } from "./common"

describe("init reserve", () => {
  const admin = Keypair.generate()
  const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
  })
  const wallet = new anchor.Wallet(admin)
  const provider = new anchor.Provider(connection, wallet, {
    commitment: "confirmed",
  })
  anchor.setProvider(provider)

  it("inits market", async () => {
    const sdk = await initialize(admin, connection)
    const rewardTokenMint = Keypair.generate()
    const ix = await sdk.initMarketIX(
      admin.publicKey,
      rewardTokenMint.publicKey
    )

    await signAllAndSend(
      [ix],
      [admin, rewardTokenMint],
      admin.publicKey,
      connection
    )

    const [marketAddress, _] = await sdk.marketPDA(rewardTokenMint.publicKey)

    const market = await sdk.market(marketAddress)

    assert.equal(market.authority.toBase58(), admin.publicKey.toBase58())
    assert.equal(
      market.rewardTokenMint.toBase58(),
      rewardTokenMint.publicKey.toBase58()
    )
  })
})
