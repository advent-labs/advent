import { getContext, put } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../ui/borrowui"
import { actions as userPortfolioActions } from "../reducer/userPortfolio"
import { actions as reservesActions } from "../reducer/reserves"
import { PayloadAction } from "@reduxjs/toolkit"

export function* fixedBorrow(
  a: PayloadAction<{ token: string; amount: number; duration: number }>
) {
  const { wallet, adventMarketSDK, connection } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet || !adventMarketSDK || !connection) {
    console.log("Missing context")
    return
  }

  yield put(reservesActions.loadRequested())
}
