import { useAppSelector } from '../redux'
import { selectAppUIValues } from '../redux/ui/appui'
import { useLocation } from 'react-router-dom'
import { ReactNode, useContext } from 'react'
import { Context } from '../App'
import { Reserve } from '../redux/reducer/reserves'

export interface PreviewProps {
  reserve: Reserve
  apr: number
  children?: ReactNode
}

function Preview({ reserve, apr, children }: PreviewProps) {
  const { addresses } = useContext(Context)
  const { isFixed } = useAppSelector(selectAppUIValues)
  const location = useLocation()
  const path = location.pathname
  const isLend = path.includes('lend')

  const mintMeta = addresses?.mintMetaMap[reserve.token]
  const { name, icon } = mintMeta
  return (
    <div className="preview">
      <img src={icon} alt={name} />
      <h1>{isLend ? 'Lend' : 'Borrow'}</h1>
      <h1>{name}</h1>
      <p>APR {isFixed ? 'Fixed' : 'Variable'}</p>
      <p>{isNaN(apr) ? 0 : apr}</p>
      {children}
    </div>
  )
}

export default Preview
