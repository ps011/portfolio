import Profile from "../../components/profile/profile";

const Footer = ({profiles}) => (
    <footer className="tw-container">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-py-4 tw-w-full">
            <div className="tw-flex tw-flex-col tw-w-full">
                <h3 className="tw-text-primary-100 tw-text-2xl tw-font-light tw-mb-2">Thank you for stopping by!</h3>
                <h4 className="tw-mb-4 md:tw-mb-0 tw-font-light">Let&apos;s get in touch on any of these platforms.</h4>
            </div>
            <div className="tw-flex tw-justify-end">
                {profiles.length && profiles.map((profile) => (
                    <Profile url={profile.url} name={profile.name} key={profile.name} className="tw-mr-4"/>
                ))}
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
