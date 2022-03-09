import Container from '../blocks/Container'
import DataPoint, { Data } from './DataPoint'

export interface BalanceBoxProps {
  leftData: Data
  rightData: Data
  label: string
  value: number
  slider?: boolean
  sliderPercentage?: number
}

function BalanceBox({ leftData, rightData, label, value }: BalanceBoxProps) {
  return (
    <Container type={'background'}>
      <div className="spread">
        <DataPoint data={leftData} />
        <DataPoint data={rightData} />
      </div>
      <hr className="is-grey" />
      <div className="spread">
        <p>{label}</p>
        <p>{value}</p>
      </div>
    </Container>
  )
}

export default BalanceBox
