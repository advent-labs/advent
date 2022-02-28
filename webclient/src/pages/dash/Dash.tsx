import { Reserves } from "./Reserves"
import { FixedDeposit } from "./FixedDeposit"
import { FixedBorrow } from "./FIxedBorrow"
import { FixedLoans } from "./FixedLoans"
import { VariableDeposit } from "./VarDeposit"
import { VariableBorrow } from "./VarBorrow"
import { Modal } from "../../common/Modal"
import { useAppDispatch, useAppSelector } from "../../redux"
import { SettlementPeriods } from "./SettlementPeriods"
import { actions } from "../../redux/ui/dashboard"
export function Dash() {
  const settlementPeriodVisible = useAppSelector(
    (s) => s.dashboardUI.settlementPeriodVisible
  )
  const dispatch = useAppDispatch()

  function hideSettlementPeriods() {
    dispatch(actions.hideSettlementPeriods())
  }

  return (
    <div className="content">
      <h1>Dash</h1>
      <div>
        <Reserves />
      </div>
      <div className="columns">
        <div className="column">
          <FixedDeposit />
        </div>
        <div className="column">
          <FixedBorrow />
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <VariableDeposit />
        </div>
        <div className="column">
          <VariableBorrow />
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <FixedLoans />
        </div>
      </div>
      <Modal open={settlementPeriodVisible} onClose={hideSettlementPeriods}>
        <SettlementPeriods />
      </Modal>
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content"></div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    </div>
  )
}
