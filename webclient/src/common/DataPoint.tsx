import { addCommas } from "../util"

import NetChange from "./NetChange"
import details from "../assets/details.svg"
import Tooltip from "../blocks/Tooltip"
import { formatDollars } from "toolbox"

export type Data = {
  label: string
  value: number | string
  loadedOnce?: boolean
  dollar?: boolean
  currency?: string
  change?: number
  secondary?: number
  link?: string
  tooltip?: string
  center?: boolean
  primary?: boolean
  count?: boolean
  id?: string
  extraClasses?: string
  right?: boolean
}

export type DataProps = {
  data: Data
}

function DataPoint({ data }: DataProps) {
  const {
    label,
    value,
    dollar,
    currency,
    change,
    secondary,
    link,
    center,
    primary,
    tooltip,
    loadedOnce,
    extraClasses,
    right,
  } = data

  const displayValueRow = () => {
    if (loadedOnce) {
      return (
        <>
          {!!dollar && (
            <p className={`data-point__value ${primary ? "primary" : ""}`}>$</p>
          )}
          <p className={`data-point__value mr-2 ${primary ? "primary" : ""}`}>
            {addCommas(value)}
          </p>
          {!!currency && value !== "--" && (
            <p className={`data-point__value mr-2 ${primary ? "primary" : ""}`}>
              {currency}
            </p>
          )}
          {!!change && <NetChange change={change} />}
          {!!secondary && (
            <p className="data-point__value muted mr-2">
              {formatDollars(secondary)}
            </p>
          )}
          {!!link && <img src={details} alt="more" />}
        </>
      )
    } else {
      return <div className="skel" />
    }
  }

  return (
    <div className={`data-point ${center ? "is-center" : ""} ${extraClasses}`}>
      <div className="is-flex is-align-items-center mb-2">
        <span className="is-flex is-align-items-center">
          <p className="data-point__label">{label}</p>
          {!!tooltip && <Tooltip text={`${tooltip}`} />}
        </span>
      </div>
      <div className={`is-flex is-align-items-center ${right && "is-right"}`}>
        {displayValueRow()}
      </div>
    </div>
  )
}

export default DataPoint
