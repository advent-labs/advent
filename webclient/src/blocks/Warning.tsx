import Container from './Container'
import warn from '../assets/warn.svg'

function Warning({ message, xtra }: { message: string; xtra?: string }) {
  return (
    <div className={`warning is-flex is-align-items-center ${xtra && xtra}`}>
      <img src={warn} alt="warning" />
      <p className="text__small is-white ml-2">{message}</p>
    </div>
  )
}

export default Warning
