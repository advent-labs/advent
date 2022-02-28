import ReactSlider from 'react-slider'

export interface SliderInputProps {
  min: number
  max: number
  value: number
  handler: () => void
}

function SliderInput({ min, max, value, handler }: SliderInputProps) {
  return (
    <ReactSlider
      className="horizontal-slider"
      marks
      markClassName="example-mark"
      min={min}
      max={max}
      thumbClassName="example-thumb"
      trackClassName="example-track"
      onChange={handler}
      renderThumb={(props, state) => <div {...props}>{value}</div>}
    />
  )
}

export default SliderInput
