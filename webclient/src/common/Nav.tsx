import { useLocation, Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

function Nav() {
  const location = useLocation()
  return (
    <div className="topnav">
      <Link to="/">
        <img src={logo} alt="Advent" />
      </Link>
      <div className="links">
        <Link
          to="/dash"
          className={`${
            location.pathname.includes('/dash') ? 'is-active' : ''
          }`}
        >
          Dashboard
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
      </div>
      <div className="connect-wrapper">
        <WalletMultiButton startIcon={undefined} />
      </div>
    </div>
  )
}

export default Nav
