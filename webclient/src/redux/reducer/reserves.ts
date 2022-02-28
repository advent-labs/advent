import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { Loadable } from "./util"
export interface Reserve {
  // mint for token
  token: string

  // the interest rate slope for utilizations before the target
  baseRate: number

  // the interest rate slope for utilizations before the target
  borrowRatePreTarget: number

  // The interest rate slope for utilizations after the target
  borrowRatePostTarget: number

  // the crossover point for the interest rate
  targetUtilization: number

  // percentage of bonus for liquidating
  liquidationBonus: number

  totalOutstandingDebt: number
  // how many deposits, in token units
  totalDeposits: number
  // how many deposit shares are out there
  totalDepositNotes: number
  // how many loan shares are out there
  totalLoanNotes: number

  settlementPeriods: SettlmentPeriod[]
}

export interface SettlmentPeriod {
  // how much fixed borrowed
  borrowed: number

  // how much fixed deposit
  deposited: number

  // how much interest can be distributed
  distributableInterest: number
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

const selectUtilization = (s: Reserves) => (mint: string) => {
  const reserve = s.state.find((x) => x.token === mint)
  if (!reserve) return

  return (
    reserve.totalOutstandingDebt /
    (reserve.totalDeposits + reserve.totalOutstandingDebt)
  )
}

function interestRateFormula(r: Reserve, u: number): number {
  if (u < r.targetUtilization) {
    return r.baseRate + (r.borrowRatePreTarget * u) / r.targetUtilization
  } else {
    return (
      r.baseRate +
      r.borrowRatePreTarget +
      ((u - r.targetUtilization) / (1 - r.targetUtilization)) *
        r.borrowRatePostTarget
    )
  }
}

const selectInterestRate = (s: Reserves) => (mint: string) => {
  const reserve = s.state.find((x) => x.token === mint)
  if (!reserve) return
}

const selectSettlementPeriodsForToken = (t: string) => (s: RootState) =>
  selectReserveByToken(t)(s)?.settlementPeriods
const selectReserveByToken = (t: string) => (s: RootState) =>
  s.reserves.state.find((r) => r.token === t)

export const selectors = {
  selectSettlementPeriodsForToken,
  selectReserveByToken,
}

export default reserves.reducer
export const actions = reserves.actions
