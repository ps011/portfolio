"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Profile from "../../components/profile/profile";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../../components/language-switcher/language-switcher";

const Footer = ({
  profiles,
}: {
  profiles: { name: string; url: string }[];
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const t = useTranslations("footer");

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["-0.2 1", "0.2 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], prefersReduced ? [1, 1] : [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [20, 0]);

  return (
    <motion.footer
      ref={footerRef}
      className="container border-t-2 border-border bg-secondary-background py-8 shadow-shadow"
      style={{ opacity, y }}
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col">
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            {t("thanks")}
          </h3>
          <p className="mb-4 text-foreground md:mb-0">
            {t("getInTouch")}
          </p>
        </div>
        <div className="flex gap-4">
          {profiles.length > 0 &&
            profiles.map((profile) => (
              <Profile
                key={profile.name}
                url={profile.url}
                name={profile.name}
                className="text-main-foreground"
              />
            ))}
        </div>
      </div>
      <hr className="my-6 border-border" />
      <div className="flex flex-col gap-2 text-sm text-foreground sm:flex-row sm:justify-between sm:items-center">
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://linkedin.com/in/ps011"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            Prasheel
          </a>
        </span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <a
            href="https://github.com/ps011/ps11/LICENSE.md"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            {t("license")}
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
