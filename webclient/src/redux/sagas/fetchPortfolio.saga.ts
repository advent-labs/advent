import { getContext, put } from "redux-saga/effects"
import { Portfolio } from "../../sdk/models"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions as userPortfolioActions } from "../reducer/userPortfolio"

export function* fetchUserPortfolio() {
  const { sdk } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!sdk) return

  // do the work
  const portfolio: Portfolio = yield sdk.fetchUserPortfolio()

  yield put(userPortfolioActions.loaded(portfolio))
}
