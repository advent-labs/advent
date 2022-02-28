import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface VariableDeposit {
  // value of the deposit, in token units
  amount: number
  // mint for token
  token: string
}
interface VariableDeposits {
  state: VariableDeposit[]
}
const initialState: VariableDeposits = {
  state: [],
}

export const variableDeposits = createSlice({
  name: "variableDeposits",
  initialState,
  reducers: {
    addDeposit: (
      s: VariableDeposits,
      action: PayloadAction<VariableDeposit>
    ) => {
      const p = action.payload
      s.state = s.state.map((x) => {
        if (x.token === p.token) {
          return {
            ...x,
            amount: x.amount + p.amount,
          }
        }
        return x
      })
    },
  },
})

export default variableDeposits.reducer
export const actions = variableDeposits.actions
