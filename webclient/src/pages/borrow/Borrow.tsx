import { selectAppUIValues, actions as appActions } from '../../redux/ui/appui'
import { useAppDispatch, useAppSelector } from '../../redux'
import {
  actions as uiActions,
  selectBorrowUIValues,
} from '../../redux/ui/borrowui'
import { Context } from '../../App'
import { ReactNode, useContext } from 'react'
import Container from '../../blocks/Container'
import RateTabs from '../../common/RateTabs'
import Reserve from '../../common/Reserve'
import usdcIcon from '../../assets/usdc.svg'
import Portfolio from '../../common/Portfolio'
import { Modal } from '../../common/Modal'
import BorrowFixed from './BorrwFixed'
import BorrowVar from './BorrowVar'

function Borrow() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)

  const mockDataFixed = [
    {
      label: 'Fixed borrow rate',
      value: 6.56,
      currency: '%',
      loadedOnce: true,
    },
    {
      label: 'Borrowed by me',
      value: 45000.32,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      label: 'Max I can borrow',
      value: 10000000,
      currency: 'USDC',
      loadedOnce: true,
    },
  ]

  const mockDataVar = [
    {
      label: 'Variable borrow rate',
      value: 7.12,
      currency: '%',
      loadedOnce: true,
    },
    {
      label: 'Borrowed by me',
      value: 0,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      label: 'Max I can borrow',
      value: 9999999,
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
          <h1>Borrow Crypto</h1>
          <RateTabs />
          <div className="mt-5 is-full-width">{reserveRows}</div>
        </Container>
        <Container type="light" id="portfolio" xtra="column is-3">
          <Portfolio />
        </Container>
      </div>
      <Modal open={modalOpen} onClose={() => dispatch(appActions.closeModal())}>
        {isFixed ? <BorrowFixed /> : <BorrowVar />}
      </Modal>
    </>
  )
}

export default Borrow
