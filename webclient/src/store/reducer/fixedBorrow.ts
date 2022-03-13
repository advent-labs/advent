import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface FixedBorrowState {
  status: "still" | "pending"
}

const initialState: FixedBorrowState = {
  status: "still",
}

export type FixedBorrowRequestPayload = {
  amount: number
  duration: number
  token: string
}

export const fixedBorrow = createSlice({
  name: "fixedBorrow",
  initialState,
  reducers: {
    requested: (s, _action: PayloadAction<FixedBorrowRequestPayload>) => {
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

export const actions = fixedBorrow.actions
export default fixedBorrow.reducer
