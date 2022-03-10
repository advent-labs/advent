import Tooltip from '../blocks/Tooltip'
import Switch from '../blocks/Switch'

export interface AssetDataPointProps {
  label: string
  value: number
  currency: string
  frontIcon?: string
  tooltip?: string
  switchData?: { status: boolean; callback: () => void }
}

function AssetDataPoint({
  label,
  value,
  currency,
  frontIcon,
  tooltip,
  switchData,
}: AssetDataPointProps) {
  return (
    <div className="spread mt-3">
      <p className="text__medium-m is-grey-1">{label}</p>
      <div className="is-flex is-align-items-center">
        {!!frontIcon && <img src={frontIcon} alt="icon" className="mr-2" />}
        <p className="text__medium-m is-black">{value}</p>
        <p className="text__medium-m is-black ml-1">{currency}</p>
        {!!tooltip && <Tooltip text={tooltip} left />}
        {/* {!!switchData && <Switch />} */}
      </div>
    </div>
  )
}

export default AssetDataPoint
