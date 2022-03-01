import * as anchor from "@project-serum/anchor"
import * as assert from "assert"

import { Connection, Keypair } from "@solana/web3.js"
import { signAllAndSend } from "../sdk/src/util"
import { initialize, initMarket } from "./common"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import * as spl from "@solana/spl-token"
describe.only("reserves", () => {
  const admin = Keypair.generate()
  const connection = new Connection("http://localhost:8899", {
    commitment: "confirmed",
  })
  const wallet = new anchor.Wallet(admin)
  const provider = new anchor.Provider(connection, wallet, {
    commitment: "confirmed",
  })
  anchor.setProvider(provider)

  it("inits reserve", async () => {
    const sdk = await initialize(admin, connection)
    const market = await initMarket(admin, connection, sdk)
    const table = Keypair.generate()
    const token = await spl.Token.createMint(
      connection,
      admin,
      admin.publicKey,
      admin.publicKey,
      6,
      TOKEN_PROGRAM_ID
    )
    const ixs = await market.initReserveIX(
      admin.publicKey,
      table.publicKey,
      token.publicKey
    )
    await signAllAndSend(ixs, [admin, table], admin.publicKey, connection)
  })
})
