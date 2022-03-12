import { useContext } from "react"
import { Addresses } from "../../addresses"
import { Context } from "../../App"
import { useAppDispatch, useAppSelector } from "../../store"
import { Reserve } from "../../store/reducer/reserves"
import { actions } from "../../store/ui/dashboard"

function Row(
  showSettlementPeriods: (s: string) => void,
  addresses: Addresses,
  r: Reserve
) {
  return (
    <tr key={r.token}>
      <td>{addresses.mintMetaMap[r.token].name}</td>
      <td>{r.totalDepositTokens}</td>
      <td>{r.totalDebt}</td>
      <td>
        <button onClick={() => showSettlementPeriods(r.token)}>
          Sett Periods
        </button>
      </td>
    </tr>
  )
}
export function Reserves() {
  const { addresses } = useContext(Context)
  const reserves = useAppSelector((s) => s.reserves.state)
  const dispatch = useAppDispatch()
  const showSettlementPeriods = (token: string) =>
    dispatch(actions.showSettlementPeriods(token))
  const rows = reserves.map((r) => Row(showSettlementPeriods, addresses, r))
  return (
    <div className="card">
      <div className="card-content">
        <h2>Reserves</h2>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Total Deposits</th>
              <th>Total Debt</th>
              <th>Settlement Table</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  )
}
