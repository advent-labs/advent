import Preview from '../../common/Preview'
import Container from '../../blocks/Container'
import { useAppDispatch, useAppSelector } from '../../store'
import { Context } from '../../App'
import { ReactNode, useContext } from 'react'
import {
  actions as uiActions,
  selectBorrowUIValues,
} from '../../store/ui/borrowui'
import { totalInterestEarnedForDeposit } from '../../sdk/eqs'
import { selectors } from '../../store/reducer/reserves'
import Tabs from '../../common/Tabs'
import TextInput from '../../blocks/TextInput'
import Parameters from '../../common/Parameters'
import Button from '../../blocks/Button'
import { toast } from 'react-toastify'
import Toast, { ToastData } from '../../common/Toast'
import Switch from '../../blocks/Switch'
import DataPoint from '../../common/DataPoint'
import Warning from '../../blocks/Warning'
import TimeInput from '../../blocks/TimeInput'
import Collateral from '../../common/Collateral'
import { Reserve } from '@advent/sdk'
import TimeSlider from '../../common/TimeSlider'
import { selectAppUIValues } from '../../store/ui/appui'

function BorrowFixed() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, duration, tab, inputVal, inputTime } =
    useAppSelector(selectBorrowUIValues)
  const isRepay = tab === 'Repay'
  const token = useAppSelector((s) => s.borrowui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  const { timeTab } = useAppSelector(selectAppUIValues)
  const isMonths = timeTab === 'Months'
  if (!reserve) return <></>
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta
  const totalInterestEarned = Reserve.math.availableInterestForDuration(
    reserve.settlementTable,
    amount,
    duration,
  )
  const apr = (totalInterestEarned / amount / duration) * 12 || 0
  const tabOptions = ['Borrow', 'Repay']
  const tabHandler = (tab: string) => uiActions.setTab(tab)
  const parameters = [
    { label: 'Borrow limit used', value: '23$' },
    { label: 'Borrow limit', value: '$200,000' },
    { label: 'Liquidation threshold', value: '$200,000' },
    { label: 'Health factor', value: '1.83' },
    { label: 'Loan to value', value: '75%' },
  ]

  const toastData = {
    title: `${tab} Success!`,
    type: 'success',
    message: 'You did the thing',
  }

  const dataPoints = [
    {
      label: 'Total at maturity | XXXDATEXXX',
      value: '0',
      currency: name,
      loadedOnce: true,
    },
    {
      label: 'Interest earned',
      value: '0',
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

  return (
    <div className="borrow-fixed columns is-mobile">
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
          {isRepay ? (
            <Warning message="Borrowed amount can be repayed at maturity where fixed rate borrow will automatically transition to variable rate borrow." />
          ) : (
            <div className="center-column">
              <TextInput
                value={inputVal}
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
              <TimeSlider
                value={inputTime}
                handleInput={uiActions.inputTimeHasChanged}
                isMonths={isMonths}
              />
            </div>
          )}
          <Parameters params={parameters} />
          <Button
            type="secondary"
            text={tab}
            handler={() => toast(<Toast props={toastData} />)}
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

export default BorrowFixed
