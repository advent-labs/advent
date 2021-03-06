import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { Loadable } from "./util"
export interface FixedDeposit {
  // when did the deposit start, in seconds
  startTime: number
  // when does it end, in seconds
  endTime: number
  // how much interest will be accumulated, in token units
  interestAmount: number
  // how much is locked, in token units
  amount: number
  // mint for token
  token: string
}

export interface FixedBorrow {
  // when did the deposit start, in seconds
  startTime: number
  // when does it end, in seconds
  endTime: number
  // how much interest will be accumulated, in token units
  interestAmount: number
  // how much is locked, in token units
  amount: number
  // mint for token
  token: string
}

export interface VariableBorrow {
  // the mint
  token: string
  // the amount
  notes: number
}

export interface VariableDeposit {
  // the mint
  token: string
  // the amount of tokens in collateral
  collateralAmount: number
  // the account holding the collateral
  collateralVaultAccount: string
}

export interface UserPortfolio {
  // the base58 address for the "positions account"
  positionsAddress: string
  fixedDeposits: FixedDeposit[]
  fixedBorrows: FixedBorrow[]
  variableBorrows: VariableBorrow[]
  variableDeposits: VariableDeposit[]
}

export const defaultPortfolio: UserPortfolio = {
  positionsAddress: "",
  fixedBorrows: [],
  fixedDeposits: [],
  variableBorrows: [],
  variableDeposits: [],
}

const initialState: Loadable<UserPortfolio> = {
  status: "init",
  state: {
    ...defaultPortfolio,
  },
}

const userPortfolio = createSlice({
  name: "userPortfolio",
  initialState,
  reducers: {
    portfolioInitialized(s) {},
    loadRequested(s) {
      s.status = "loading"
    },
    loaded(s, a: PayloadAction<UserPortfolio>) {
      s.status = "still"
      s.state = a.payload
    },
  },
})

export const selectors = {
  isPortfolioInitialized: (s: Loadable<UserPortfolio>) =>
    s.state.positionsAddress !== "",
  isVariableDepositInitialized:
    (s: Loadable<UserPortfolio>) => (token: string) => {
      const deposit = s.state.variableDeposits.find((v) => v.token === token)
      return !!deposit
    },
}

export const actions = userPortfolio.actions
export default userPortfolio.reducer
