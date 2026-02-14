"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface HeaderProps {
  logoUrl: string;
  navMap?: Array<{ href: string; label: string }>;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, navMap = [] }) => {
  const getHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return `/${href}`;
  };

  const navLinks = (
    <>
      {navMap.length > 0 &&
        navMap.map((item) => (
          <Button key={item.href} variant="neutral" size="default" asChild>
            <Link href={getHref(item.href)} className="no-underline">
              {item.label}
            </Link>
          </Button>
        ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-main py-4 shadow-shadow md:py-6">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image
            height={56}
            width={250}
            src={logoUrl}
            alt="Logo"
            priority
            className="h-10 w-auto md:h-14"
          />
        </Link>

        <nav className="hidden md:flex md:items-center gap-2">{navLinks}</nav>

        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger
              asChild
              aria-label="Open navigation menu"
              className="min-h-[44px] min-w-[44px] rounded-base border-2 border-border bg-main-foreground p-2.5 text-main shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
            >
              <button type="button">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
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
                        <Link href={getHref(item.href)}>{item.label}</Link>
                      </Button>
                    </li>
                  ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
