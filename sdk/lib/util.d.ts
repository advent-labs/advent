import { Connection, TransactionInstruction, Keypair, PublicKey } from "@solana/web3.js";
export declare function signAllAndSend(ixs: TransactionInstruction[], signers: Keypair[], payer: PublicKey, connection: Connection): Promise<string>;
export declare function createTokenAccountIX(connection: Connection, newAccountPubkey: PublicKey, mint: PublicKey, owner: PublicKey, payer: PublicKey): Promise<TransactionInstruction[]>;
