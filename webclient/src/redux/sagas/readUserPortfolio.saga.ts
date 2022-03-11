import { getContext, put } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { serializePortfolio } from "./fetchPortfolio.saga"

import { actions as userPortfolioActions } from "../reducer/userPortfolio"

export function* readUserPortfolio() {
  const { adventMarketSDK, wallet, adventPortfolioSDK } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!wallet) return
  if (!adventMarketSDK) return
  if (!adventPortfolioSDK) return

  const p = serializePortfolio(adventPortfolioSDK.serialize())

  yield put(userPortfolioActions.loaded(p))
}
