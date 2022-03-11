import { Reserves } from './Reserves'
import { FixedDeposit } from './FixedDeposit'
import { FixedBorrow } from './FIxedBorrow'
import { FixedLoans } from './FixedLoans'
import { VariableDeposit } from './VarDeposit'
import { VariableBorrow } from './VarBorrow'
import { Modal } from '../../common/Modal'
import { useAppDispatch, useAppSelector } from '../../redux'
import { SettlementPeriods } from './SettlementPeriods'
import { actions } from '../../redux/ui/dashboard'
import UserSupply from '../../common/UserSupply'
import UserBorrow from '../../common/UserBorrow'
import UserRows from '../../common/UserRows'
import { actions as uiActions } from '../../redux/ui/dashboard'
import CollateralSwitch from '../../common/CollateralSwitch'

export function Dash() {
  const settlementPeriodVisible = useAppSelector(
    (s) => s.dashboardUI.settlementPeriodVisible,
  )
  const { supplyTab, borrowTab, collateralSwitchOpen } = useAppSelector(
    (s) => s.dashboardUI,
  )
  const dispatch = useAppDispatch()

  function hideSettlementPeriods() {
    dispatch(actions.hideSettlementPeriods())
  }

  return (
    <>
      <div className="is-flex">
        <div className="buffer" />
      </div>
      <div className="columns">
        <div className="column is-half">
          <UserSupply />
          <UserRows
            currentTab={supplyTab}
            tabHandler={uiActions.setSupplyTab}
          />
        </div>
        <div className="column">
          <UserBorrow />
          <UserRows
            currentTab={borrowTab}
            tabHandler={uiActions.setBorrowTab}
          />
        </div>
      </div>
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
        <Modal
          open={collateralSwitchOpen}
          onClose={() => dispatch(uiActions.closeCollateralSwitch())}
        >
          <CollateralSwitch />
        </Modal>
      </div>
    </>
  )
}
