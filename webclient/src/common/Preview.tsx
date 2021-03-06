import { useAppSelector } from "../store"
import { selectAppUIValues } from "../store/ui/appui"
import { useLocation } from "react-router-dom"
import { ReactNode, useContext } from "react"
import { Context } from "../App"
import { Reserve } from "../store/reducer/reserves"

export interface PreviewProps {
  reserve: Reserve
  apr: number
  children?: ReactNode
}

function Preview({ reserve, apr, children }: PreviewProps) {
  const { addresses } = useContext(Context)
  const { isFixed } = useAppSelector(selectAppUIValues)
  const location = useLocation()
  const aprRounded = isNaN(apr) ? 0 : (apr * 100).toFixed(2)
  const path = location.pathname
  const isLend = path.includes("lend")

  const mintMeta = addresses?.mintMetaMap[reserve.token]
  const { name, icon } = mintMeta
  return (
    <div className="preview">
      <img src={icon} alt={name} className="token-size is-xl" />
      <h1 className="text__xl6 is-white">{isLend ? "Lend" : "Borrow"}</h1>
      <h1 className="text__xl6 is-white">{name}</h1>
      <p className="text__medium-m is-alpha-60 mt__2">
        APR {isFixed ? "Fixed" : "Variable"}
      </p>
      <p className="text__xl7-m is-white">{aprRounded}%</p>
      {children}
    </div>
  )
}

export default Preview
