import { parseError } from "@advent/sdk"
import { Wallet } from "@project-serum/anchor"
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createATAInstruction,
  getATAAddress,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils"
import { Token } from "@solana/spl-token"
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmRawTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"

export async function signAllAndSend(
  ixs: TransactionInstruction[],
  wallet: Wallet,
  connection: Connection,
  additionalSigners: Keypair[] = []
) {
  //perform transaction logic
  const tx = new Transaction()
  const owner = wallet.publicKey
  ixs.forEach((i) => tx.add(i))
  tx.feePayer = owner
  const blockhash = await connection.getRecentBlockhash()
  tx.recentBlockhash = blockhash.blockhash

  additionalSigners.forEach((s) => {
    tx.partialSign(s)
  })

  try {
    await wallet.signTransaction(tx)
  } catch (e: any) {
    console.log(e.toString())
  }

  const rawTx = tx.serialize()

  try {
    const sig = await sendAndConfirmRawTransaction(connection, rawTx)
    console.log(sig)
    return sig
  } catch (e: any) {
    const parsedError = parseError(e)

    const errorData = parsedError
      ? {
          title: e.name,
          message: parsedError.toString(),
          type: "error",
        }
      : {
          title: e.name,
          message: e.message,
          type: "error",
        }

    console.log(errorData)
    throw new Error(errorData.message)
  }
}

export const getOrCreateATA = async ({
  connection,
  mint,
  owner,
}: {
  connection: Connection
  mint: PublicKey
  owner: PublicKey
}) => {
  const address = await getATAAddress({ mint, owner })
  if (await connection.getAccountInfo(address)) {
    return { address, instruction: null }
  } else {
    return {
      address,
      instruction: createATAInstruction({
        mint,
        address,
        owner,
        payer: owner,
      }),
    }
  }
}
