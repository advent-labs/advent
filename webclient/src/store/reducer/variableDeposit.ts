import { createSlice, PayloadAction, Action } from "@reduxjs/toolkit"
import { RootState } from ".."

export interface VariableDepositState {
  status: "still" | "pending"
}

const initialState: VariableDepositState = {
  status: "still",
}

export type VariableDepositRequestedPayload = {
  amount: number
  token: string
}

export const variableDeposit = createSlice({
  name: "variableDeposit",
  initialState,
  reducers: {
    requested: (s, _action: PayloadAction<VariableDepositRequestedPayload>) => {
      s.status = "pending"
    },
    succeeded: (s) => {
      s.status = "still"
    },
    errored: (s) => {
      s.status = "still"
    },
  },
})

export const actions = variableDeposit.actions
export default variableDeposit.reducer

export const selectVariableDepositStatus = (s: RootState) => ({
  status: s.variableDeposit.status,
})
