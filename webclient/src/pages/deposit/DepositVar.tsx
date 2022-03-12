import Preview from "../../common/Preview"
import Container from "../../blocks/Container"
import { useAppDispatch, useAppSelector } from "../../store"
import { Context } from "../../App"
import { ReactNode, useContext } from "react"
import {
  actions as uiActions,
  selectDepositUIValues,
} from "../../store/ui/depositui"
import { totalInterestEarnedForDeposit } from "../../sdk/eqs"
import { actions as depoActions } from "../../store/reducer/variableDeposit"
import { selectors } from "../../store/reducer/reserves"
import Tabs from "../../common/Tabs"
import TextInput from "../../blocks/TextInput"
import Parameters from "../../common/Parameters"
import Button from "../../blocks/Button"
import { toast } from "react-toastify"
import Toast, { ToastData } from "../../common/Toast"
import Switch from "../../blocks/Switch"
import DataPoint from "../../common/DataPoint"
import Warning from "../../blocks/Warning"
import TimeInput from "../../blocks/TimeInput"
import Collateral from "../../common/Collateral"

function DepositVar() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, duration, tab, inputTime } = useAppSelector(
    selectDepositUIValues
  )
  const isWithdraw = tab === "Withdraw"
  const token = useAppSelector((s) => s.depositui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  if (!reserve) return <></>
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta

  const apr = 13.96
  const tabOptions = ["Lend", "Withdraw"]
  const tabHandler = (tab: string) => uiActions.setTab(tab)
  const parameters = [
    { label: "Borrow limit used", value: "23$" },
    { label: "Borrow limit", value: "$200,000" },
    { label: "Liquidation threshold", value: "$200,000" },
    { label: "Health factor", value: "1.83" },
    { label: "Loan to value", value: "75%" },
  ]

  const toastData = {
    title: `${tab} Success!`,
    type: "success",
    message: "You did the thing",
  }

  const dataPoints = [
    {
      label: "Currently supplying",
      value: "0",
      currency: name,
      loadedOnce: true,
    },
  ]

  const displayDataPoints = dataPoints.map((e, i) => {
    return (
      <div className="center-column" key={i}>
        <p className="text__medium-m is-grey-1">{e.label}</p>
        <p className="text__xl-m is-black mt-2">
          {e.value}&nbsp;{e.currency}
        </p>
      </div>
    )
  })

  const handler = () => {
    console.log(amount)
    console.log(reserve.token)
    console.log("clicked!")
    const token = reserve.token
    dispatch(depoActions.requested({ amount, token }))
  }

  return (
    <div className="deposit-fixed columns is-mobile">
      <Container type="gradient" xtra="column is-4">
        <Preview reserve={reserve} apr={apr}>
          <Warning
            message="APR changes based on lend amount and maturity chosen"
            xtra="mt__2"
          />
          <Collateral />
          <Container type="background" xtra="mt-2 br__8 is-full-width">
            {displayDataPoints}
          </Container>
        </Preview>
      </Container>
      <div className="column is-8 p-0">
        <Tabs
          type="plain"
          options={tabOptions}
          current={tab}
          handler={tabHandler}
          xtra="mb-0"
        />
        <Container type="background">
          {isWithdraw ? (
            <Warning message="Lent amount can be withdrawn at maturity where fixed rate lend will automatically transition to variable rate lend." />
          ) : (
            <div className="center-column">
              <TextInput
                value={amount.toString()}
                handleInput={uiActions.inputHasChanged}
                large
              />
              <p className="text__medium is-black-30">~$0</p>
              <p className="text__medium-m is-grey-1 is-align-self-baseline ml-4 mb-2">
                Label
              </p>
              <div className="is-flex is-full-width">
                <TimeInput
                  value={inputTime}
                  handleInput={uiActions.inputTimeHasChanged}
                />
                <Container type="light" xtra="br__4 p-2 ml-4">
                  <p className="text__small is-grey-1">APR fixed</p>
                  <p className="text__xl-m is-grey-1">{apr}%</p>
                </Container>
              </div>
              <div>SLIDER</div>
            </div>
          )}
          <Parameters params={parameters} />
          <Button
            type="secondary"
            text={tab}
            handler={handler}
            xtra="is-full-width mt-4"
          />
          <div className="is-flex is-align-items-center mt-4">
            <p className="text__medium-m is-grey-1">Wallet balance</p>
            <p className="text__medium-m is-black ml-2">XXXXXXXX</p>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default DepositVar
