import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type VariableBorrowtUI = {
  amount: string
  token: string
}

const initialState: VariableBorrowtUI = {
  amount: "",
  token: "",
}

export const variableBorrowUI = createSlice({
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

export default variableBorrowUI.reducer
export const actions = variableBorrowUI.actions
