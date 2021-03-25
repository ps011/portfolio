import Link from 'next/link'
import Image from 'next/image'
import PropTypes from 'prop-types'

const Header = ({ logoUrl, navMap }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary header-nav">
    <div>
      <a href="/">
        <Image className="navbar-brand" height="48px" width="100%" src={logoUrl} alt="Logo" />
      </a>
      <div className="collapse navbar-collapse" id="navbar-primary">
        <div className="navbar-collapse-header">
          <div className="row">
            <div className="col-12 collapse-brand">
              {/* <Link href="/">
                <Image src={logoUrl} layout="fill" />
              </Link> */}
            </div>
          </div>
        </div>
        <ul className="navbar-nav ml-lg-auto">
          {navMap.length ? navMap.map((item) => (
            <li className="nav-item">
              <Link className="nav-link" href={item.href}>
                {item.label}
              </Link>
            </li>
          )) : ''}
        </ul>
      </div>
    </div>
  </nav>
)

Header.propTypes = {
  logoUrl: PropTypes.string.isRequired,
  navMap: PropTypes.arrayOf(PropTypes.object),
}

Header.defaultProps = {
  navMap: [],
}

export default Header
