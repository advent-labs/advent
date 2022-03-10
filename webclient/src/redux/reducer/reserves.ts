import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { Loadable } from "./util"

export interface Reserve {
  market: string
  token: string
  vault: string
  depositNoteMint: string
  decimals: number
  settlementTable: SettlementTable
  totalDepositNotes: number
  totalDepositTokens: number
  totalDebt: number
  fixedDebt: number
  fixedDeposits: number
  minBorrowRate: number
  maxBorrowRate: number
  pivotBorrowRate: number
  targetUtilization: number
  variablePoolSubsidy: number
  durationFee: number
}

interface SettlementTable {
  periods: SettlementPeriod[]
}

export interface SettlementPeriod {
  // how much fixed borrowed
  borrowed: number

  // how much fixed deposit
  deposited: number

  // how much interest can be distributed
  freeInterest: number
}

type Reserves = Loadable<Reserve[]>

const initialState: Reserves = {
  state: [],
  status: "init",
}

export const reserves = createSlice({
  name: "reserves",
  initialState,
  reducers: {
    loadRequested(s) {
      s.status = "loading"
    },
    loaded(s, a: PayloadAction<Reserve[]>) {
      s.state = a.payload
      s.status = "still"
    },
  },
})

const selectSettlementPeriodsForToken = (t: string) => (s: RootState) =>
  selectReserveByToken(t)(s)?.settlementTable

const selectReserveByToken = (t: string) => (s: RootState) =>
  s.reserves.state.find((r) => r.token === t)

export const selectors = {
  selectSettlementPeriodsForToken,
  selectReserveByToken,
}

export default reserves.reducer
export const actions = reserves.actions
