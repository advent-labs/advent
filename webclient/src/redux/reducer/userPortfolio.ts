import { createSlice, PayloadAction } from "@reduxjs/toolkit"
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
  // the amount
  notes: number
}

export interface UserPortfolio {
  fixedDeposits: FixedDeposit[]
  fixedBorrows: FixedBorrow[]
  variableBorrows: VariableBorrow[]
  variableDeposits: VariableDeposit[]
}

const initialState: Loadable<UserPortfolio> = {
  status: "init",
  state: {
    fixedBorrows: [],
    fixedDeposits: [],
    variableBorrows: [],
    variableDeposits: [],
  },
}

const userPortfolio = createSlice({
  name: "userPortfolio",
  initialState,
  reducers: {
    loadRequested(s) {
      s.status = "loading"
    },
    loaded(s, a: PayloadAction<UserPortfolio>) {
      s.status = "still"
      s.state = a.payload
    },
  },
})

export const actions = userPortfolio.actions
export default userPortfolio.reducer
