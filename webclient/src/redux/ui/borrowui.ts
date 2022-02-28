import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { actions as reservesActions } from "../reducer/reserves"
import { RootState } from ".."

export interface FixedBorrowPayload {
  amount: number
  token: string
  duration: number
}
export type BorrowUI = {
  duration: string
  amount: string
  token: string
  busy: boolean
}

const initialState: BorrowUI = {
  duration: "1",
  amount: "",
  token: "",
  busy: false,
}

export const borrowUI = createSlice({
  name: "borrowui",
  initialState,
  reducers: {
    setAmount: (s: BorrowUI, action: PayloadAction<string>) => {
      s.amount = action.payload
    },
    setDuration: (s: BorrowUI, action: PayloadAction<string>) => {
      s.duration = action.payload
    },
    setToken: (s, a: PayloadAction<string>) => {
      s.token = a.payload
    },
    doRequestBorrow: (s, a: PayloadAction<FixedBorrowPayload>) => {
      s.busy = true
    },
    borrowSucceed: (s) => {
      s.busy = false
      s.amount = ""
      s.duration = "1"
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reservesActions.loaded, (s, a) => {
      s.token = a.payload[0].token
    })
  },
})

export default borrowUI.reducer
export const actions = borrowUI.actions

export const selectBorrowUIValues = (s: RootState) => ({
  amount: parseFloat(s.borrowui.amount) || 0,
  duration: parseFloat(s.borrowui.duration) || 0,
})
