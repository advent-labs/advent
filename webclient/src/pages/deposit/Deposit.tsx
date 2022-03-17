import { selectAppUIValues, actions as appActions } from "../../store/ui/appui"
import { useAppDispatch, useAppSelector } from "../../store"
import { actions as uiActions } from "../../store/ui/depositui"
import { Context } from "../../App"
import { useContext } from "react"
import Container from "../../blocks/Container"
import RateTabs from "../../common/RateTabs"
import Reserve, { ReserveProps } from "../../common/Reserve"
import { Modal } from "../../common/Modal"
import DepositFixed from "./DepositFixed"
import DepositVar from "./DepositVar"
import rate from "../../assets/rate.svg"
import Portfolio from "../../common/Portfolio"
import { useWallet } from "@solana/wallet-adapter-react"
import { ReserveData } from "common/UserReserve"
import { niceNum } from "toolbox/nicenum"

function Deposit() {
  const { addresses } = useContext(Context)
  const dispatch = useAppDispatch()
  const { isFixed, modalOpen } = useAppSelector(selectAppUIValues)
  const reserves = useAppSelector((s) => s.reserves.state)
  const { balances } = useAppSelector((state) => state.userTokenAccounts)

  const mockDataFixed = [
    [7.34, 2192740.01],
    [8.46, 10283205.93],
    [3.85, 857495.76],
    [4.45, 8713.34],
  ]
  const mockDataVar = [
    [7.34, 2192740.01],
    [8.46, 10283205.93],
    [3.85, 857495.76],
    [4.45, 8713.34],
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
        {isFixed ? "Fixed" : "Variable"} lending rate
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
            <h1 className="text__xl6-semi is-white is-gilroy">
              Lend crypto and get yield
            </h1>
            <p className="text__large-semi is-alpha-60 width__65 mt-4">
              Build a stable portfolio with fixed rate income on your assets.
              Lock in your yield for up to one year or exit early without
              penalty at the market rate.
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
          {isFixed ? <DepositFixed /> : <DepositVar />}
        </Modal>
      </div>
    </>
  )
}

export default Deposit
