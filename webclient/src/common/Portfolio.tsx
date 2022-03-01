import { selectAppUIValues, actions } from '../redux/ui/appui'
import { useAppSelector } from '../redux'
import Tabs from '../common/Tabs'
import UserAsset from './UserAsset'
import usdcIcon from '../assets/usdc.svg'

function Portfolio() {
  const tabOptions = ['Overview', 'Supplied', 'Borrowed']
  const { portfolioTab } = useAppSelector(selectAppUIValues)
  const isBorrowed = portfolioTab === 'Borrowed'

  const userSuppliedData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      rate: 5.34,
      amount: 100,
      isFixed: true,
      isBorrowed,
      interest: 0.000034,
      collateral: 80,
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      rate: 2.34,
      amount: 200,
      isFixed: false,
      isBorrowed,
      apy: 2.18,
      collateral: 0,
    },
  ]

  const userBorrowedData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      rate: 10.34,
      amount: 1000,
      isFixed: true,
      isBorrowed,
      interest: 0.00054,
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      rate: 4.34,
      amount: 300,
      isFixed: false,
      isBorrowed,
      apy: 3.12,
    },
  ]

  const displayInnerPortfolio = () => {
    if (portfolioTab === 'Overview') {
      return (
        <>
          <div className="spread">
            <p>Your net value</p>
            <p>$60,000</p>
          </div>
          <hr className="is-primary" />
          <div className="spread">
            <div>
              <p>Total borrow</p>
              <p>$40,000</p>
            </div>
            <div>
              <p>Total lend</p>
              <p>$100,000</p>
            </div>
          </div>
          <h1>!!!!!SEXY SLIDER!!!!!!</h1>
          <div className="spread">
            <div className="is-flex is-align-items-center">
              <div className="square primary mr-2" />
              <p>Borrow limit</p>
            </div>
            <p>80%</p>
          </div>
          <div className="spread">
            <div className="is-flex is-align-items-center">
              <div className="square secondary mr-2" />
              <p>Borrow limit used</p>
            </div>
            <p>40%</p>
          </div>
          <div className="spread">
            <div className="is-flex is-align-items-center">
              <div className="square accent mr-2" />
              <p>Liquidation threshold</p>
            </div>
            <p>85%</p>
          </div>
        </>
      )
    } else if (portfolioTab === 'Supplied') {
      return userSuppliedData.map((e, i) => {
        return <UserAsset {...e} />
      })
    } else if (portfolioTab === 'Borrowed') {
      return userBorrowedData.map((e, i) => {
        return <UserAsset {...e} />
      })
    }
  }

  return (
    <div className="portfolio">
      <h1>My Portfolio</h1>
      <Tabs
        type="underline"
        options={tabOptions}
        current={portfolioTab}
        handler={actions.setPortfolioTab}
      />
      {displayInnerPortfolio()}
    </div>
  )
}

export default Portfolio
