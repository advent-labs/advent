import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface FixedDepositState {
  status: "still" | "pending"
}

const initialState: FixedDepositState = {
  status: "still",
}

export type FixedDepositRequestPayload = {
  amount: number
  duration: number
  token: string
}

export const fixedDeposit = createSlice({
  name: "fixedDeposit",
  initialState,
  reducers: {
    requested: (s, _action: PayloadAction<FixedDepositRequestPayload>) => {
      s.status = "pending"
    },
    succeeded: (s) => {
      s.status = "still"
    },
    errored: (s) => {
      s.status = "still"
    },
  },
})

export const actions = fixedDeposit.actions
export default fixedDeposit.reducer
