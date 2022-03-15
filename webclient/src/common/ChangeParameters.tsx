import { useState } from 'react'
import Container from '../blocks/Container'
import Button from '../blocks/Button'
import chevron from '../assets/chevron.svg'
import arrow from '../assets/arrow.svg'
import LimitSlider from '../common/LimitSlider'

export interface ChangeParameter {
  label: string
  value: number
  nextValue?: number
  square?: string
}

export interface ChangeParameterProps {
  params: ChangeParameter[]
}

function ChangeParameters({ params }: ChangeParameterProps) {
  const displayParams = params.map((e, i) => {
    return (
      <div className="spread mb-2" key={i}>
        <div className="is-flex is-align-items-center">
          {!!e.square && <div className={`square ${e.square} mr-2`} />}
          <p className="text__medium-m is-grey-1">{e.label}</p>
        </div>
        <div className="is-flex is-align-items-center">
          <p className="text__medium-m is-black mb-0">{e.value}%</p>
          {!!e.nextValue && (
            <>
              <img src={arrow} alt="arrow" />
              <p className="text__medium-m is-black">{e.nextValue}%</p>
            </>
          )}
        </div>
      </div>
    )
  })

  const borrowLimit = [{ label: 'Borrow limit used', value: 38, nextValue: 25 }]

  const displayBorrow = borrowLimit.map((e, i) => {
    return (
      <div className="spread" key={i}>
        <div className="is-flex is-align-items-center">
          <p className="text__medium-m is-grey-1">{e.label}</p>
        </div>
        <div className="is-flex is-align-items-center">
          <p className="text__medium-m is-black mb-0">{e.value}%</p>
          {!!e.nextValue && (
            <>
              <img src={arrow} alt="arrow" />
              <p className="text__medium-m is-black">{e.nextValue}%</p>
            </>
          )}
        </div>
      </div>
    )
  })

  return (
    <Container type="background" xtra={`change-params is-full-width mt-4`}>
      {displayBorrow}
      <LimitSlider borrowUsed={38} borrowLimit={80} liqThreshold={85} />
      {displayParams}
    </Container>
  )
}

export default ChangeParameters
