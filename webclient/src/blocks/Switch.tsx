import { useAppDispatch, useAppSelector } from "../store"

export interface SwitchProps {
  useColl: boolean
  toggle: any
  xtra?: string
}

function Switch({ useColl, toggle, xtra }: SwitchProps) {
  const dispatch = useAppDispatch()
  const text = useColl ? (
    <p className="text__small-bold is-white p-1 mr-4">Yes</p>
  ) : (
    <p className="text__small-bold is-white p-1 ml-4">No</p>
  )

  return (
    <label className={`switch ${xtra && xtra}`}>
      <input
        type="checkbox"
        checked={useColl}
        onChange={() => dispatch(toggle())}
      />
      <span className="slider round">{text}</span>
    </label>
  )
}
export default Switch
