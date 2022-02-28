import { LENGTH, Sett } from './redux/reducer/periodtable'

function calcTopline(depositRatio: number) {
  1 - Math.sqrt(1 - 1 / (1 + depositRatio ** 2))
}

export function interestAllocation(depositRatio: number, topline: number) {
  return (1 - depositRatio ** 2) * (1 - topline ** 2)
}

export function settInfo(sett: Sett) {
  const { borrowed, deposited } = sett
  const distributableInterest = (borrowed / LENGTH) * 0.06
  const depositRatio = borrowed / deposited

  const topline = calcTopline(depositRatio)

  return {
    distributableInterest,
    depositRatio,
  }
}
