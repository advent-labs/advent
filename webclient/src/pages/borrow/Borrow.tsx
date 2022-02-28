import { selectAppUIValues } from '../../redux/ui/appui'
import { useAppSelector } from '../../redux'
import Container from '../../blocks/Container'
import RateTabs from '../../common/RateTabs'
import AssetBar from '../../common/AssetBar'
import usdcIcon from '../../assets/usdc.svg'
import Portfolio from '../../common/Portfolio'

function Borrow() {
  const { isFixed } = useAppSelector(selectAppUIValues)

  const fixedData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
  ]

  const variableData = [
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
    {
      icon: usdcIcon,
      uTokenName: 'USDC',
      data: [
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
      ],
    },
  ]

  const assetRows = isFixed
    ? fixedData.map((e, i) => {
        return <AssetBar {...e} key={i} />
      })
    : variableData.map((e, i) => {
        return <AssetBar {...e} key={i} />
      })

  return (
    <div className="columns">
      <div className="column is-9">
        <Container type="dark" id="deposit">
          <h1>Borrow Crypto</h1>
          <RateTabs />
          <div className="mt-5 is-full-width">{assetRows}</div>
        </Container>
      </div>
      <div className="column is-3">
        <Container type="light" id="portfolio">
          <Portfolio />
        </Container>
      </div>
    </div>
  )
}

export default Borrow
