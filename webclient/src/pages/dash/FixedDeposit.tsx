import { useAppDispatch, useAppSelector } from "../../redux"
import {
  actions as uiActions,
  selectDepositUIValues,
} from "../../redux/ui/depositui"
import { useContext } from "react"
import { Context } from "../../App"
import { totalInterestEarnedForDeposit } from "../../sdk/eqs"
import { selectors } from "../../redux/reducer/reserves"
import { Reserve } from "@advent/sdk"

export function FixedDeposit() {
  return (
    <div className="deposit box">
      <h2>Fixed Deposit</h2>
      <div className="columns">
        <div className="column">
          <DepositForm />
        </div>
        <div className="column">
          <DepositInfo />
        </div>
      </div>
    </div>
  )
}

export function DepositInfo() {
  const { amount, duration } = useAppSelector(selectDepositUIValues)
  const token = useAppSelector((s) => s.depositui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  if (!reserve) return <></>

  const totalInterestEarned = Reserve.math.availableInterestForDuration(
    reserve.settlementTable,
    amount,
    duration
  )
  const apr = (totalInterestEarned / amount / duration) * 12

  return (
    <div>
      <div>Total Interest Earned: {totalInterestEarned}</div>
      <div>APR: {apr}</div>
    </div>
  )
}

function DepositForm() {
  const dispatch = useAppDispatch()
  const ctx = useContext(Context)
  const { amount, duration, token } = useAppSelector((s) => s.depositui)

  const reserves = useAppSelector((s) => s.reserves.state)
  const tokenOptions = reserves
    .map((r) => ctx.addresses.mintMetaMap[r.token])
    .map((t) => (
      <option key={t.address} value={t.address}>
        {t.name}
      </option>
    ))
  const options = Array.from(Array(12)).map((_, i) => (
    <option key={i} value={i + 1}>
      {i + 1}
    </option>
  ))

  const setAmount = (v: string) => dispatch(uiActions.setAmount(v))
  const setDuration = (v: string) => dispatch(uiActions.setDuration(v))
  const setToken = (v: string) => dispatch(uiActions.setToken(v))

  const submit = () => {
    dispatch(
      uiActions.depositRequested({
        amount: parseFloat(amount),
        duration: parseFloat(duration),
        token,
      })
    )
  }
  return (
    <>
      <div className="field">
        <div className="label">Token</div>
        <div className="control">
          <div className="select">
            <select value={token} onChange={(k) => setToken(k.target.value)}>
              {tokenOptions}
            </select>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Amount $</label>
        <div className="control">
          <input
            value={amount}
            onChange={(v) => setAmount(v.target.value)}
            className="input"
            type="number"
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
              {options}
            </select>
          </div>
        </div>
      </div>

      <div>
        <button className="button is-success" onClick={submit}>
          Deposit
        </button>
      </div>
    </>
  )
}
