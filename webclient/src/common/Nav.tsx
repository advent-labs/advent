import { useLocation, Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

function Nav() {
  const location = useLocation()
  return (
    <div className="topnav">
      <img src={logo} alt="Advent" />
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
    </div>
  )
}

export default Nav
