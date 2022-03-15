import Switch from '../blocks/Switch'

export interface ReserveData {
  value: number
  currency: string
  loadedOnce: boolean
  icon?: string
  id: string
}

export interface UserReserveProps {
  icon: string
  uTokenName: string
  data?: ReserveData[]
  action: any
}

function UserReserve({ uTokenName, icon, data, action }: UserReserveProps) {
  let dataDisplay = data?.map((e, i) => {
    const columnWidth = e.id === 'rate' || e.id === 'term' ? 'is-2' : 'is-3'
    return (
      <div
        className={`reserve-data is-flex is-align-items-center column ${columnWidth}`}
        key={i}
      >
        {!!e.icon && <img src={e.icon} className="mr-1" alt={uTokenName} />}
        <p className="text__large-m is-black">{e.value}</p>
        <p className="text__large-m is-black ml-1">{e.currency}</p>
        {e.id === 'collateral' && <Switch useColl={true} toggle={() => null} />}
      </div>
    )
  })

  return (
    <div className="user-bar columns mb-0" onClick={action}>
      <div className="token column is-3">
        <img src={icon} alt={uTokenName} />
        <p className="ml-4 text__large-m is-black">{uTokenName}</p>
      </div>
      {dataDisplay}
    </div>
  )
}

export default UserReserve
