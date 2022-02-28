import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const LENGTH = 12

const initialState: PeriodTableState = {
  setts: Array.from(Array(LENGTH)).map(() => ({
    borrowed: 0,
    deposited: 0,
    distributableInterest: 0,
    interestTopline: 1,
  })),
}

export type Sett = {
  borrowed: number
  deposited: number
  distributableInterest: number

  // [0 - 1]
  interestTopline: number
}

export type Borrow = {
  duration: number
  amount: number
}

export type Deposit = {
  duration: number
  amount: number
}
export interface PeriodTableState {
  setts: Sett[]
}

export const periodTableReducer = createSlice({
  name: "periodtable",
  initialState,
  reducers: {
    borrow: (s: PeriodTableState, action: PayloadAction<Borrow>) => {
      const { payload } = action
      const borrowedAmount = payload.amount
      for (let i = 0; i < payload.duration; i++) {
        s.setts[i].borrowed += borrowedAmount
        const interest = (0.06 * borrowedAmount) / 12
        s.setts[i].distributableInterest += interest
      }
    },

    deposit: (s: PeriodTableState, action: PayloadAction<Deposit>) => {
      const { payload } = action
      const depositedAmount = payload.amount

      for (let i = 0; i < payload.duration; i++) {
        s.setts[i].deposited += depositedAmount
      }
    },
  },
})
export default periodTableReducer.reducer
export const actions = periodTableReducer.actions
