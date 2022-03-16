import { call, getContext, put, select } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../ui/depositui"
import { actions as reservesActions } from "../reducer/reserves"
import { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "store"
import { actions as userTokenBalanceActions } from "store/reducer/userTokenBalances"
import { AdventMarket } from "@advent/sdk"
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"
import { Wallet } from "@project-serum/anchor"
import { signAllAndSend } from "./common"

async function doFixedDeposit(
  sdk: AdventMarket,
  connection: Connection,
  wallet: Wallet,
  amount: number,
  duration: number,
  token: PublicKey,
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

  {
    const ix = await sdk.fixedDepositIX(
      token,
      amount,
      duration,
      wallet.publicKey,
      positionsAddress
    )
    ixs.push(ix)
  }

  const sig = await signAllAndSend(ixs, wallet, connection, additionalSigners)
  return sig
}

export function* fixedDeposit(
  a: PayloadAction<{ token: string; amount: number; duration: number }>
) {
  const { token, amount, duration } = a.payload
  const { wallet, adventMarketSDK, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !adventMarketSDK || !connection) {
    console.log("Context missing")
    return
  }
  const state = (yield select()) as RootState

  // Do the work
  yield call(
    doFixedDeposit,
    adventMarketSDK,
    connection,
    wallet as Wallet,
    amount,
    duration,
    new PublicKey(token)
  )

  yield put(actions.depositSucceed())
  yield put(userTokenBalanceActions.userTokenBalancesStateRequested())
  yield put(reservesActions.loadRequested())
}
