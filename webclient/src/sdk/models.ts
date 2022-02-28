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

export interface FixedDeposit {
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

export interface VariableBorrow {
  token: string
  notes: number
}

export interface VariableDeposit {
  token: string
  notes: number
}

export interface Portfolio {
  fixedDeposits: FixedDeposit[]
  fixedBorrows: FixedBorrow[]
  variableBorrows: VariableBorrow[]
  variableDeposits: VariableDeposit[]
}

export interface SettlmentPeriod {
  // how much fixed borrowed
  borrowed: number

  // how much fixed deposit
  deposited: number

  // how much interest can be distributed
  distributableInterest: number
}

export const emptyFixedSettlementPeriods: SettlmentPeriod[] = Array.from(
  Array(12)
).map(() => ({
  borrowed: 0,
  deposited: 0,
  distributableInterest: 0,
}))
