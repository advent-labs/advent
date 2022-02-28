import { useContext } from "react"
import { Context } from "../../App"
import { useAppDispatch, useAppSelector } from "../../redux"
import {
  actions as uiActions,
  selectBorrowUIValues,
} from "../../redux/ui/borrowui"

function BorrowInfo() {
  const { amount, duration } = useAppSelector(selectBorrowUIValues)
  const interestPerMonth = (0.06 * amount) / 12
  const totalInterest = interestPerMonth * duration

  return (
    <div>
      <div>Interest/month: {interestPerMonth} </div>
      <div>Total interest: {totalInterest}</div>
    </div>
  )
}

export function FixedBorrow() {
  const dispatch = useAppDispatch()
  const ctx = useContext(Context)
  const { amount, duration, token } = useAppSelector((s) => s.borrowui)
  const reserves = useAppSelector((s) => s.reserves.state)
  const tokenOptions = reserves
    .map((r) => ctx.addresses.mintMetaMap[r.token])
    .map((t) => (
      <option key={t.address} value={t.address}>
        {t.name}
      </option>
    ))

  const durationOptions = Array.from(Array(12)).map((x, i) => (
    <option key={i} value={i + 1}>
      {i + 1}
    </option>
  ))

  const setAmount = (v: string) => dispatch(uiActions.setAmount(v))
  const setDuration = (v: string) => dispatch(uiActions.setDuration(v))
  const setToken = (v: string) => dispatch(uiActions.setToken(v))

  const submit = () => {
    dispatch(
      uiActions.doRequestBorrow({
        amount: parseFloat(amount),
        duration: parseFloat(duration),
        token,
      })
    )
  }

  return (
    <div className="deposit box">
      <h2>Fixed Borrow</h2>
      <div className="columns">
        <div className="column">
          <div className="field">
            <div className="label">Token</div>
            <div className="control">
              <div className="select">
                <select
                  value={token}
                  onChange={(k) => setToken(k.target.value)}
                >
                  {tokenOptions}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Amount $</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={amount}
                onChange={(v) => setAmount(v.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Duration</label>
            <div className="control">
              <div className="select">
                <select
                  value={duration}
                  onChange={(k) => setDuration(k.target.value)}
                >
                  {durationOptions}
                </select>
              </div>
            </div>
          </div>

          <div>
            <button className="button is-info" onClick={submit}>
              Borrow
            </button>
          </div>
        </div>

        <div className="column">
          <BorrowInfo />
        </div>
      </div>
    </div>
  )
}
