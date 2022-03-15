import ReactSlider from 'react-slider'

export interface LimitSliderProps {
  borrowUsed: number
  borrowLimit: number
  liqThreshold: number
}

function LimitSlider({
  borrowUsed,
  borrowLimit,
  liqThreshold,
}: LimitSliderProps) {
  return (
    <>
      <ReactSlider
        className="horizontal-slider limit"
        thumbClassName="limit-thumb"
        trackClassName="limit-track"
        defaultValue={[borrowUsed, borrowLimit, liqThreshold]}
        ariaLabel={['Leftmost thumb', 'Middle thumb', 'Rightmost thumb']}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        pearling
        minDistance={10}
        disabled
      />
    </>
  )
}

export default LimitSlider
