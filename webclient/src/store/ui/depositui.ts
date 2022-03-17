import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { actions as reservesActions } from "../reducer/reserves"
import { actions as uiActions } from "../ui/appui"
export interface DepositRequestedPayload {
  amount: number
  token: string
  duration: number
}

export type DepositUI = {
  duration: string
  amount: string
  token: string
  busy: boolean
  tab: string
}

const initialState: DepositUI = {
  duration: "1",
  amount: "",
  token: "",
  busy: false,
  tab: "Lend",
}

export const depositUI = createSlice({
  name: "depositui",
  initialState,
  reducers: {
    setAmount: (s: DepositUI, action: PayloadAction<string>) => {
      s.amount = action.payload
    },
    setDuration: (s: DepositUI, action: PayloadAction<string>) => {
      s.duration = action.payload
    },
    setToken: (s, a: PayloadAction<string>) => {
      s.token = a.payload
    },
    depositRequested: (s, a: PayloadAction<DepositRequestedPayload>) => {
      s.busy = true
    },
    depositSucceed: (s) => {
      s.busy = false
      s.amount = ""
      s.duration = "1"
    },
    setTab: (s: DepositUI, action: PayloadAction<string>) => {
      s.tab = action.payload
    },
    inputHasChanged: (s: DepositUI, action: PayloadAction<string>) => {
      s.amount = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reservesActions.loaded, (s, a) => {
      s.token = a.payload[0].token
    })
    builder.addCase(uiActions.setTimeTab, (s, a) => {
      s.duration = "1"
    })
  },
})

export default depositUI.reducer
export const actions = depositUI.actions

export const selectDepositUIValues = (s: RootState) => ({
  amount: parseFloat(s.depositui.amount) || 0,
  duration: parseFloat(s.depositui.duration) || 0,
  durationString: s.depositui.duration,
  tab: s.depositui.tab,
})
