import { selectAppUIValues, actions } from '../redux/ui/appui'
import { useAppSelector } from '../redux'
import Tabs from '../common/Tabs'
import UserAsset from './UserAsset'
import usdcIcon from '../assets/usdc.svg'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SmallData from './SmallData'
import PortMetric from './PortMetric'
import fixed from '../assets/fixed.svg'
import variable from '../assets/variable.svg'

function Portfolio() {
  const tabOptions = ['Overview', 'Lend', 'Borrow']
  const { portfolioTab } = useAppSelector(selectAppUIValues)

  const userLendData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      assetDataPoints: [
        {
          label: 'Fixed lending rate',
          value: 0,
          currency: '%',
          frontIcon: fixed,
        },
        {
          label: 'Supply balance',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Interest at maturity',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Term left',
          value: 0,
          currency: 'days',
          tooltip: 'Term left tooltip',
        },
        {
          label: 'Collateral',
          value: 0,
          currency: '%',
          switchData: { status: true, callback: () => null },
        },
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      assetDataPoints: [
        {
          label: 'Variable lending rate',
          value: 0,
          currency: '%',
          frontIcon: variable,
        },
        {
          label: 'Supply balance',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'APY earned',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Collateral',
          value: 0,
          currency: '%',
          switchData: { status: false, callback: () => null },
        },
      ],
    },
  ]

  const userBorrowData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      assetDataPoints: [
        {
          label: 'Fixed borrowing rate',
          value: 0,
          currency: '%',
          frontIcon: fixed,
        },
        {
          label: 'Supply balance',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Interest at maturity',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Term left',
          value: 0,
          currency: 'days',
          tooltip: 'Term left tooltip',
        },
        {
          label: 'Collateral',
          value: 0,
          currency: '%',
          switchData: { status: true, callback: () => null },
        },
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      assetDataPoints: [
        {
          label: 'Variable borrowing rate',
          value: 0,
          currency: '%',
          frontIcon: variable,
        },
        {
          label: 'Supply balance',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'APY earned',
          value: 0,
          currency: 'Token',
        },
        {
          label: 'Collateral',
          value: 0,
          currency: '%',
          switchData: { status: false, callback: () => null },
        },
      ],
    },
  ]

  const ovData = [
    {
      label: 'Total borrow',
      value: 0,
    },
    {
      label: 'Total lend',
      value: 0,
    },
    {
      label: 'Net APY borrow',
      value: 0,
    },
    {
      label: 'Net APY lend',
      value: 0,
    },
  ]

  const portMetrics = [
    {
      label: 'Borrow limit',
      value: 80,
      square: 'red',
      mt: 'mt-6',
    },
    {
      label: 'Liquidation threshold',
      value: 85,
      square: 'black',
      mt: 'mt-3',
    },
    {
      label: 'Borrow limit',
      value: 85,
      mt: 'mt-3',
    },
  ]

  const displayPortMetrics = portMetrics.map((e, i) => {
    return <PortMetric {...e} />
  })

  const displayInnerPortfolio = () => {
    if (portfolioTab === 'Overview') {
      return (
        <>
          <div className="spread mt-6">
            <SmallData {...ovData[0]} />
            <SmallData {...ovData[1]} right />
          </div>
          <div className="spread mt-4">
            <SmallData {...ovData[2]} />
            <SmallData {...ovData[3]} right />
          </div>
          <hr className="is-grey mt-3 mb-3" />
          <p className="text__medium-m is-grey-1">Borrow limit used</p>
          <p>SLIDER</p>
          {displayPortMetrics}
        </>
      )
    } else if (portfolioTab === 'Lend') {
      return userLendData.map((e, i) => {
        return <UserAsset {...e} />
      })
    } else if (portfolioTab === 'Borrow') {
      return userBorrowData.map((e, i) => {
        return <UserAsset {...e} />
      })
    }
  }

  return (
    <div className="portfolio">
      <div className="connect-wrapper">
        <WalletMultiButton startIcon={undefined} />
      </div>
      <h1 className="text__xl3-semi">My Portfolio</h1>
      <Tabs
        type="underline"
        options={tabOptions}
        current={portfolioTab}
        handler={actions.setPortfolioTab}
        xtra={'port-tabs'}
      />
      {displayInnerPortfolio()}
    </div>
  )
}

export default Portfolio
