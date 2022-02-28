import { getContext, put } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../ui/borrowui"
import { actions as userPortfolioActions } from "../reducer/userPortfolio"
import { actions as reservesActions } from "../reducer/reserves"

export function* fixedBorrow(a: ReturnType<typeof actions.doRequestBorrow>) {
  const { sdk } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!sdk) return

  yield sdk.fixedBorrow(a.payload.token, a.payload.amount, a.payload.duration)
  yield put(actions.borrowSucceed())
  yield put(userPortfolioActions.loadRequested())
  yield put(reservesActions.loadRequested())
}
