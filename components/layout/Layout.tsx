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
    name?: string;
    profiles?: { name: string; url: string }[];
  };
}

const Layout: React.FC<LayoutProps> = ({ children, data, about }) => {
  const meta = data?.meta;
  const header = data?.header;
  const profiles = about?.profiles;

  const twitterProfile = profiles?.find(
    (p) => p.name === "twitter" || p.name === "x",
  );
  const twitterHandle = twitterProfile
    ? `@${twitterProfile.url.split("/").filter(Boolean).pop()}`
    : undefined;

  return (
    <SmoothScroll>
      {meta && (
        <Meta
          {...meta}
          author={about?.name}
          twitterHandle={twitterHandle}
        />
      )}
      {header && <Header {...header} />}
      <main>{children}</main>
      {profiles && <Footer profiles={profiles} />}
    </SmoothScroll>
  );
};

export default Layout;
