import * as R from "ramda"
import { SettlmentPeriod } from "../redux/reducer/reserves"
import { Reserve } from "./models"

export function totalLiquidity(r: Reserve): number {
  return r.totalDeposits + r.totalOutstandingDebt
}

export function utilization(r: Reserve): number {
  return r.totalOutstandingDebt / totalLiquidity(r)
}

export function maxFixedBorrowAmount(r: Reserve): number {
  const u = utilization(r)
  const uRemaining = Math.max(0.5 - u, 0)
  return uRemaining * totalLiquidity(r)
}

/** Calculate fixed interest amount paid for duration & amount borrowed */
export function fixedLoanInterestAmount(
  r: Reserve,
  amount: number,
  settlementPeriods: number
) {
  return amount * 0.11
}

/** Calculate APR for fixed borrow */
export function fixedBorrowAnnualInterestRate(
  r: Reserve,
  amount: number,
  duration: number
) {
  return 0.06
}

/** Calculate list of interest rates for each sett period with a given deposit */
export function allocatedInterestRatesForDeposit(
  r: Reserve,
  amount: number,
  periods: number
) {
  return r.settlementPeriods
    .slice(0, periods)
    .map((p) =>
      allocatedInterestRateForPeriod({ ...p, deposited: p.deposited + amount })
    )
}

/** Calculate list of interest earned amounts for each sett period with a given deposit */
export function allocatedInterestAmountsForDeposit(
  reserve: Reserve,
  amount: number,
  periods: number
): number[] {
  return reserve.settlementPeriods
    .slice(0, periods)
    .map((p) =>
      allocatedInterestAmountForPeriod({
        ...p,
        deposited: p.deposited + amount,
      })
    )
}

/** Calculate overall interest earned for a given deposit */
export function totalInterestEarnedForDeposit(
  reserve: Reserve,
  amount: number,
  periods: number
): number {
  const interestAmounts = allocatedInterestAmountsForDeposit(
    reserve,
    amount,
    periods
  )
  console.log(interestAmounts)
  return R.sum(interestAmounts)
}

/** Calculate interest rate for a single settlement period with a new deposit */
export function allocatedInterestRateForPeriod(p: SettlmentPeriod) {
  // (1 - ratio^2) * (1 - Interest^2) = 1)
  const ratio = p.deposited / p.borrowed
  console.log(ratio)
  return Math.sqrt(1 - 1 / (1 + ratio ** 2))
}

export function allocatedInterestAmountForPeriod(p: SettlmentPeriod) {
  if (p.borrowed === 0) return 0
  const rate = allocatedInterestRateForPeriod(p)
  return rate * p.distributableInterest
}
