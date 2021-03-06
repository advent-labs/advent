import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { actions as reservesActions } from "../reducer/reserves"
import { RootState } from ".."
import { actions as uiActions } from "../ui/appui"
import { actions as fixedBorrowActions } from "../reducer/fixedBorrow"
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
  tab: string
}

const initialState: BorrowUI = {
  duration: "1",
  amount: "",
  token: "",
  busy: false,
  tab: "Borrow",
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
    setTab: (s: BorrowUI, action: PayloadAction<string>) => {
      s.tab = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reservesActions.loaded, (s, a) => {
      if (s.token === "") {
        s.token = a.payload[0].token
      }
    })
    builder.addCase(fixedBorrowActions.succeeded, (s) => {
      s.duration = "1"
      s.amount = "0"
    })
    builder.addCase(uiActions.setTimeTab, (s, a) => {
      s.duration = "1"
    })
  },
})

export default borrowUI.reducer
export const actions = borrowUI.actions

export const selectBorrowUIValues = (s: RootState) => ({
  amount: parseFloat(s.borrowui.amount) || 0,
  duration: parseFloat(s.borrowui.duration) || 0,
  tab: s.borrowui.tab,
  inputVal: s.borrowui.amount,
})
