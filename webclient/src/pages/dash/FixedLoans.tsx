import { useContext } from "react"
import { Addresses } from "../../addresses"
import { Context } from "../../App"
import { useAppSelector } from "../../redux"
import { FixedBorrow } from "../../redux/reducer/userPortfolio"

function Row(i: number, b: FixedBorrow, a: Addresses) {
  return (
    <tr key={i}>
      <td>{a.mintMetaMap[b.token].name}</td>
      <td>{b.amount}</td>
      <td>{b.endTime - b.startTime}</td>
    </tr>
  )
}

export function FixedLoans() {
  const bs = useAppSelector((s) => s.userPortfolio.state.fixedBorrows)
  const ctx = useContext(Context)
  const rows = bs.map((b, i) => Row(i, b, ctx.addresses))

  return (
    <div className="card">
      <div className="card-content">
        <h2>User's Fixed Loans</h2>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Amount</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  )
}
