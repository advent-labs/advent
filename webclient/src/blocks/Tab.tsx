import { useAppDispatch } from '../redux'

export interface TabProps {
  isActive: boolean
  text: string
  handler: any
}

function Tab({ isActive, text, handler }: TabProps) {
  const dispatch = useAppDispatch()

  return (
    <div
      className={`tab ${isActive ? 'is-active' : ''}`}
      onClick={() => dispatch(handler(text))}
    >
      {text}
    </div>
  )
}

export default Tab
