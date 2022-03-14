import ReactSlider from 'react-slider'
import { useAppDispatch, useAppSelector } from '../store'

export interface TimeSliderProps {
  value: string
  handleInput: any
  isMonths: boolean
}

function TimeSlider({ value, handleInput, isMonths }: TimeSliderProps) {
  const dispatch = useAppDispatch()

  const max = isMonths ? 12 : 365
  let counter = 0
  let markCount = []
  do {
    if (isMonths) {
      markCount.push(counter)
      counter++
    } else {
      markCount.push(counter)
      counter += 50
    }
  } while (counter <= max)

  const marks = markCount.map((e, i) => {
    return (
      <span key={i} className="text__medium-semi is-black-30 mb-4">
        {e}
      </span>
    )
  })

  return (
    <>
      <ReactSlider
        className="horizontal-slider"
        onChange={(num) => dispatch(handleInput(num.toString()))}
        trackClassName="example-track"
        value={parseInt(value) || 0}
        min={0}
        max={max}
        marks
        thumbClassName="slider-thumb"
      />
      <div className="marks">{marks}</div>
    </>
  )
}

export default TimeSlider
