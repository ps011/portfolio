import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    logoUrl: string;
    navMap?: Array<{ href: string, label: string }>;

}

const Header = ({logoUrl, navMap = []}: HeaderProps) => (
    <div className="tw-bg-primary-200 tw-py-8">
        <nav className="tw-bg-primary-200 tw-container tw-flex tw-justify-between">
            <Link href="/">
                <Image height={56} width={250} src={logoUrl} alt="Logo"/>
            </Link>
            <div className="tw-hidden md:tw-flex">
                <ul className="tw-flex tw-items-center">
                    {navMap.length ? navMap.map((item) => (
                        <li className="tw-mr-8 tw-text-white" key={item.href}>
                            <a href={item.href}>
                                {item.label}
                            </a>
                        </li>
                    )) : ""}
                </ul>
            </div>
        </nav>
    </div>
);

export default Header;
