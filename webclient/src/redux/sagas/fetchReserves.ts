import { getContext, put } from "redux-saga/effects"
import { Reserve } from "../../sdk/models"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions } from "../reducer/reserves"

export function* fetchReserves() {
  const { sdk } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!sdk) return
  const reserves: Reserve[] = yield sdk.fetchReserves()

  yield put(actions.loaded(reserves))
}
