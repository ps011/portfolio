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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded-base focus:border-2 focus:border-border focus:bg-main focus:px-4 focus:py-2 focus:text-main-foreground focus:shadow-shadow"
      >
        Skip to main content
      </a>
      {meta && <Meta {...meta} />}
      {header && <Header {...header} />}
      <main id="main-content">{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </SmoothScroll>
  );
};

export default Layout;
