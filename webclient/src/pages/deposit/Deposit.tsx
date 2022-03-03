import { selectAppUIValues, actions as appActions } from '../../redux/ui/appui'
import { useAppDispatch, useAppSelector } from '../../redux'
import { actions as uiActions } from '../../redux/ui/depositui'
import { Context } from '../../App'
import { useContext } from 'react'
import Container from '../../blocks/Container'
import RateTabs from '../../common/RateTabs'
import Reserve from '../../common/Reserve'
import Portfolio from '../../common/Portfolio'
import { Modal } from '../../common/Modal'
import DepositFixed from './DepositFixed'
import DepositVar from './DepositVar'

function Deposit() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)
  const form = isFixed ? <DepositFixed /> : <DepositVar />

  const mockDataFixed = [
    {
      label: 'Fixed lending rate',
      value: 4.56,
      currency: '%',
      loadedOnce: true,
    },
    {
      label: 'Supplied by me',
      value: 45000.32,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      label: 'My wallet balance',
      value: 10453000,
      currency: 'USDC',
      loadedOnce: true,
    },
  ]

  const mockDataVar = [
    {
      label: 'Variable lending rate',
      value: 8.36,
      currency: '%',
      loadedOnce: true,
    },
    {
      label: 'Supplied by me',
      value: 0,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      label: 'My wallet balance',
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

  const reserveRows = isFixed
    ? fixedData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.mint)} />
      })
    : varData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.mint)} />
      })

  return (
    <>
      <div className="columns">
        <Container type="dark" id="reserve-list" xtra="column is-9">
          <h1>Lend crypto and get yield</h1>
          <RateTabs />
          <div className="mt-5 is-full-width">{reserveRows}</div>
        </Container>
        <Container type="light" id="portfolio" xtra="column is-3">
          <Portfolio />
        </Container>
      </div>
      <Modal open={modalOpen} onClose={() => dispatch(appActions.closeModal())}>
        {isFixed ? <DepositFixed /> : <DepositVar />}
      </Modal>
    </>
  )
}

export default Deposit
