import { RefObject, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import Button from '../blocks/Button'
import Tabs from '../common/Tabs'
import { selectAppUIValues, actions } from '../store/ui/appui'

export interface TimeInputProps {
  value: string
  handleInput: any
  setMax?: any
  disabled?: boolean
}

function TimeInput({ value, handleInput, disabled }: TimeInputProps) {
  const dispatch = useAppDispatch()
  const inputElement = useRef(null) as RefObject<HTMLInputElement>
  const tabOptions = ['Months', 'Days']
  const { timeTab } = useAppSelector(selectAppUIValues)

  return (
    <div className="time-input-container">
      <div className="field mb-0">
        <div className="control has-icons-left is-flex is-align-items-center">
          <Tabs
            options={tabOptions}
            current={timeTab}
            type="filled-dark"
            handler={actions.setTimeTab}
            xtra="time-tabs"
          />
          <input
            className={`input has-text-right`}
            disabled={disabled}
            onChange={(e) => dispatch(handleInput(e.target.value))}
            value={value === 'NaN' ? '0' : value}
            type=""
            placeholder="0"
            autoComplete="off"
            ref={inputElement}
          />
        </div>
      </div>
    </div>
  )
}

export default TimeInput
