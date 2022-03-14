import { useState } from 'react'
import Container from '../blocks/Container'
import Button from '../blocks/Button'
import chevron from '../assets/chevron.svg'
import LimitSlider from '../common/LimitSlider'

export interface Parameter {
  label: string
  value: string
}

export interface ParameterProps {
  params: Parameter[]
}

function Parameters({ params }: ParameterProps) {
  const [open, setOpen] = useState(false)
  const firstChunk = params.slice(0, 3)
  const secondChunk = params.slice(3)

  const displayParams = firstChunk.map((e, i) => {
    return (
      <div key={i} className="spread mb-2">
        <p className="text__medium-m is-grey-1">{e.label}</p>
        <p className="text__medium-m is-black">{e.value}</p>
      </div>
    )
  })

  const displayFull = secondChunk.map((e, i) => {
    return (
      <div key={i} className="spread mb-2">
        <p className="text__medium-m is-grey-1">{e.label}</p>
        <p className="text__medium-m is-black">{e.value}</p>
      </div>
    )
  })

  return (
    <Container type="background" xtra={`params ${open ? 'is-open' : ''}`}>
      <LimitSlider borrowUsed={38} borrowLimit={80} liqThreshold={85} />
      {displayParams}
      {open && displayFull}
      <Button
        type="dropdown"
        text="More parameters"
        handler={() => setOpen(!open)}
        xtra="is-full-width"
        icon={chevron}
      />
    </Container>
  )
}

export default Parameters
