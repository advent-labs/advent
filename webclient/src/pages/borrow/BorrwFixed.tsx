import Preview from '../../common/Preview'
import Container from '../../blocks/Container'
import { useAppDispatch, useAppSelector } from '../../redux'
import { Context } from '../../App'
import { ReactNode, useContext } from 'react'
import {
  actions as uiActions,
  selectBorrowUIValues,
} from '../../redux/ui/borrowui'
import { totalInterestEarnedForDeposit } from '../../sdk/eqs'
import { selectors } from '../../redux/reducer/reserves'
import Tabs from '../../common/Tabs'
import TextInput from '../../blocks/TextInput'
import Parameters from '../../common/Parameters'
import Button from '../../blocks/Button'
import { toast } from 'react-toastify'
import Toast, { ToastData } from '../../common/Toast'
import Switch from '../../blocks/Switch'
import DataPoint from '../../common/DataPoint'
import Warning from '../../blocks/Warning'

function BorrowFixed() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, duration, tab, inputVal, inputTime } =
    useAppSelector(selectBorrowUIValues)
  const isRepay = tab === 'Repay'
  const token = useAppSelector((s) => s.borrowui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  if (!reserve) return <></>
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta

  const totalInterestEarned = totalInterestEarnedForDeposit(
    reserve,
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
    return <DataPoint data={e} key={i} />
  })
  return (
    <div className="borrow-fixed columns is-mobile">
      <Container type="dark" xtra="column is-3">
        <Preview reserve={reserve} apr={apr}>
          <Container type="light">{displayDataPoints}</Container>
          <Warning message="APR changes based on lend amount and maturity chosen" />
        </Preview>
      </Container>
      <Container type="background" xtra="column is-9">
        <Tabs
          type="plain"
          options={tabOptions}
          current={tab}
          handler={tabHandler}
        />
        {isRepay ? (
          <Warning message="Borrowed amount can be repayed at maturity where fixed rate borrow will automatically transition to variable rate borrow." />
        ) : (
          <>
            <TextInput
              value={inputVal}
              handleInput={uiActions.inputHasChanged}
            />
            <p>~$0</p>
            <p>Borrow term (max. 1 year)</p>
            <div className="is-flex">
              <TextInput
                value={inputTime}
                handleInput={uiActions.inputTimeHasChanged}
              />
              <div>
                <p>APR fixed</p>
                <p>{apr}</p>
              </div>
            </div>
            <div>SLIDER</div>
          </>
        )}
        <Parameters params={parameters} />
        <Button
          type="primary"
          text={tab}
          handler={() => toast(<Toast props={toastData} />)}
          xtra="is-full-width"
        />
        <p>Wallet balance: XXXXX</p>
      </Container>
    </div>
  )
}

export default BorrowFixed
