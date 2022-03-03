import { PublicKey } from "@solana/web3.js"
import { ReadonlyProgram, SettlementTable } from "./models"

export class Reserve {
  constructor(
    private program: ReadonlyProgram,
    public market: PublicKey,
    public token: PublicKey,
    public depositNoteMint: PublicKey,
    public vault: PublicKey,
    public settlementTableKey: PublicKey,
    public settlementTable: SettlementTable
  ) {}
}
