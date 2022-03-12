import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserReserveData {
  value: number
  currency: string
  loadedOnce: boolean
  icon?: string
  id: string
}
export interface UserReserve {
  icon: string
  mint: string
  uTokenName: string
  data: UserReserveData[]
}

export type DashboardUI = {
  settlementPeriodVisible: boolean
  settlementPeriodToken: string
  supplyTab: string
  borrowTab: string
  collateralSwitchOpen: boolean
  selectedUserReserve: UserReserve
}

const initialState: DashboardUI = {
  settlementPeriodToken: '',
  settlementPeriodVisible: false,
  supplyTab: 'All',
  borrowTab: 'All',
  collateralSwitchOpen: false,
  selectedUserReserve: { icon: '', mint: '', uTokenName: '', data: [] },
}

export const dashboardUI = createSlice({
  name: 'dashboardUI',
  initialState,
  reducers: {
    showSettlementPeriods: (s, action: PayloadAction<string>) => {
      s.settlementPeriodToken = action.payload
      s.settlementPeriodVisible = true
    },
    hideSettlementPeriods: (s) => {
      s.settlementPeriodVisible = false
    },
    setSupplyTab: (s: DashboardUI, action: PayloadAction<string>) => {
      s.supplyTab = action.payload
    },
    setBorrowTab: (s: DashboardUI, action: PayloadAction<string>) => {
      s.borrowTab = action.payload
    },
    openCollateralSwitch: (s: DashboardUI) => {
      s.collateralSwitchOpen = true
    },
    closeCollateralSwitch: (s: DashboardUI) => {
      s.collateralSwitchOpen = false
    },
    setData: (s: DashboardUI, action: PayloadAction<any>) => {
      s.selectedUserReserve = action.payload
    },
  },
})

export default dashboardUI.reducer
export const actions = dashboardUI.actions
