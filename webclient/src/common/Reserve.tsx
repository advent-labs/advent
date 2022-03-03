import DataPoint, { Data } from './DataPoint'

export interface ReserveProps {
  icon: string
  uTokenName: string
  data?: Data[]
  slim?: boolean
  slimData?: number[]
  action: any
}

function Reserve({
  uTokenName,
  icon,
  data,
  slim,
  slimData,
  action,
}: ReserveProps) {
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
    <div className="bar is-slim mb-4" onClick={action}>
      <div className="token ml-4">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4">{uTokenName}</p>
      </div>
      <div className="data-horizontal">{dataDisplay}</div>
    </div>
  ) : (
    <div className="bar mb-4" onClick={action}>
      <div className="token ml-4">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4">{uTokenName}</p>
      </div>
      <div className="data-horizontal">{dataDisplay}</div>
    </div>
  )
}

export default Reserve
