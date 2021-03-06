import { useState } from "react"
import Container from "../blocks/Container"
import Button from "../blocks/Button"
import chevron from "../assets/chevron.svg"
import LimitSlider from "../common/LimitSlider"
import PortMetric from "../common/PortMetric"

export interface Parameter {
  label: string
  value: string
  square?: string
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
      <PortMetric label={e.label} value={e.value} square={e.square} key={i} />
    )
  })

  const displayFull = secondChunk.map((e, i) => {
    return (
      <PortMetric label={e.label} value={e.value} square={e.square} key={i} />
    )
  })

  return (
    <Container type="background" xtra={`params ${open ? "is-open" : ""}`}>
      <LimitSlider borrowUsed={78} borrowLimit={80} liqThreshold={85} />
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
