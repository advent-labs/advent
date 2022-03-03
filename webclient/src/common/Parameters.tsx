import { useState } from 'react'
import Container from '../blocks/Container'
import Button from '../blocks/Button'

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
      <div className="spread">
        <p>{e.label}</p>
        <p>{e.value}</p>
      </div>
    )
  })

  const displayFull = secondChunk.map((e, i) => {
    return (
      <div className="spread">
        <p>{e.label}</p>
        <p>{e.value}</p>
      </div>
    )
  })
  return (
    <Container type="dark" xtra={`params ${open ? 'is-open' : ''}`}>
      <div>SLIDER</div>
      {displayParams}
      {open && displayFull}
      <Button
        type="dropdown"
        text="More parameters v"
        handler={() => setOpen(!open)}
        xtra="is-full-width"
      />
    </Container>
  )
}

export default Parameters
