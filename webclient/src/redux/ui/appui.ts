import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

export type PortTab = 'Overview' | 'Lend' | 'Borrow'
export type AppUI = {
  isFixed: boolean
  portfolioTab: PortTab
  modalOpen: boolean
}

const initialState: AppUI = {
  isFixed: true,
  portfolioTab: 'Overview',
  modalOpen: false,
}

export const appUI = createSlice({
  name: 'depositui',
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
  },
})

export default appUI.reducer
export const actions = appUI.actions

export const selectAppUIValues = (s: RootState) => ({
  isFixed: s.appui.isFixed,
  portfolioTab: s.appui.portfolioTab,
  modalOpen: s.appui.modalOpen,
})
