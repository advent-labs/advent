import { Keypair, Connection } from "@solana/web3.js"
import { AdventSDK } from "../sdk/src"

export async function initialize(admin: Keypair, con: Connection) {
  const sig = await con.requestAirdrop(admin.publicKey, 100e10)
  await con.confirmTransaction(sig)
  const sdk = new AdventSDK(con)
  return sdk
}
