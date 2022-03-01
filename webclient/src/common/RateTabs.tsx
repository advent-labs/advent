import { useAppDispatch, useAppSelector } from '../redux'
import { actions, selectAppUIValues } from '../redux/ui/appui'

function RateTabs() {
  const { isFixed } = useAppSelector(selectAppUIValues)
  const dispatch = useAppDispatch()

  return (
    <div className="mt-4">
      <div className="tabs is-filled">
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
    </div>
  )
}

export default RateTabs
