"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  AppHeader,
  type AppHeaderLinkProps,
  type AppHeaderNavItem,
} from "@prasheel/ui";

export interface HeaderProps {
  logoUrl: string;
  navMap?: Array<{ href: string }>;
}

const HeaderLink = ({ href, ...props }: AppHeaderLinkProps) => (
  <Link href={href} {...props} />
);

export const Header: React.FC<HeaderProps> = ({ logoUrl, navMap = [] }) => {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");

  const navKeyMap: Record<string, string> = {
    "#about": "about",
    "#experience": "experience",
    "#interests": "interests",
    "/blog": "blogs",
    "/photo-gallery": "photography",
  };

  const getHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return `/${href}`;
  };

  const navItems: AppHeaderNavItem[] = navMap.map((item) => ({
    href: getHref(item.href),
    label: navKeyMap[item.href] ? tNav(navKeyMap[item.href]) : item.href,
  }));

  return (
    <AppHeader
      brand={
        <Image
          height={56}
          width={250}
          src={logoUrl}
          alt="Logo"
          priority
          className="h-10 w-auto md:h-14"
        />
      }
      brandHref="/"
      brandLabel="Logo"
      linkComponent={HeaderLink}
      navItems={navItems}
      openMenuLabel={t("openNav")}
      menuLabel={t("menu")}
      className="z-40 bg-main shadow-shadow"
      containerClassName="py-4 md:py-6"
      brandClassName="flex-shrink-0"
    />
  );
};
