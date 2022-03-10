import { useContext } from "react"
import { Context } from "../../App"
import { useAppSelector } from "../../redux"
import { selectors } from "../../redux/reducer/reserves"

export function SettlementPeriods() {
  const { addresses } = useContext(Context)
  const token = useAppSelector((s) => s.dashboardUI.settlementPeriodToken)
  const periods = useAppSelector(
    selectors.selectSettlementPeriodsForToken(token)
  )?.periods
  if (!periods) return <></>
  const rows = periods.map((x, i) => {
    const depositRatio =
      x.deposited === 0 || x.borrowed === 0 ? 0 : x.deposited / x.borrowed
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{x.borrowed}</td>
        <td>{x.deposited}</td>
        <td>{x.freeInterest}</td>
        <td>{depositRatio}</td>
      </tr>
    )
  })
  return (
    <div>
      <h3>{addresses.mintMetaMap[token].name} - Sett Periods</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Borrowed</th>
            <th>Deposited</th>
            <th>Distributable Interest</th>
            <th>Deposit Ratio</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}
