const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row row-grid align-items-center">
        <div className="col-lg-6">
          <h3 className="text-primary font-weight-light mb-2">Thank you for stopping by!</h3>
          <h4 className="mb-0 font-weight-light">Let&apos;s get in touch on any of these platforms.</h4>
        </div>
        <div className="col-lg-6 text-lg-center btn-wrapper">
          <a target="_blank" rel="noreferrer" href="https://linkedin.com/in/ps011" className="btn btn-neutral btn-icon-only btn-primary btn-lg btn-round">
            <i className="fa fa-linkedin" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://github.com/ps011/ps11" className="btn btn-neutral btn-icon-only btn-github btn-round btn-lg">
            <i className="fa fa-github" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://twitter.com/soniprasheel" className="btn btn-neutral btn-icon-only btn-twitter btn-round btn-lg">
            <i className="fa fa-twitter" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://www.facebook.com/prasheelsoni11" className="btn btn-neutral btn-icon-only btn-facebook btn-round btn-lg">
            <i className="fa fa-facebook-square" />
          </a>
        </div>
      </div>
      <hr />
      <div className="row align-items-center justify-content-md-between">
        <div className="col-md-6">
          <div className="copyright">
            &copy;
            {" "}
            {new Date().getFullYear()}
            <a href="https://linkedin.com/in/ps011" target="_blank" rel="noreferrer">Prasheel</a>
            .
          </div>
        </div>
        <div className="col-md-6">
          <ul className="nav nav-footer justify-content-end">
            <li className="nav-item">
              <a href="https://github.com/ps011/ps11/LICENSE.md" className="nav-link" target="_blank" rel="noreferrer">License</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
