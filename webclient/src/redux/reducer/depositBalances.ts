import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Loadable } from "./util"

export type DepositBalances = {
  [mint: string]: {
    collateral: number
    depositNotes: number
  }
}
const initialState: Loadable<DepositBalances> = {
  status: "init",
  state: {},
}

export const depositBalances = createSlice({
  name: "depositBalances",
  initialState,
  reducers: {
    request(s) {
      s.status = "loading"
    },
    loaded(s, a: PayloadAction<DepositBalances>) {
      s.status = "still"
      s.state = a.payload
    },
    errored(s) {
      s.status = "still"
    },
  },
})

export const actions = depositBalances.actions
export default depositBalances.reducer
