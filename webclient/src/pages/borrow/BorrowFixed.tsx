import Preview from "../../common/Preview"
import Container from "../../blocks/Container"
import { useAppDispatch, useAppSelector } from "../../store"
import { Context } from "../../App"
import { ReactNode, useContext } from "react"
import {
  actions as uiActions,
  selectBorrowUIValues,
} from "../../store/ui/borrowui"
import { selectors } from "../../store/reducer/reserves"
import Tabs from "../../common/Tabs"
import TextInput from "../../blocks/TextInput"
import ChangeParameters from "../../common/ChangeParameters"
import Button from "../../blocks/Button"
import Warning from "../../blocks/Warning"
import TimeInput from "../../blocks/TimeInput"
import TimeSlider from "../../common/TimeSlider"
import { selectAppUIValues } from "../../store/ui/appui"
import WalletBalance from "common/WalletBalance"
import { actions as fixedBorrowActions } from "store/reducer/fixedBorrow"

function BorrowFixed() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, duration, tab, inputVal } =
    useAppSelector(selectBorrowUIValues)
  const timeInput = useAppSelector((s) => s.borrowui.duration)
  const isRepay = tab === "Repay"
  const token = useAppSelector((s) => s.borrowui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  const { timeTab } = useAppSelector(selectAppUIValues)
  const isMonths = timeTab === "Months"

  if (!reserve) return <></>

  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta
  const totalInterestSpent = amount * 0.06
  const apr = totalInterestSpent / amount + duration / 2000 || 0
  const tabOptions = ["Borrow", "Repay"]
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

  const toastData = {
    title: `${tab} Success!`,
    type: "success",
    message: "You did the thing",
  }

  const dataPoints = [
    {
      label: "Total at maturity | XXXDATEXXX",
      value: "0",
      currency: name,
      loadedOnce: true,
    },
    {
      label: "Interest paid",
      value: "0",
      currency: name,
      loadedOnce: true,
    },
  ]

  const handler = () => {
    console.log(amount)
    console.log(reserve.token)
    const token = reserve.token

    dispatch(
      fixedBorrowActions.requested({
        amount: amount * 10 ** reserve.decimals,
        token,
        duration,
      })
    )
  }

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
    <div className="borrow-fixed columns is-mobile">
      <Container type="gradient" xtra="width__35">
        <Preview reserve={reserve} apr={apr}>
          <Warning
            message="APR changes based on lend amount and maturity chosen"
            xtra="mt__2"
          />
          {/* <Collateral /> */}
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
          {isRepay ? (
            <Warning message="Borrowed amount can be repayed at maturity where fixed rate borrow will automatically transition to variable rate borrow." />
          ) : (
            <div className="center-column">
              <TextInput
                value={inputVal}
                handleInput={uiActions.setAmount}
                large
              />
              {/* <p className="text__medium is-black-30">≈$0</p> */}
              <p className="text__medium-m is-grey-1 is-align-self-baseline ml-4 mb-2">
                Lend term (max. 1 year)
              </p>
              <div className="is-flex is-full-width">
                <TimeInput
                  value={timeInput}
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
                value={timeInput}
                handleInput={uiActions.setDuration}
                isMonths={isMonths}
              />
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

export default BorrowFixed
