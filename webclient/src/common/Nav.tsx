import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useLocation } from 'react-router-dom'

function Nav() {
  const location = useLocation()
  return (
    <div className="topnav">
      <a
        href="/dash"
        className={`${location.pathname.includes('/dash') ? 'is-active' : ''}`}
      >
        Dash
      </a>
      <a
        href="/lend"
        className={` ml-4 ${
          location.pathname.includes('/lend') ? 'is-active' : ''
        }`}
      >
        Lend
      </a>
      <a
        href="/borrow"
        className={`ml-4 mr-4 ${
          location.pathname.includes('/borrow') ? 'is-active' : ''
        }`}
      >
        Borrow
      </a>
      <WalletMultiButton />
    </div>
  )
}

export default Nav
