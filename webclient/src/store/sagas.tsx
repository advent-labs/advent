import { takeLatest } from "redux-saga/effects"
import { userTokenBalancesStateRequested } from "./reducer/userTokenBalances"
import { actions as userPortfolioActions } from "./reducer/userPortfolio"
import { actions as reservesActions } from "./reducer/reserves"
import { actions as variableDepositActions } from "./reducer/variableDeposit"
import { actions as fixedDepositActions } from "./reducer/fixedDeposit"
import { actions as depositBalanceActions } from "./reducer/depositBalances"
import { actions as fixedBorrowActions } from "./reducer/fixedBorrow"
import { fetchUserTokenBalances } from "./sagas/fetchTokenBalances.saga"
import { fetchUserPortfolio } from "./sagas/fetchPortfolio.saga"
import { fetchReserves } from "./sagas/fetchReserves"
import { fixedBorrow } from "./sagas/fixedBorrow.saga"
import { fixedDeposit } from "./sagas/fixedDeposit.saga"
import { readUserPortfolio } from "./sagas/readUserPortfolio.saga"
import { variableDeposit } from "./sagas/variableDeposit.saga"
import { fetchUserDepositsBalances } from "./sagas/fetchUserDepositsBalances.saga"

function* saga() {
  yield takeLatest(userTokenBalancesStateRequested.type, fetchUserTokenBalances)
  yield takeLatest(reservesActions.loadRequested.type, fetchReserves)
  yield takeLatest(
    userPortfolioActions.portfolioInitialized.type,
    readUserPortfolio
  )
  yield takeLatest(variableDepositActions.requested.type, variableDeposit)
  yield takeLatest(userPortfolioActions.loadRequested.type, fetchUserPortfolio)
  yield takeLatest(fixedBorrowActions.requested.type, fixedBorrow)
  yield takeLatest(fixedDepositActions.requested.type, fixedDeposit)
  yield takeLatest(
    depositBalanceActions.request.type,
    fetchUserDepositsBalances
  )
}

export default saga
