import { RefObject, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../redux'
import Button from '../blocks/Button'

export interface TimeInputProps {
  value: string
  handleInput: any
  setMax?: any
  disabled?: boolean
}

function TimeInput({ value, handleInput, disabled }: TimeInputProps) {
  const dispatch = useAppDispatch()
  const inputElement = useRef(null) as RefObject<HTMLInputElement>
  return (
    <div className="time-input-container ml-4">
      <div className="field mb-0">
        <div className="control has-icons-left is-flex is-align-items-center">
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
