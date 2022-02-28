export interface Deposit {
  token: string
  originalAmount: number
  rate: number
}

export interface VariableDeposit extends Deposit {
  isCollateral: boolean
  currentAmount: number
}

export interface FixedDeposit extends Deposit {
  start: Date
  expiration: Date
}

export interface Loan {
  token: string
  originalAmount: number
  rate: number
}

export interface FixedLoan {
  start: Date
  expiration: Date
}

export interface VariableLoan extends Loan {
  currentAmount: number
}

export interface Portfolio {
  fixedDeposits: FixedDeposit[]
  variableDeposits: VariableDeposit[]
  fixedLoans: FixedLoan[]
  variableLoans: VariableLoan[]
}

export interface Reserve {
  // how much collateral does one need for loans
  minCollateralRatio: number
  token: string
  amount: number
  utilization: number
}
