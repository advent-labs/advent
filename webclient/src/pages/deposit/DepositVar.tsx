import { selectUserVariableDeposit } from "store/selectors"
import Preview from "../../common/Preview"
import Container from "../../blocks/Container"
import { useAppDispatch, useAppSelector } from "../../store"
import { Context } from "../../App"
import { ReactNode, useContext, useEffect } from "react"
import {
  actions as uiActions,
  selectDepositUIValues,
} from "../../store/ui/depositui"
import { totalInterestEarnedForDeposit } from "../../sdk/eqs"
import {
  actions as depoActions,
  selectVariableDepositStatus,
} from "../../store/reducer/variableDeposit"
import { selectors } from "../../store/reducer/reserves"
import Tabs from "../../common/Tabs"
import TextInput from "../../blocks/TextInput"
import ChangeParameters from "../../common/ChangeParameters"
import Button from "../../blocks/Button"
import { toast } from "react-hot-toast"
import Toast, { ToastData } from "../../common/Toast"
import Switch from "../../blocks/Switch"
import DataPoint from "../../common/DataPoint"
import Warning from "../../blocks/Warning"
import TimeInput from "../../blocks/TimeInput"
import Collateral from "../../common/Collateral"
import TimeSlider from "../../common/TimeSlider"
import { selectAppUIValues } from "../../store/ui/appui"
import WalletBalance from "common/WalletBalance"
import { selectVariableDeposits } from "store/selectors"

function DepositVar() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, tab } = useAppSelector(selectDepositUIValues)
  const isWithdraw = tab === "Withdraw"
  const token = useAppSelector((s) => s.depositui.token)
  const depositedAmount = useAppSelector(selectUserVariableDeposit(token))
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  if (!reserve) return <></>
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta

  const apr = 0.1396
  const tabOptions = ["Lend", "Withdraw"]
  const tabHandler = (tab: string) => uiActions.setTab(tab)

  const parameters = [
    { label: "Borrow limit", value: 80, square: "red" },
    {
      label: "Liquidation threshold",
      value: 85,
      square: "black",
    },
    { label: "Health factor", value: 1.34 },
    { label: "Loan to value", value: 75 },
  ]

  const toastData = {
    title: `${tab} Success!`,
    type: "success",
    message: "You did the thing",
  }

  const dataPoints = [
    {
      label: "Currently supplying",
      value: depositedAmount,
      currency: name,
      loadedOnce: true,
    },
  ]

  const displayDataPoints = dataPoints.map((e, i) => {
    return (
      <div className="center-column mb-4" key={i}>
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
    dispatch(
      depoActions.requested({
        amount: amount * 10 ** reserve.decimals,
        token,
      })
    )
  }

  return (
    <div className="deposit-fixed columns is-mobile">
      <Container type="gradient" xtra="column width__35">
        <Preview reserve={reserve} apr={apr}>
          <Collateral />
          <Container
            type="background"
            xtra="mt-2 br__8 is-full-width pt-4 pb-0"
          >
            {displayDataPoints}
          </Container>
        </Preview>
      </Container>
      <div className="width__65 p-0">
        <Tabs
          type="plain"
          options={tabOptions}
          current={tab}
          handler={tabHandler}
          xtra="mb-0"
        />
        <Container type="background" xtra="right-modal">
          {isWithdraw ? (
            <Warning message="Lent amount can be withdrawn at maturity where fixed rate lend will automatically transition to variable rate lend." />
          ) : (
            <div className="center-column">
              <TextInput
                value={amount.toString()}
                handleInput={uiActions.inputHasChanged}
                large
              />
              <p className="text__medium is-black-30">≈$0</p>
            </div>
          )}
          <ChangeParameters params={parameters} />
          <Button
            type="secondary"
            text={tab}
            handler={handler}
            xtra="is-full-width mt-4"
          />
          <WalletBalance mint={token} name={name} />
        </Container>
      </div>
    </div>
  )
}

export default DepositVar
