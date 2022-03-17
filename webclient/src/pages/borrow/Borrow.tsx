import { selectAppUIValues, actions as appActions } from "../../store/ui/appui"
import { useAppDispatch, useAppSelector } from "../../store"
import {
  actions as uiActions,
  selectBorrowUIValues,
} from "../../store/ui/borrowui"
import { Context } from "../../App"
import { useContext } from "react"
import Container from "../../blocks/Container"
import RateTabs from "../../common/RateTabs"
import Reserve from "../../common/Reserve"
import { Modal } from "../../common/Modal"
import BorrowFixed from "./BorrowFixed"
import BorrowVar from "./BorrowVar"
import rate from "../../assets/rate.svg"
import Portfolio from "../../common/Portfolio"
import { niceNum } from "toolbox"

function Borrow() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)
  const { balances } = useAppSelector((state) => state.userTokenAccounts)

  const mockDataFixed = [
    [8.64, 2192740.01],
    [9.26, 10283205.93],
    [6.15, 8595.76],
    [7.48, 820713.34],
  ]
  const mockDataVar = [
    [7.34, 2192740.01],
    [8.46, 10283205.93],
    [3.85, 8595.76],
    [4.45, 820713.34],
  ]

  const toReserveData =
    (fixedOrVar: "fixed" | "var") => (token: string, index: number) => {
      const mintMeta = addresses?.mintMetaMap[token]
      const { name, icon } = mintMeta
      const balance = balances[token] / 10 ** 6 || 0
      const dataPointSet = fixedOrVar === "fixed" ? mockDataFixed : mockDataVar
      const [rate, supply] = dataPointSet[index]

      return {
        icon: icon,
        token,
        uTokenName: name,
        dataPoints: [
          `${rate}%`,
          `${niceNum(supply)} ${name}`,
          `${niceNum(balance)} ${name}`,
        ],
      }
    }
  const fixedData = reserves.map((r) => r.token).map(toReserveData("fixed"))

  const varData = reserves.map((r) => r.token).map(toReserveData("var"))

  const onReserveClick = (v: string) => {
    dispatch(uiActions.setToken(v))
    dispatch(appActions.setModalOpen())
  }

  const rowLabels = (
    <div className="columns is-mobile text-left">
      <p className="column is-3 text__medium-m is-grey-1">Asset</p>
      <p className="column is-3 text__medium-m is-grey-1">
        {isFixed ? "Fixed" : "Variable"} borrow rate
      </p>
      <p className="column is-3 text__medium-m is-grey-1">Supply balance</p>
      <p className="column is-3 text__medium-m is-grey-1">Wallet balance</p>
    </div>
  )

  const reserveRows = isFixed
    ? fixedData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.token)} />
      })
    : varData.map((e, i) => {
        return <Reserve {...e} key={i} action={() => onReserveClick(e.token)} />
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
            <h1 className="text__xl6-semi is-white is-gilroy">Borrow assets</h1>
            <p className="text__large-semi is-alpha-60 width__65 mt-4">
              Borrow with certainty. Choose between locking in interest rates
              for a custom-term loan, or a flexible variable-rate loan you can
              exit at any time.
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
