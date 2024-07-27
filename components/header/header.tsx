import PropTypes from 'prop-types'

const Header = ({ logoUrl, navMap = [] }) => (
  <div className="bg-primary">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary header-nav container">
      <a href="/">
        <img className="navbar-brand" height="56px" src={logoUrl} alt="Logo" />
      </a>
      <div className="collapse navbar-collapse" id="navbar-primary">
        <div className="navbar-collapse-header">
          <div className="row">
            <div className="col-12 collapse-brand">
              <a href="/">
                <img src={logoUrl} alt="Logo" />
              </a>
            </div>
          </div>
        </div>
        <ul className="navbar-nav ml-lg-auto">
          { navMap.length ? navMap.map((item) => (
            <li className="nav-item mr-4" key={item.href}>
              <a className="text-white" href={item.href}>
                {item.label}
              </a>
            </li>
          )) : '' }
        </ul>
      </div>
    </nav>
  </div>
)

Header.propTypes = {
  logoUrl: PropTypes.string.isRequired,
  navMap: PropTypes.arrayOf(PropTypes.object),
}

export default Header
