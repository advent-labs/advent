export interface ReserveProps {
  icon: string
  uTokenName: string
  dataPoints: (string | number)[]
  action: any
}

function Reserve({ uTokenName, icon, dataPoints, action }: ReserveProps) {
  let dataDisplay = dataPoints?.map((e, i) => {
    return (
      <div
        key={i}
        className="reserve-data is-flex is-align-items-center column is-3"
      >
        <p className="text__large-m is-black">{e}</p>
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
