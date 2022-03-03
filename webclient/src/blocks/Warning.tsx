import Container from './Container'
import warn from '../assets/warn.svg'

function Warning({ message }: { message: string }) {
  return (
    <div className="warning is-flex is-align-items-center">
      <img src={warn} alt="warning" />
      <p>{message}</p>
    </div>
  )
}

export default Warning
