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

    const reserve = await market.fetchReserve(
      (
        await market.reservePDA(token.publicKey)
      )[0]
    )
    assert.equal(reserve.token.toBase58(), token.publicKey.toBase58())
    assert.equal(reserve.market.toBase58(), market.address.toBase58())

    const reserves = await market.fetchAllReserves()

    assert.equal(reserves.length, 1)
    assert.equal(
      reserves[0].account.token.toBase58(),
      token.publicKey.toBase58()
    )

    {
      const r = await market.reserve(token.publicKey)
      assert.equal(r.market.toBase58(), market.address.toBase58())
      assert.equal(r.settlementTable.periods.length, 365)
      assert.equal(r.settlementTable.periods[0].borrowed.toString(), 0)
    }

    {
      const rs = await market.allReserves()
      assert.equal(rs.length, 1)
      assert.equal(rs[0].token.toBase58(), token.publicKey.toBase58())
      assert.equal(rs[0].settlementTable.periods.length, 365)
    }
  })
})
