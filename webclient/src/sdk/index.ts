import { addresses } from "../addresses"
import {
  allocatedInterestAmountForPeriod,
  fixedBorrowAnnualInterestRate,
  totalInterestEarnedForDeposit,
} from "./eqs"
import {
  Reserve,
  Portfolio,
  FixedBorrow,
  FixedDeposit,
  emptyFixedSettlementPeriods,
} from "./models"

const clone = (o: Object) => JSON.parse(JSON.stringify(o))

const reserveUSDC: Reserve = {
  token: addresses.dev.mintUsdc,
  baseRate: 0.01,
  borrowRatePreTarget: 0.05,
  borrowRatePostTarget: 0.1,
  targetUtilization: 0.8,
  liquidationBonus: 0.05,
  totalOutstandingDebt: 0,
  totalDeposits: 10000,
  totalLoanNotes: 0,
  totalDepositNotes: 10000,
  settlementPeriods: clone(emptyFixedSettlementPeriods),
}

const reserveUSDT: Reserve = {
  token: addresses.dev.mintUsdt,
  baseRate: 0.01,
  borrowRatePreTarget: 0.05,
  borrowRatePostTarget: 0.1,
  targetUtilization: 0.8,
  liquidationBonus: 0.05,
  totalOutstandingDebt: 0,
  totalDeposits: 10000,
  totalLoanNotes: 0,
  totalDepositNotes: 10000,
  settlementPeriods: clone(emptyFixedSettlementPeriods),
}

const portfolio: Portfolio = {
  fixedDeposits: [],
  fixedBorrows: [],
  variableBorrows: [],
  variableDeposits: [],
}

export class AdventSDK {
  constructor() {}

  async market() {
    return new AdventMarket()
  }
}

/**
 * Phony baloney SDK
 */
export class AdventMarket {
  reserves: Reserve[]

  constructor() {
    this.reserves = [reserveUSDC, reserveUSDT]
  }

  /** Fetch all reserves */
  async fetchReserves() {
    return clone(this.reserves)
  }

  /** Fetch the user's portfolio of borrows/deposits */
  async fetchUserPortfolio(): Promise<Portfolio> {
    return clone(portfolio)
  }

  /** Perform a variable borrow */
  async variableBorrow(token: string, amount: number) {
    const reserve = this.findReserve(token)
    doVariableBorrow(reserve, amount)
  }

  /** Perform a variable deposit */
  async variableDeposit(token: string, amount: number) {
    const reserve = this.findReserve(token)
    doVariableDeposit(reserve, amount)
  }

  /** Perform a fixed borrow */
  async fixedBorrow(token: string, amount: number, duration: number) {
    const reserve = this.findReserve(token)
    fixedBorrow(reserve, amount, duration)
  }

  /** Perform a fixed deposit */
  async fixedDeposit(token: string, amount: number, duration: number) {
    const reserve = this.findReserve(token)
    fixedDeposit(reserve, amount, duration)
  }

  findReserve(mint: string) {
    const reserve = this.reserves.find((x) => x.token === mint)
    if (!reserve) {
      throw new Error(`Reserve not found for mint ${mint}`)
    }
    return reserve
  }
}

function fixedBorrow(r: Reserve, amount: number, duration: number) {
  r.totalDeposits -= amount
  r.totalOutstandingDebt += amount

  const newFixedBorrow: FixedBorrow = {
    token: r.token,
    amount,
    startTime: 0,
    endTime: duration,
    interestAmount: 10,
  }
  portfolio.fixedBorrows.push(newFixedBorrow)

  const interestRate = fixedBorrowAnnualInterestRate(r, amount, duration)

  for (let i = 0; i < duration; i++) {
    const p = r.settlementPeriods[i]
    p.borrowed += amount
    const interest = (interestRate * amount) / 12
    p.distributableInterest += interest
  }
}

function fixedDeposit(r: Reserve, amount: number, duration: number) {
  r.totalDeposits += amount

  // calculate earned interest, in absolute value
  const interestAmount = totalInterestEarnedForDeposit(r, amount, duration)

  const fixedDepositRecord: FixedDeposit = {
    token: r.token,
    amount,
    startTime: 0,
    endTime: duration,
    interestAmount,
  }

  portfolio.fixedDeposits.push(fixedDepositRecord)

  // update table
  for (let i = 0; i < duration; i++) {
    const p = r.settlementPeriods[i]
    p.deposited += amount
    const interestPaid = allocatedInterestAmountForPeriod(p)
    console.log(interestPaid)
    p.distributableInterest -= interestPaid
  }
}

function doVariableDeposit(r: Reserve, amount: number) {
  r.totalDeposits += amount

  doRegisterNewDepositIfNeeded(r.token)

  const x = findVariableDeposit(r.token)
  x.notes += amount
}

function doVariableBorrow(r: Reserve, amount: number) {
  r.totalDeposits -= amount
  r.totalOutstandingDebt += amount

  doRegisterNewBorrowIfNeeded(r.token)

  const borrow = findVariableBorrow(r.token)
  borrow.notes += amount
}

/** Register new variable borrow asset */
function doRegisterNewBorrow(token: string) {
  portfolio.variableBorrows.push({
    token,
    notes: 0,
  })
}

/** Register new variable deposit asset */
function doRegisterNewDeposit(token: string) {
  portfolio.variableDeposits.push({
    token,
    notes: 0,
  })
}

/** Register new variable borrow asset if not already registered */
function doRegisterNewBorrowIfNeeded(token: string) {
  try {
    findVariableBorrow(token)
  } catch {
    doRegisterNewBorrow(token)
  }
}

/** Register new variable deposit asset if not already registered */
function doRegisterNewDepositIfNeeded(token: string) {
  try {
    findVariableDeposit(token)
  } catch {
    doRegisterNewDeposit(token)
  }
}

function findVariableBorrow(token: string) {
  const borrow = portfolio.variableBorrows.find((b) => b.token === token)
  if (!borrow) {
    throw new Error(`Borrow not found for mint ${token}`)
  }
  return borrow
}

/** Get the user's variable deposit for mint */
function findVariableDeposit(token: string) {
  const x = portfolio.variableDeposits.find((b) => b.token === token)
  if (!x) {
    throw new Error(`Deposit not found for mint ${token}`)
  }
  return x
}
