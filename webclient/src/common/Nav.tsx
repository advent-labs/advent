import { useLocation, Link } from 'react-router-dom'

function Nav() {
  const location = useLocation()
  return (
    <div className="topnav">
      <h1 className="text__xl3-semi">Advent</h1>
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
