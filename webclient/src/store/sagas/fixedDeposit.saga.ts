import { getContext, put, select } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../ui/depositui"
import { actions as userPortfolioActions } from "../reducer/userPortfolio"
import { actions as reservesActions, Reserve } from "../reducer/reserves"
import { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "store"
import { AdventMarket } from "@advent/sdk"
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"
import { Wallet } from "@project-serum/anchor"

async function doFixedDeposit(
  sdk: AdventMarket,
  connection: Connection,
  wallet: Wallet,
  amount: number,
  reserve: Reserve,
  positionsAddress = PublicKey.default
) {
  const ixs: TransactionInstruction[] = []
  const additionalSigners: Keypair[] = []

  // If no positions, then need to initialize portfolio
  if (positionsAddress.equals(PublicKey.default)) {
    console.log("Init positions")
    const newPositions = Keypair.generate()
    const initPortfolioIXs = await sdk.initPortfolioIX(
      wallet.publicKey,
      newPositions.publicKey
    )
    initPortfolioIXs.forEach((ix) => ixs.push(ix))
    additionalSigners.push(newPositions)
    positionsAddress = newPositions.publicKey
  }
}

export function* fixedDeposit(
  a: PayloadAction<{ token: string; amount: number; duration: number }>
) {
  const { wallet, adventMarketSDK, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !adventMarketSDK || !connection) {
    console.log("Context missing")
    return
  }
  const state = (yield select()) as RootState

  // Do the work

  yield put(actions.depositSucceed())
  yield put(reservesActions.loadRequested())
}
