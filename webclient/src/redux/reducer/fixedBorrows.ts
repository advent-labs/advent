import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface FixedBorrow {
  // when did the deposit start, in seconds
  startTime: number
  // when does it end, in seconds
  endTime: number
  // how much interest will be accumulated, in token units
  interestAmount: number
  // how much is locked, in token units
  amount: number
  // mint for token
  token: string
}
interface FixedBorrows {
  state: FixedBorrow[]
}
const initialState: FixedBorrows = {
  state: [],
}

export const fixedBorrows = createSlice({
  name: "fixedBorrows",
  initialState,
  reducers: {
    addBorrow: (s: FixedBorrows, action: PayloadAction<FixedBorrow>) => {
      s.state = [...s.state, action.payload]
    },
  },
})

export default fixedBorrows.reducer
export const actions = fixedBorrows.actions
