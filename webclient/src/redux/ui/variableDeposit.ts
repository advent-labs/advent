import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."

export type VariableDepositUI = {
  amount: string
  token: string
}

const initialState: VariableDepositUI = {
  amount: "",
  token: "",
}

export const variableDepositUI = createSlice({
  name: "variableDepositUI",
  initialState,
  reducers: {
    setAmount: (s, action: PayloadAction<string>) => {
      s.amount = action.payload
    },
    setToken: (s, a: PayloadAction<string>) => {
      s.token = a.payload
    },
  },
})

export default variableDepositUI.reducer
export const actions = variableDepositUI.actions

export const selectDepositUIValues = (s: RootState) => ({
  amount: parseFloat(s.depositui.amount) || 0,
  duration: parseFloat(s.depositui.duration) || 0,
})
