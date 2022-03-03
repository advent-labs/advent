import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useLocation, Link } from 'react-router-dom'

function Nav() {
  const location = useLocation()
  return (
    <div className="topnav">
      <Link
        to="/dash"
        className={`${location.pathname.includes('/dash') ? 'is-active' : ''}`}
      >
        Dash
      </Link>
      <Link
        to="/lend"
        className={` ml-4 ${
          location.pathname.includes('/lend') ? 'is-active' : ''
        }`}
      >
        Lend
      </Link>
      <Link
        to="/borrow"
        className={`ml-4 mr-4 ${
          location.pathname.includes('/borrow') ? 'is-active' : ''
        }`}
      >
        Borrow
      </Link>
      <WalletMultiButton />
    </div>
  )
}

export default Nav
