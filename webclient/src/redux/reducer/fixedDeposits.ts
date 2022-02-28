import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
interface FixedDeposits {
  state: FixedDeposit[]
}
const initialState: FixedDeposits = {
  state: [],
}

export const fixedDeposits = createSlice({
  name: "fixedDeposits",
  initialState,
  reducers: {
    addDeposit: (s: FixedDeposits, action: PayloadAction<FixedDeposit>) => {
      s.state = [...s.state, action.payload]
    },
  },
})

export default fixedDeposits.reducer
export const actions = fixedDeposits.actions
