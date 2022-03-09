type Point = { x: number; y: number }

/** find the y-value between points a & b at x */
export function interpolate(x: number, a: Point, b: Point) {
  const { x: x0, y: y0 } = a
  const { x: x1, y: y1 } = b

  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0)
}

export function utilization(totalDebt: number, totalDeposits: number) {
  return totalDebt / (totalDebt + totalDeposits)
}

export function floatingInterestRate(
  utilization: number,
  minBorrowRate: number,
  maxBorrowRate: number,
  pivotBorrowRate: number,
  targetUtilization: number
) {
  if (utilization <= 0) {
    return minBorrowRate
  }

  if (utilization < targetUtilization) {
    return interpolate(
      utilization,
      { x: 0, y: minBorrowRate },
      { x: targetUtilization, y: pivotBorrowRate }
    )
  }

  if (utilization < 1) {
    return interpolate(
      utilization,
      { x: targetUtilization, y: pivotBorrowRate },
      { x: 1, y: maxBorrowRate }
    )
  }

  return maxBorrowRate
}
