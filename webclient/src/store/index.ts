import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import borrowui from "./ui/borrowui"
import variableDepositUI from "./ui/variableDeposit"
import variableBorrowUI from "./ui/variableBorrow"
import depositui from "./ui/depositui"
import dashboardUI from "./ui/dashboard"
import createSagaMiddleware from "redux-saga"
import { solanaConnectionContext } from "../solanaConnectionContext"
import saga from "./sagas"
import userTokenAccounts from "./reducer/userTokenBalances"
import fixedDeposit from "./reducer/fixedDeposit"
import fixedBorrow from "./reducer/fixedBorrow"
import variableDeposit from "./reducer/variableDeposit"
import reserves from "./reducer/reserves"
import userPortfolio from "./reducer/userPortfolio"
import depositBalances from "./reducer/depositBalances"
import appui from "./ui/appui"

const sagaMiddleware = createSagaMiddleware({
  context: {
    solanaConnectionContext,
  },
  onError: (e: any) => {
    console.log(e)
  },
})

export const store = configureStore({
  reducer: {
    borrowui,
    depositui,
    userTokenAccounts,
    reserves,
    userPortfolio,
    variableDepositUI,
    variableBorrowUI,
    dashboardUI,
    appui,
    fixedDeposit,
    fixedBorrow,
    variableDeposit,
    depositBalances,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(saga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
