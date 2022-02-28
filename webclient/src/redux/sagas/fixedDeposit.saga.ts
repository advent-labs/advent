import { getContext, put } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../ui/depositui"
import { actions as userPortfolioActions } from "../reducer/userPortfolio"
import { actions as reservesActions } from "../reducer/reserves"

export function* fixedDeposit(a: ReturnType<typeof actions.depositRequested>) {
  const { sdk } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!sdk) return

  yield sdk.fixedDeposit(a.payload.token, a.payload.amount, a.payload.duration)
  yield put(actions.depositSucceed())
  yield put(userPortfolioActions.loadRequested())
  yield put(reservesActions.loadRequested())
}
