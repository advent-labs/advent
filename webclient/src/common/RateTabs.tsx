import { useAppDispatch, useAppSelector } from '../redux'
import { actions, selectAppUIValues } from '../redux/ui/appui'

function RateTabs() {
  const { isFixed } = useAppSelector(selectAppUIValues)
  const dispatch = useAppDispatch()

  return (
    <div className="tabs is-filled p-1 mt-1">
      <div
        className={`${isFixed ? 'is-active' : ''} tab`}
        onClick={() => dispatch(actions.setIsFixed())}
      >
        Fixed rates
      </div>
      <div
        className={`${isFixed ? '' : 'is-active'} tab`}
        onClick={() => dispatch(actions.setIsVariable())}
      >
        Variable rates
      </div>
    </div>
  )
}

export default RateTabs
