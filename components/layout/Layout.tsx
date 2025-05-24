import React from "react";
import { Header } from "../header/header";
import Footer from "../../sections/footer/footer";
import Meta from "../meta/meta";

interface LayoutProps {
  children: React.ReactNode;
  data: {
    meta?: any;    // Make meta optional on data if it can sometimes be missing
    header?: any;  // Make header optional on data if it can sometimes be missing
  };
  about: { // Expecting an object that contains a profiles property
    profiles?: any[]; // Make profiles optional on about if it can sometimes be missing
  };
}

const Layout: React.FC<LayoutProps> = ({
  children,
  data,
  about,
}) => {
  // Destructure with safety for potentially undefined props
  const meta = data?.meta;
  const header = data?.header;
  const profiles = about?.profiles;

  return (
    <>
      {meta && <Meta {...meta} />}
      {header && <Header {...header} />}
      <main>{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </>
  );
};

export default Layout;
