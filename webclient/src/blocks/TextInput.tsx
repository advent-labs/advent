import { RefObject, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import Button from '../blocks/Button'

export interface TextInputProps {
  value: string
  handleInput: any
  setMax?: any
  disabled?: boolean
  large?: boolean
}

function TextInput({ value, handleInput, disabled, large }: TextInputProps) {
  const dispatch = useAppDispatch()
  const inputElement = useRef(null) as RefObject<HTMLInputElement>

  return (
    <div className="input-container">
      <div className="field mt-2 mb-0">
        <div className="control is-flex is-align-items-center">
          <input
            className={`input ${large ? 'has-text-center is-large-text' : ''}`}
            disabled={disabled}
            onChange={(e) => dispatch(handleInput(e.target.value))}
            value={value === 'NaN' ? '0' : value}
            type=""
            placeholder="0"
            autoComplete="off"
            ref={inputElement}
          />
          <Button
            type="transparent"
            text="MAX"
            handler={() => null}
            xtra="ml-2"
          />
        </div>
      </div>
    </div>
  )
}

export default TextInput
