export interface PortMetricProps {
  label: string
  value: number
  square?: string
  mt?: string
}

function PortMetric({ label, value, square, mt }: PortMetricProps) {
  return (
    <div className={`port-metric spread ${mt ? mt : ''}`}>
      <div className="is-flex is-align-items-center">
        {!!square && <div className={`square ${square} mr-2`} />}
        <p className="text__medium-m is-grey-1">{label}</p>
      </div>
      <p className="text__medium-m is-black">{value}%</p>
    </div>
  )
}

export default PortMetric
