import Link from "next/link";

const Footer = () => (
    <footer className="tw-container">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-py-4">
            <div>
                <h3 className="tw-text-primary-100 tw-text-2xl tw-font-light tw-mb-2">Thank you for stopping by!</h3>
                <h4 className="tw-mb-4 md:tw-mb-0 tw-font-light">Let&apos;s get in touch on any of these platforms.</h4>
            </div>
            <div>
                <Link target="_blank" rel="noreferrer" href="https://linkedin.com/in/ps011"
                      className="btn btn-neutral btn-icon-only btn-primary btn-lg btn-round">
                    <i className="fa fa-linkedin"/>
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://github.com/ps011/"
                      className="btn btn-neutral btn-icon-only btn-github btn-round btn-lg">
                    <i className="fa fa-github"/>
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://twitter.com/soniprasheel"
                      className="btn btn-neutral btn-icon-only btn-twitter btn-round btn-lg">
                    <i className="fa fa-twitter"/>
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://www.facebook.com/prasheelsoni11"
                      className="btn btn-neutral btn-icon-only btn-facebook btn-round btn-lg">
                    <i className="fa fa-facebook-square"/>
                </Link>
            </div>
        </div>
        <hr className="tw-py-4"/>
        <div className="tw-flex tw-justify-between tw-py-4">
            <span>
                &copy;
                {" "}
                {new Date().getFullYear()}
                {" "}
                <a href="https://linkedin.com/in/ps011" target="_blank" rel="noreferrer">Prasheel</a>
            </span>

            <a href="https://github.com/ps011/ps11/LICENSE.md" target="_blank" rel="noreferrer">License</a>

        </div>
    </footer>
);

export default Footer;
