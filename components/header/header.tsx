import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    logoUrl: string;
    navMap?: Array<{ href: string, label: string }>;

}
const Header = ({ logoUrl, navMap = [] }: HeaderProps) => (
  <div className="bg-primary">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary header-nav container">
      <Link href="/">
        <Image className="navbar-brand" height={56} width={250} src={logoUrl} alt="Logo" />
      </Link>
      <div className="collapse navbar-collapse" id="navbar-primary">
        <div className="navbar-collapse-header">
          <div className="row">
            <div className="col-12 collapse-brand">
              <Link href="/">
                <Image height={56} width={250} src={logoUrl} alt="Logo" />
              </Link>
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
          )) : "" }
        </ul>
      </div>
    </nav>
  </div>
);

export default Header;
