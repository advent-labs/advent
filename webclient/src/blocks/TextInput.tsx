import { RefObject, useRef } from 'react'

export interface TextInputProps {
  value: string
  handleInput: any
  setMax?: any
  disabled?: boolean
}

function TextInput({ value, handleInput, disabled }: TextInputProps) {
  const inputElement = useRef(null) as RefObject<HTMLInputElement>

  return (
    <div className="input-container mb-2">
      <div className="field mt-2 mb-0">
        <div className="control has-icons-left has-icons-right">
          <input
            className="input has-text-right"
            disabled={disabled}
            onChange={(e) => handleInput(e.target.value, true)}
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

export default TextInput
