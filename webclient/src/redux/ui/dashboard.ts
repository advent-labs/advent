import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type DashboardUI = {
  settlementPeriodVisible: boolean
  settlementPeriodToken: string
}

const initialState: DashboardUI = {
  settlementPeriodToken: "",
  settlementPeriodVisible: false,
}

export const dashboardUI = createSlice({
  name: "dashboardUI",
  initialState,
  reducers: {
    showSettlementPeriods: (s, action: PayloadAction<string>) => {
      s.settlementPeriodToken = action.payload
      s.settlementPeriodVisible = true
    },
    hideSettlementPeriods: (s) => {
      s.settlementPeriodVisible = false
    },
  },
})

export default dashboardUI.reducer
export const actions = dashboardUI.actions
