import { selectAppUIValues, actions as appActions } from '../../store/ui/appui'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  actions as uiActions,
  selectBorrowUIValues,
} from '../../store/ui/borrowui'
import { Context } from '../../App'
import { useContext } from 'react'
import Container from '../../blocks/Container'
import RateTabs from '../../common/RateTabs'
import Reserve from '../../common/Reserve'
import { Modal } from '../../common/Modal'
import BorrowFixed from './BorrowFixed'
import BorrowVar from './BorrowVar'
import rate from '../../assets/rate.svg'
import Portfolio from '../../common/Portfolio'

function Borrow() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)

  const mockDataFixed = [
    {
      value: 6.56,
      currency: '%',
      loadedOnce: true,
      icon: rate,
    },
    {
      value: 45000.32,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
      value: 10000000,
      currency: 'USDC',
      loadedOnce: true,
    },
  ]

  const mockDataVar = [
    {
      value: 7.12,
      currency: '%',
      loadedOnce: true,
      icon: rate,
    },
    {
      value: 0,
      currency: 'USDC',
      loadedOnce: true,
    },
    {
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

  const rowLabels = (
    <div className="columns is-mobile text-left">
      <p className="column is-3 text__medium-m is-grey-1">Asset</p>
      <p className="column is-3 text__medium-m is-grey-1">
        {isFixed ? 'Fixed' : 'Variable'} borrow rate
      </p>
      <p className="column is-3 text__medium-m is-grey-1">Borrow balance</p>
      <p className="column is-3 text__medium-m is-grey-1">Wallet balance</p>
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
      <div className="is-flex">
        <div className="buffer" />
        <div className="buffer white" />
      </div>
      <div className="columns">
        <div className="width__70">
          <div className="center-column title-block">
            <h1 className="text__xl6-semi is-white">Borrow crypto</h1>
            <p className="text__large-semi is-alpha-60 width__65 mt-4">
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam
              vel, ullamcorper sit amet.
            </p>
          </div>
          <Container
            type="background"
            xtra="center-column width__80 center has-shadow"
          >
            <RateTabs />
            <div className="is-full-width pl-2 pr-2 pt-2">{rowLabels}</div>
            <div className="mt-5 is-full-width pl-2 pr-2">{reserveRows}</div>
          </Container>
        </div>
        <Container type="background" id="portfolio" xtra="width__30">
          <Portfolio />
        </Container>
        <Modal
          open={modalOpen}
          onClose={() => dispatch(appActions.closeModal())}
        >
          {isFixed ? <BorrowFixed /> : <BorrowVar />}
        </Modal>
      </div>
    </>
  )
}

export default Borrow
