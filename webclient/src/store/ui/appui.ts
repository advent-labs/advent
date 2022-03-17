import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."

import { actions as fixedDepositActions } from "../reducer/fixedDeposit"
import { actions as variableDepositActions } from "../reducer/variableDeposit"

export type PortTab = "Overview" | "Lend" | "Borrow"
export type TimeTab = "Months" | "Days"
export type AppUI = {
  isFixed: boolean
  portfolioTab: PortTab
  modalOpen: boolean
  timeTab: TimeTab
  coInputVal: string
  useCollateral: boolean
}

const initialState: AppUI = {
  isFixed: true,
  portfolioTab: "Overview",
  modalOpen: false,
  timeTab: "Months",
  coInputVal: "100",
  useCollateral: true,
}

export const appUI = createSlice({
  name: "appui",
  initialState,
  reducers: {
    setIsFixed: (s: AppUI) => {
      s.isFixed = true
    },
    setIsVariable: (s: AppUI) => {
      s.isFixed = false
    },
    setPortfolioTab: (s: AppUI, action: PayloadAction<PortTab>) => {
      s.portfolioTab = action.payload
    },
    setModalOpen: (s: AppUI) => {
      s.modalOpen = true
    },
    closeModal: (s: AppUI) => {
      s.modalOpen = false
    },
    setTimeTab: (s: AppUI, action: PayloadAction<TimeTab>) => {
      s.timeTab = action.payload
    },
    coInputValHasChanged: (s: AppUI, action: PayloadAction<string>) => {
      s.coInputVal = action.payload
    },
    toggleUseColl: (s: AppUI) => {
      s.useCollateral = !s.useCollateral
      if (!s.useCollateral) {
        s.coInputVal = "0"
      } else {
        s.coInputVal = "100"
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(variableDepositActions.succeeded, (s) => {
      s.modalOpen = false
    })
    builder.addCase(fixedDepositActions.succeeded, (s) => {
      s.modalOpen = false
    })
  },
})

export default appUI.reducer
export const actions = appUI.actions

export const selectAppUIValues = (s: RootState) => ({
  isFixed: s.appui.isFixed,
  portfolioTab: s.appui.portfolioTab,
  modalOpen: s.appui.modalOpen,
  timeTab: s.appui.timeTab,
  coInputVal: s.appui.coInputVal,
  useCollateral: s.appui.useCollateral,
})
