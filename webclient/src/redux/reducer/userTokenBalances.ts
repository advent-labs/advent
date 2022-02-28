import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'

export interface UserTokenBalancesState {
  status: 'loaded' | 'loading' | 'init' | 'error'
  balances: UserTokenBalances
  loadedOnce: boolean
}

export interface UserTokenBalances {
  [mint: string]: number
}

const initialState: UserTokenBalancesState = {
  status: 'init',
  balances: {},
  loadedOnce: false,
}

export const userTokenBalances = createSlice({
  name: 'userTokenBalances',
  initialState,
  reducers: {
    userTokenBalancesStateLoaded: (
      s: UserTokenBalancesState,
      action: PayloadAction<{
        splBalances: UserTokenBalances
      }>,
    ) => {
      const payload = action.payload
      s.balances = payload.splBalances
      s.status = 'loaded'
      s.loadedOnce = true
    },
    userTokenBalancesStateErrored: (
      s: UserTokenBalancesState,
      action: Action,
    ) => {
      s.status = 'error'
    },
    userTokenBalancesStateRequested: (
      s: UserTokenBalancesState,
      action: Action,
    ) => {
      s.status = 'loading'
    },
    resetTokenBalances: (s: UserTokenBalancesState, action: Action) => {
      s.balances = {}
      s.status = 'init'
      s.loadedOnce = false
    },
  },
})

export const {
  userTokenBalancesStateErrored,
  userTokenBalancesStateLoaded,
  userTokenBalancesStateRequested,
  resetTokenBalances,
} = userTokenBalances.actions
export default userTokenBalances.reducer
