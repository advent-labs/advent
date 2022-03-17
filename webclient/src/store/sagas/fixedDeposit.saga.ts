import { call, getContext, put, select } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions as reservesActions } from "../reducer/reserves"
import { actions as fixedDepositActions } from "store/reducer/fixedDeposit"

import { selectors as portfolioSelectors } from "../reducer/userPortfolio"
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
import { toast } from "react-toastify"

async function doFixedDeposit(
  sdk: AdventMarket,
  connection: Connection,
  wallet: Wallet,
  amount: number,
  duration: number,
  token: PublicKey,
  positionsAddress?: PublicKey
) {
  const ixs: TransactionInstruction[] = []
  const additionalSigners: Keypair[] = []
  // If no positions, then need to initialize portfolio
  if (!positionsAddress) {
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
  toast("Deposit succeeded")
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

  const isPortfolioInitalized = portfolioSelectors.isPortfolioInitialized(
    state.userPortfolio
  )
  const positionsAddress = isPortfolioInitalized
    ? new PublicKey(state.userPortfolio.state.positionsAddress)
    : undefined
  // Do the work
  try {
    yield call(
      doFixedDeposit,
      adventMarketSDK,
      connection,
      wallet as Wallet,
      amount,
      duration,
      new PublicKey(token),
      positionsAddress
    )
  } catch (e: any) {
    console.log(e.toString())
  }

  yield put(fixedDepositActions.succeeded())
  yield put(userTokenBalanceActions.userTokenBalancesStateRequested())
  yield put(reservesActions.loadRequested())
}
