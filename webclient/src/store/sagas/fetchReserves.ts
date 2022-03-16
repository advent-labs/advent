import { IReserve } from "@advent/sdk"
import { getContext, put } from "redux-saga/effects"
import { SolanaConnectionContext } from "../../solanaConnectionContext"
import { actions, Reserve } from "../reducer/reserves"
import { actions as portfolioActions } from "../reducer/userPortfolio"
function sdkReserveToState(r: IReserve): Reserve {
  return {
    ...r,
    market: r.market.toBase58(),
    token: r.token.toBase58(),
    vault: r.vault.toBase58(),
    depositNoteMint: r.depositNoteMint.toBase58(),
    settlementTable: r.settlementTable,
  }
}

export function* fetchReserves() {
  const { adventMarketSDK } = (yield getContext(
    "solanaConnectionContext"
  )) as SolanaConnectionContext

  if (!adventMarketSDK) return
  try {
    yield adventMarketSDK.refresh()
  } catch (e: any) {
    // TODO
    console.log(e.toString())
  }
  const reserves = adventMarketSDK.reserves
    .map((r) => r.serialize())
    .map(sdkReserveToState)

  // load in the reserve info
  yield put(actions.loaded(reserves))

  // now that reserves are loaded, get the user's balances for token accounts in the reserves
  yield put(portfolioActions.loadRequested())
}
