import { useAppSelector } from './redux'
import { selectBorrowUIValues } from './redux/ui/borrowui'
import { selectDepositUIValues } from './redux/ui/depositui'

export function Periods() {
  const table = useAppSelector((s) => s.periodTable)
  const borrowUi = useAppSelector(selectBorrowUIValues)
  const depositUi = useAppSelector(selectDepositUIValues)

  const newBorrow = (amount: number, index: number) => {
    if (borrowUi.duration < index + 1 || !borrowUi.amount) {
      return <></>
    }
    const newAmount = amount + borrowUi.amount

    return <span>({newAmount})</span>
  }

  const newDeposit = depositUi.amount ? (
    <span>({depositUi.amount})</span>
  ) : (
    <></>
  )

  const rows = table.setts.map((x, i) => {
    const depositRatio =
      x.deposited === 0 || x.borrowed === 0 ? 0 : x.deposited / x.borrowed
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>
          {x.borrowed} {newBorrow(x.borrowed, i)}
        </td>
        <td>
          {x.deposited} {depositUi.duration > i ? newDeposit : <></>}
        </td>
        <td>{x.distributableInterest}</td>
        <td>{depositRatio}</td>
      </tr>
    )
  })
  return (
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
  )
}
