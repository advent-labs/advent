import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

export type PortTab = 'Overview' | 'Supplied' | 'Borrowed'
export type AppUI = {
  isFixed: boolean
  portfolioTab: PortTab
}

const initialState: AppUI = {
  isFixed: true,
  portfolioTab: 'Overview',
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
  },
})

export default appUI.reducer
export const actions = appUI.actions

export const selectAppUIValues = (s: RootState) => ({
  isFixed: s.appui.isFixed,
  portfolioTab: s.appui.portfolioTab,
})
