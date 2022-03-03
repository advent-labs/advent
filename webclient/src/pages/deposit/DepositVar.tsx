import Preview from '../../common/Preview'
import Container from '../../blocks/Container'
import { useAppDispatch, useAppSelector } from '../../redux'
import { Context } from '../../App'
import { ReactNode, useContext } from 'react'
import {
  actions as uiActions,
  selectDepositUIValues,
} from '../../redux/ui/depositui'
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

function DepositVar() {
  const dispatch = useAppDispatch()
  const { addresses } = useContext(Context)
  const { amount, duration, tab, inputVal, inputTime } = useAppSelector(
    selectDepositUIValues,
  )
  const isWithdraw = tab === 'Withdraw'
  const token = useAppSelector((s) => s.depositui.token)
  const reserve = useAppSelector(selectors.selectReserveByToken(token))
  if (!reserve) return <></>
  const mintMeta = addresses?.mintMetaMap[token]
  const { name } = mintMeta

  const apr = 13.96
  const tabOptions = ['Lend', 'Withdraw']
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
      label: 'Currently supplying',
      value: '0',
      currency: name,
      loadedOnce: true,
    },
  ]

  const displayDataPoints = dataPoints.map((e, i) => {
    return <DataPoint data={e} key={i} />
  })

  return (
    <div className="deposit-var columns is-mobile">
      <Container type="dark" xtra="column is-3">
        <Preview reserve={reserve} apr={apr}>
          <Container type="light">
            <p>Use as collateral</p>
            <div className="is-flex">
              <p>100%</p>
              <Switch />
            </div>
          </Container>
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

        <TextInput value={inputVal} handleInput={uiActions.inputHasChanged} />
        <p>~$0</p>

        <Parameters params={parameters} />
        <Button
          type="primary"
          text={tab}
          handler={() => toast(<Toast props={toastData} />)}
        />
        <p>Wallet balance: XXXXXXX</p>
      </Container>
    </div>
  )
}

export default DepositVar
