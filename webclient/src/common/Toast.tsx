import close from '../assets/close.svg'
import error from '../assets/error.svg'
import warn from '../assets/warn.svg'
import success from '../assets/success.svg'
import request from '../assets/request.svg'

export type ToastType = 'error' | 'warn' | 'request' | 'success'

export interface ToastData {
  title: string
  type: string
  message?: string
  status?: any
  sig?: string
}

export interface ToastProps {
  props: ToastData
}

function Toast({ props }: { props: ToastData }) {
  const { title, message, type, sig } = props

  const icons: any = {
    error: error,
    warn: warn,
    request: request,
    success: success
  }

  return (
    <div className="toast-container">
      <img src={icons[type]} alt="icon" className="mr-5" />
      <div>
        <p className="text__xl-semi is-white">{title}</p>
        {message && <p className="text__small is-grey">{message}</p>}
        {/*TODO: update href to main net*/}
        {sig && (
          <a
            className="text__small is-grey"
            target="_blank"
            href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
            rel="noreferrer">
            View transaction
          </a>
        )}
      </div>
      <img src={close} alt="close" className="pr-2" />
    </div>
  )
}

export default Toast
