"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackClick } from "@/lib/gtag";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ThemeSwitcher,
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

  const trackNavClick = (href: string) => {
    const label = getLabel(href);
    trackClick({
      section: "header",
      content_type: "nav",
      item_id: href,
      item_name: label,
      link_url: getHref(href),
      link_text: label,
    });
  };

  const navLinks = (
    <>
      {navMap.length > 0 &&
        navMap.map((item) => (
          <Button key={item.href} variant="neutral" size="default" asChild>
            <Link
              href={getHref(item.href)}
              className="no-underline"
              onClick={() => trackNavClick(item.href)}
            >
              {getLabel(item.href)}
            </Link>
          </Button>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-main py-4 shadow-shadow md:py-6">
      <div className="container flex justify-between items-center">
        <Link
          href="/"
          className="flex-shrink-0"
          onClick={() =>
            trackClick({
              section: "header",
              content_type: "nav",
              item_id: "logo",
              item_name: "Logo",
              link_url: "/",
              link_text: "Logo",
            })
          }
        >
          <Image
            height={56}
            width={250}
            src={logoUrl}
            alt="Logo"
            priority
            className="h-10 w-auto md:h-14"
          />
        </Link>

        <nav className="hidden lg:flex lg:items-center gap-2">
          {navLinks}
          <ThemeSwitcher />
        </nav>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="neutral"
                size="icon"
                aria-label={t("openNav")}
                className="bg-main-foreground text-main"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="text-left">{t("menu")}</SheetTitle>
              </SheetHeader>
              <ul className="mt-6 flex flex-col gap-2">
                {navMap.length > 0 &&
                  navMap.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant="neutral"
                        size="default"
                        className="w-full justify-start text-left"
                        asChild
                      >
                        <Link
                          href={getHref(item.href)}
                          onClick={() => trackNavClick(item.href)}
                        >
                          {getLabel(item.href)}
                        </Link>
                      </Button>
                    </li>
                  ))}
              </ul>
              <div className="mt-4">
                <ThemeSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
