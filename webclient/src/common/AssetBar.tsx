import DataPoint, { Data } from './DataPoint'

export interface AssetBarProps {
  icon: string
  uTokenName: string
  data?: Data[]
  slim?: boolean
  slimData?: number[]
}

function AssetBar({ uTokenName, icon, data, slim, slimData }: AssetBarProps) {
  let dataDisplay
  if (slim && slimData) {
    dataDisplay = slimData.map((e, i) => {
      return <p key={i}>{e}</p>
    })
  }

  if (!slim && data) {
    dataDisplay = data.map((e, i) => {
      return <DataPoint data={e} key={i} />
    })
  }

  return slim ? (
    <div className="bar is-slim mb-4">
      <div className="token ml-4">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4">{uTokenName}</p>
      </div>
      <div className="data-horizontal">{dataDisplay}</div>
    </div>
  ) : (
    <div className="bar mb-4">
      <div className="token ml-4">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4">{uTokenName}</p>
      </div>
      <div className="data-horizontal">{dataDisplay}</div>
    </div>
  )
}

export default AssetBar
