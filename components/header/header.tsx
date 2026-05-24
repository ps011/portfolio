"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { trackClick } from "@/lib/gtag";
import {
  AppHeader,
  type AppHeaderLinkProps,
  type AppHeaderNavItem,
} from "@prasheel/ui";

export interface HeaderProps {
  logoUrl: string;
  navMap?: Array<{ href: string }>;
}

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

  const getLabel = (href: string) =>
    navKeyMap[href] ? tNav(navKeyMap[href]) : href;

  const navItems: AppHeaderNavItem[] = navMap.map((item) => ({
    href: getHref(item.href),
    label: getLabel(item.href),
  }));

  const navTrackingByHref = new Map(
    navMap.map((item) => [
      getHref(item.href),
      {
        itemId: item.href,
        label: getLabel(item.href),
      },
    ]),
  );

  const HeaderLink = ({
    href,
    onClick,
    children,
    ...props
  }: AppHeaderLinkProps) => {
    const isLogo = href === "/" && props["aria-label"] === "Logo";
    const trackedNav = navTrackingByHref.get(href);
    const label =
      (isLogo && "Logo") ||
      trackedNav?.label ||
      (typeof children === "string" ? children : href);

    return (
      <Link
        href={href}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;

          trackClick({
            section: "header",
            content_type: "nav",
            item_id: isLogo ? "logo" : (trackedNav?.itemId ?? href),
            item_name: label,
            link_url: href,
            link_text: label,
          });
        }}
      >
        {children}
      </Link>
    );
  };

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
