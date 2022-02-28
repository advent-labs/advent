import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import borrowui from './ui/borrowui'
import variableDepositUI from './ui/variableDeposit'
import variableBorrowUI from './ui/variableBorrow'
import depositui from './ui/depositui'
import dashboardUI from './ui/dashboard'
import createSagaMiddleware from 'redux-saga'
import { solanaConnectionContext } from '../solanaConnectionContext'
import saga from './sagas'
import userTokenAccounts from './reducer/userTokenBalances'
import reserves from './reducer/reserves'
import userPortfolio from './reducer/userPortfolio'
import appui from './ui/appui'

const sagaMiddleware = createSagaMiddleware({
  context: {
    solanaConnectionContext,
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
