import { useAppDispatch, useAppSelector } from "../../store"
import { actions } from "../../store/ui/variableBorrow"
import { useContext } from "react"
import { Context } from "../../App"

export function VariableBorrow() {
  return (
    <div className="deposit box">
      <h2>Variable Borrow</h2>
      <Form />
    </div>
  )
}

function Form() {
  const dispatch = useAppDispatch()
  const ctx = useContext(Context)
  const { amount, token } = useAppSelector((s) => s.variableBorrowUI)

  const reserves = useAppSelector((s) => s.reserves.state)
  const tokenOptions = reserves
    .map((r) => ctx.addresses.mintMetaMap[r.token])
    .map((t) => (
      <option key={t.address} value={t.address}>
        {t.name}
      </option>
    ))

  const setAmount = (v: string) => dispatch(actions.setAmount(v))
  const setToken = (v: string) => dispatch(actions.setToken(v))

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

      <div>
        <button className="button is-info" onClick={() => {}}>
          Borrow
        </button>
      </div>
    </>
  )
}
