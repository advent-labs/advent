import { RootState } from "."
import { MintMetaMap } from "../addresses"

export const selectVariableDeposits = (m: MintMetaMap) => (s: RootState) => {
  const portfolio = s.userPortfolio.state
  const deposits = s.depositBalances.state

  const balances = portfolio.variableDeposits.map((d) => {
    const balances = deposits[d.token]
    const collateralPercentage = balances.collateral / balances.depositNotes
    const { name, icon } = m[d.token]
    // TODO
    const rate = 0.073
    return {
      token: d.token,
      name,
      icon,
      rate,
      collateralPercentage,
      collateralAmount: balances.collateral,
      totalDeposited: balances.depositNotes,
    }
  })
  return balances
}
