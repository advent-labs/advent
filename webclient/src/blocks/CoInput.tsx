import { RefObject, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../redux'
import Button from '../blocks/Button'
import Tabs from '../common/Tabs'
import { selectAppUIValues, actions } from '../redux/ui/appui'

export interface CoInputProps {
  value: string
  handleInput: any
  setMax?: any
  disabled?: boolean
}

function CoInput({ value, handleInput, disabled }: CoInputProps) {
  const dispatch = useAppDispatch()
  const inputElement = useRef(null) as RefObject<HTMLInputElement>

  return (
    <div className="co-input-container">
      <div className="field mb-0">
        <div className="control has-icons-right is-flex is-align-items-center">
          <input
            className={`input has-text-left`}
            disabled={disabled}
            onChange={(e) => dispatch(handleInput(e.target.value))}
            value={value === 'NaN' ? '0' : value}
            type=""
            placeholder="0"
            autoComplete="off"
            ref={inputElement}
          />
          <span className="text__xl-m is-grey-1 icon is-right">%</span>
        </div>
      </div>
    </div>
  )
}

export default CoInput
