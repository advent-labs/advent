import { ReactNode } from 'react'
import Container from '../blocks/Container'
import DataPoint, { Data } from './DataPoint'

export interface BalanceBoxProps {
  leftData: Data
  rightData: Data
  children: ReactNode
  slider?: boolean
  sliderPercentage?: number
}

function BalanceBox({ leftData, rightData, children }: BalanceBoxProps) {
  return (
    <Container type={'background'} xtra="balance-box">
      <div className="spread">
        <DataPoint data={leftData} />
        <DataPoint data={rightData} />
      </div>
      <hr className="is-grey mt-3 mb-5" />
      {children}
    </Container>
  )
}

export default BalanceBox
