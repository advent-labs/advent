import { selectAppUIValues, actions as appActions } from '../../redux/ui/appui'
import { useAppDispatch, useAppSelector } from '../../redux'
import { actions as uiActions } from '../../redux/ui/depositui'
import { Context } from '../../App'
import { useContext } from 'react'
import Container from '../../blocks/Container'
import RateTabs from '../../common/RateTabs'
import Reserve from '../../common/Reserve'
import { Modal } from '../../common/Modal'
import DepositFixed from './DepositFixed'
import DepositVar from './DepositVar'

function Deposit() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)

  const mockDataFixed = [
    {
      value: 4.56,
      currency: '%',
      loadedOnce: true,
      icon: 'icon',
    },
    {
      value: 45000.32,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      value: 10453000,
      currency: 'USDC',
      loadedOnce: true,
    },
  ]

  const mockDataVar = [
    {
      value: 8.36,
      currency: '%',
      loadedOnce: true,
      icon: 'icon',
    },
    {
      value: 0,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      value: 10453000,
      currency: 'USDC',
      loadedOnce: true,
    },
  ]

  const fixedData = reserves.map((e, i) => {
    const mintMeta = addresses?.mintMetaMap[e.token]
    const { name, icon } = mintMeta
    return {
      icon: icon,
      uTokenName: name,
      mint: e.token,
      data: mockDataFixed,
    }
  })

  const varData = reserves.map((e, i) => {
    const mintMeta = addresses?.mintMetaMap[e.token]
    const { name, icon } = mintMeta
    return {
      icon: icon,
      uTokenName: name,
      mint: e.token,
      data: mockDataVar,
    }
  })

  const onReserveClick = (v: string) => {
    dispatch(uiActions.setToken(v))
    dispatch(appActions.setModalOpen())
  }

  const rowLabels = (
    <div className="columns is-mobile text-left">
      <p className="column is-3 text__medium-m is-gray-1">Asset</p>
      <p className="column is-3 text__medium-m is-gray-1">
        {isFixed ? 'Fixed' : 'Variable'} lending rate
      </p>
      <p className="column is-3 text__medium-m is-gray-1">Supply balance</p>
      <p className="column is-3 text__medium-m is-gray-1">Wallet balance</p>
    </div>
  )

  const reserveRows = isFixed
    ? fixedData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.mint)} />
      })
    : varData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.mint)} />
      })

  return (
    <>
      <div className="center-column title-block">
        <h1 className="text__xl6-semi is-black">Lend crypto and get yield</h1>
        <p className="text__large-semi is-gray-1 width__65 mt-4">
          Build a stable portfolio with fixed rate income on your assets. Lock
          in your yield for up to one year or exit early without penalty at the
          market rate.
        </p>
      </div>
      <Container
        type="background"
        xtra="center-column width__80 center has-shadow"
      >
        <RateTabs />
        <div className="is-full-width mt-4 pl-2 pr-2">{rowLabels}</div>
        <div className="mt-5 is-full-width pl-2 pr-2">
          {reserveRows}
          {reserveRows}
          {reserveRows}
          {reserveRows}
          {reserveRows}
        </div>
      </Container>
      <Modal open={modalOpen} onClose={() => dispatch(appActions.closeModal())}>
        {isFixed ? <DepositFixed /> : <DepositVar />}
      </Modal>
    </>
  )
}

export default Deposit
