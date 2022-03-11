export interface ReserveData {
  value: number
  currency: string
  loadedOnce: boolean
  icon?: string
}

export interface ReserveProps {
  icon: string
  uTokenName: string
  data?: ReserveData[]
  action: any
}

function Reserve({ uTokenName, icon, data, action }: ReserveProps) {
  let dataDisplay = data?.map((e, i) => {
    return (
      <div
        key={i}
        className="reserve-data is-flex is-align-items-center column is-3"
      >
        {!!e.icon && <img src={e.icon} alt="rate" />}
        <p className="text__large-m is-black">{e.value}</p>
        <p className="text__large-m is-black ml-1">{e.currency}</p>
      </div>
    )
  })

  return (
    <div className="bar columns mb-0" onClick={action}>
      <div className="token column is-3">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4 text__large-m is-black">{uTokenName}</p>
      </div>
      {dataDisplay}
    </div>
  )
}

export default Reserve
