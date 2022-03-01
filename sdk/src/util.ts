import {
  Connection,
  sendAndConfirmRawTransaction,
  Transaction,
  TransactionInstruction,
  Keypair,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js"
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { parseIdlErrors, ProgramError } from "@project-serum/anchor"
import { IDL } from "./program"

const errors = parseIdlErrors(IDL)

export async function signAllAndSend(
  ixs: TransactionInstruction[],
  signers: Keypair[],
  payer: PublicKey,
  connection: Connection
) {
  const tx = new Transaction()
  ixs.forEach((i) => tx.add(i))
  tx.setSigners(...signers.map((s) => s.publicKey))
  const blockhash = await connection.getRecentBlockhash()
  tx.recentBlockhash = blockhash.blockhash
  tx.feePayer = payer
  tx.partialSign(...signers)

  const rawTx = tx.serialize()
  try {
    const sig = await sendAndConfirmRawTransaction(connection, rawTx)
    return sig
  } catch (err) {
    let parsedError = ProgramError.parse(err, errors)
    if (!parsedError) {
      throw err
    }
    throw parsedError
  }
}

export async function createTokenAccountIX(
  connection: Connection,
  newAccountPubkey: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey
) {
  const lamports = await connection.getMinimumBalanceForRentExemption(165)
  return [
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      mint,
      newAccountPubkey,
      owner
    ),
  ]
}
