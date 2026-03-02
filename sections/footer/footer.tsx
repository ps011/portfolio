"use client";

import { motion } from "framer-motion";
import Profile from "../../components/profile/profile";
import { useUIConfig } from "../../lib/ui-context";

const Footer = ({
  profiles,
}: {
  profiles: { name: string; url: string }[];
}) => {
  const ui = useUIConfig();

  return (
    <motion.footer
      className="container border-t-2 border-border bg-secondary-background py-8 shadow-shadow"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col">
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            {ui.footer.heading}
          </h3>
          <p className="mb-4 text-foreground md:mb-0">
            {ui.footer.subheading}
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
      <div className="flex flex-col gap-2 text-sm text-foreground sm:flex-row sm:justify-between">
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href={ui.footer.ownerUrl}
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            {ui.footer.ownerName}
          </a>
        </span>
        <a
          href={ui.footer.licenseUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:no-underline"
        >
          {ui.footer.licenseLabel}
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;
