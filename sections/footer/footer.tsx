import Profile from "../../components/profile/profile";

const Footer = ({profiles}) => (
    <footer className="container">
        <div className="flex flex-col md:flex-row justify-between py-4 w-full">
            <div className="flex flex-col w-full">
                <h3 className="text-primary-100 text-2xl font-light mb-2 dark:text-white">Thank you for stopping by!</h3>
                <h4 className="mb-4 md:mb-0 font-light dark:text-white">Let&apos;s get in touch on any of these platforms.</h4>
            </div>
            <div className="flex justify-end">
                {profiles.length && profiles.map((profile) => (
                    <Profile url={profile.url} name={profile.name} key={profile.name} className="mr-4"/>
                ))}
            </div>
        </div>
        <hr className="py-4"/>
        <div className="flex justify-between py-4 text-tertiary-900 dark:text-white">
            <span>
                &copy;
                {" "}
                {new Date().getFullYear()}
                {" "}
                <a href="https://linkedin.com/in/ps011" target="_blank" rel="noreferrer" className="dark:text-white">Prasheel</a>
            </span>

            <a href="https://github.com/ps011/ps11/LICENSE.md" target="_blank" rel="noreferrer" className="dark:text-white">License</a>

        </div>
    </footer>
);

export default Footer;
