import { useContext } from "react"
import { useAppSelector } from "../../store"
import { Context } from "../../App"
import { selectVariableDeposits } from "../../store/selectors"

export function UserVariableDeposits() {
  const { addresses } = useContext(Context)
  const balances = useAppSelector(selectVariableDeposits(addresses.mintMetaMap))

  const rows = balances.map((b, i) => (
    <div key={i}>
      <img src={b.icon} />
      {b.name}

      <div>Collateral Percentage: {b.collateralPercentage}</div>
      <div>Total amount deposited: {b.totalDeposited}</div>
      <div>Rate: {b.rate}</div>
    </div>
  ))

  return <div>{rows}</div>
}
