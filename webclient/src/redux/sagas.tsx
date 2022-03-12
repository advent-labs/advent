import { takeLatest } from "redux-saga/effects"
import { userTokenBalancesStateRequested } from "./reducer/userTokenBalances"
import { fetchUserTokenBalances } from "./sagas/fetchTokenBalances.saga"
import { actions as userPortfolioActions } from "./reducer/userPortfolio"
import { actions as reservesActions } from "./reducer/reserves"
import { actions as variableDepositActions } from "./reducer/variableDeposit"
import { actions as fixedBorrowUIActions } from "./ui/borrowui"
import { actions as fixedDepositUIActions } from "./ui/depositui"
import { fetchUserPortfolio } from "./sagas/fetchPortfolio.saga"
import { fetchReserves } from "./sagas/fetchReserves"
import { fixedBorrow } from "./sagas/fixedBorrow.saga"
import { fixedDeposit } from "./sagas/fixedDeposit.saga"
import { readUserPortfolio } from "./sagas/readUserPortfolio.saga"
import { variableDeposit } from "./sagas/variableDeposit.saga"

function* saga() {
  yield takeLatest(userTokenBalancesStateRequested.type, fetchUserTokenBalances)
  yield takeLatest(reservesActions.loadRequested.type, fetchReserves)
  yield takeLatest(
    userPortfolioActions.portfolioInitialized.type,
    readUserPortfolio
  )
  yield takeLatest(variableDepositActions.requested.type, variableDeposit)
  yield takeLatest(userPortfolioActions.loadRequested.type, fetchUserPortfolio)
  yield takeLatest(fixedBorrowUIActions.doRequestBorrow.type, fixedBorrow)
  yield takeLatest(fixedDepositUIActions.depositRequested.type, fixedDeposit)
}

export default saga
