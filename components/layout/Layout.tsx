import React from "react";
import { Header } from "../header/header";
import Footer from "../../sections/footer/footer";
import Meta from "../meta/meta";
import { SmoothScroll } from "../smooth-scroll";

interface LayoutProps {
  children: React.ReactNode;
  data: {
    meta?: any;
    header?: any;
  };
  about: {
    profiles?: any[];
  };
}

const Layout: React.FC<LayoutProps> = ({ children, data, about }) => {
  const meta = data?.meta;
  const header = data?.header;
  const profiles = about?.profiles;

  return (
    <SmoothScroll>
      {meta && <Meta {...meta} />}
      {header && <Header {...header} />}
      <main>{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </SmoothScroll>
  );
};

export default Layout;
