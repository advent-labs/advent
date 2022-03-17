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
import { selectors } from "../../store/reducer/reserves"
import Tabs from "../../common/Tabs"
import TextInput from "../../blocks/TextInput"
import TimeInput from "../../blocks/TimeInput"
import ChangeParameters from "../../common/ChangeParameters"
import Button from "../../blocks/Button"
import { toast } from "react-hot-toast"
import Warning from "../../blocks/Warning"
import Collateral from "../../common/Collateral"
import { Reserve } from "@advent/sdk"
import TimeSlider from "../../common/TimeSlider"
import { selectAppUIValues } from "../../store/ui/appui"
import WalletBalance from "common/WalletBalance"

function DepositFixed() {
  const { addresses } = useContext(Context)
  const token = useAppSelector((s) => s.depositui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  const { amount, duration, tab, durationString } = useAppSelector(
    selectDepositUIValues
  )
  const { timeTab } = useAppSelector(selectAppUIValues)

  if (!reserve) return <></>

  const isMonths = timeTab === "Months"
  const isWithdraw = tab === "Withdraw"
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta
  const amountNormalized = amount * 10 ** reserve.decimals
  const totalInterestEarned = Reserve.math.availableInterestForDuration(
    reserve.settlementTable,
    amountNormalized,
    duration
  )
  const apr = (totalInterestEarned / amountNormalized / duration) * 365 || 0
  const tabOptions = ["Lend", "Withdraw"]
  const tabHandler = (tab: string) => uiActions.setTab(tab)
  const parameters = [
    { label: "Borrow limit", value: 80, nextValue: 85, square: "red" },
    {
      label: "Liquidation threshold",
      value: 85,
      nextValue: 88,
      square: "black",
    },
    { label: "Health factor", value: 1.34, nextValue: 1.52 },
    { label: "Loan to value", value: 75 },
  ]

  const now = Date.now()
  const msMonth = 2.628e9
  const msDay = 8.64e7
  let date
  if (isMonths) {
    date = new Date(now + msMonth * duration)
  } else {
    date = new Date(now + msDay * duration)
  }
  const displayDate = date.toString().slice(3, 16)

  const dataPoints = [
    {
      label: `Total at maturity | ${displayDate}`,
      value: amount,
      currency: name,
      loadedOnce: true,
    },
    {
      label: "Interest earned",
      value: (totalInterestEarned / 10 ** reserve.decimals).toFixed(2),
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

  return (
    <div className="deposit-fixed columns is-mobile">
      <Container type="gradient" xtra="width__35">
        <Preview reserve={reserve} apr={apr}>
          <Warning
            message="APR changes based on lend amount and maturity chosen"
            xtra="mt__2"
          />
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
            <Warning
              message="Lent amount can be withdrawn at maturity where fixed rate lend will automatically transition to variable rate lend."
              xtra="is-primary"
            />
          ) : (
            <div className="center-column">
              <TextInput
                value={amount.toString()}
                handleInput={uiActions.inputHasChanged}
                large
              />
              {/* <p className="text__medium is-black-30">≈$0</p> */}
              <p className="text__medium-m is-grey-1 is-align-self-baseline mb-2">
                Lend term (max. 1 year)
              </p>
              <div className="is-flex is-full-width">
                <TimeInput
                  value={durationString}
                  handleInput={uiActions.setDuration}
                />
                <Container type="light" xtra="br__4 pt-2 pb-2 pl-4 pr-4 ml-4">
                  <p className="text__small is-grey-1">APR fixed</p>
                  <p className="text__xl-m is-grey-1">
                    {(apr * 100).toFixed(2)}%
                  </p>
                </Container>
              </div>
              <TimeSlider
                value={durationString}
                handleInput={uiActions.setDuration}
                isMonths={isMonths}
              />
            </div>
          )}
          <ChangeParameters params={parameters} />
          <Button
            type="secondary"
            text={tab}
            handler={() => toast.success("You did it")}
            xtra="is-full-width mt-4"
          />
          <WalletBalance mint={token} name={name} />
        </Container>
      </div>
    </div>
  )
}

export default DepositFixed
