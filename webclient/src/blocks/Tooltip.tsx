import tooltip from '../assets/tooltip.svg'

function Tooltip({
  text,
  narrow,
  left,
}: {
  text: string
  narrow?: boolean
  left?: boolean
}) {
  return (
    <span className="tooltip">
      <span
        className={`tooltip-text ${left ? 'open-left' : ''} ${
          narrow ? 'open-narrow' : ''
        }`}
      >
        {text}
      </span>
      <img src={tooltip} alt="tooltip" className="ml-2" />
    </span>
  )
}

export default Tooltip
