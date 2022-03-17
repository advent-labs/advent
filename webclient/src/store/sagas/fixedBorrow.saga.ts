import { call, getContext, put, select } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import {
  selectors as portfolioSelectors,
  actions as portfolioActions,
} from "../reducer/userPortfolio"
import { actions as userTokenBalanceActions } from "store/reducer/userTokenBalances"
import { actions as reservesActions } from "../reducer/reserves"
import { actions as fixedBorrowActions } from "store/reducer/fixedBorrow"
import { PayloadAction } from "@reduxjs/toolkit"
import { AdventMarket } from "@advent/sdk"
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js"
import { Wallet } from "@project-serum/anchor"
import { getOrCreateATA, signAllAndSend } from "./common"
import { RootState } from "store"
import { toast } from "react-toastify"

async function doFixedBorrow(
  sdk: AdventMarket,
  connection: Connection,
  wallet: Wallet,
  amount: number,
  duration: number,
  token: PublicKey,
  positions?: PublicKey
) {
  const ixs: TransactionInstruction[] = []
  const additionalSigners: Keypair[] = []
  // get ATA for deposit notes
  {
    const { instruction } = await getOrCreateATA({
      connection,
      mint: token,
      owner: wallet.publicKey,
    })
    if (instruction) {
      console.log("Init deposit note ATA")
      ixs.push(instruction)
    }
  }
  // If no positions, then need to initialize portfolio
  if (!positions) {
    console.log("Init positions")
    const newPositions = Keypair.generate()
    const initPortfolioIXs = await sdk.initPortfolioIX(
      wallet.publicKey,
      newPositions.publicKey
    )
    initPortfolioIXs.forEach((ix) => ixs.push(ix))
    additionalSigners.push(newPositions)
    positions = newPositions.publicKey
  }

  const ix = await sdk.fixedBorrowIX(
    token,
    amount,
    duration,
    wallet.publicKey,
    positions
  )
  ixs.push(ix)
  const sig = await signAllAndSend(ixs, wallet, connection, additionalSigners)
  toast("Borrow succeeded")
  return sig
}

export function* fixedBorrow(
  a: PayloadAction<{ token: string; amount: number; duration: number }>
) {
  const { token, amount, duration } = a.payload
  const { wallet, adventMarketSDK, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !adventMarketSDK || !connection) {
    console.log("Missing context")
    return
  }

  const state = (yield select()) as RootState
  const isPortfolioInitalized = portfolioSelectors.isPortfolioInitialized(
    state.userPortfolio
  )
  const positionsAddress = isPortfolioInitalized
    ? new PublicKey(state.userPortfolio.state.positionsAddress)
    : undefined

  try {
    yield call(
      doFixedBorrow,
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

  yield put(fixedBorrowActions.succeeded())
  yield put(userTokenBalanceActions.userTokenBalancesStateRequested())
  yield put(reservesActions.loadRequested())
}
