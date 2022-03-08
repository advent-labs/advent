import { formatDollars } from '../util'

export interface SmallDataProps {
  label: string
  value: number
  right?: boolean
}

function SmallData({ label, value, right }: SmallDataProps) {
  return (
    <div className={`small-data ${right ? 'is-right' : ''}`}>
      <p className="text__medium-m is-grey-1">{label}</p>
      <p className="text__large-m is-black">{formatDollars(value)}</p>
    </div>
  )
}

export default SmallData
