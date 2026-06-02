"use client";

import Link from "next/link";
import { Briefcase, MapPin, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
} from "@prasheel/ui";
import { trackClick } from "@/lib/gtag";

interface Interest {
  title: string;
  description: string;
}

interface AboutProps {
  name?: string;
  bio?: string;
  skills: { logo: string; name: string }[];
  imageUrl: string;
  location: string;
  designation: string;
  education: string;
  stats: { count: number; label: string }[];
  profiles: { name: string; url: string }[];
  interests?: Interest[];
}

type InterestType = "blogging" | "photography" | "coding" | "other";

const getInterestType = (title: string): InterestType => {
  const t = title.toLowerCase();
  if (t.includes("blog") || t.includes("writing")) return "blogging";
  if (t.includes("photo") || t.includes("camera") || t.includes("image"))
    return "photography";
  if (
    t.includes("coding") ||
    t.includes("programming") ||
    t.includes("development")
  )
    return "coding";
  return "other";
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const About = ({
  name,
  bio,
  imageUrl,
  location,
  designation,
  education,
  stats,
  profiles,
  interests = [],
}: AboutProps) => {
  const t = useTranslations("about");
  const tInterests = useTranslations("interests");
  const tc = useTranslations("common");
  const displayName = name || t("name");
  const aboutHtml = bio || t.raw("bio");

  const renderInterestCTA = (interest: Interest) => {
    const type = getInterestType(interest.title);
    switch (type) {
      case "blogging":
        return (
          <Button variant="default" size="sm" asChild>
            <Link
              href="/blog"
              className="no-underline"
              onClick={() =>
                trackClick({
                  section: "interests",
                  content_type: "cta",
                  item_id: "view_blog",
                  item_name: tInterests("viewBlog"),
                  link_url: "/blog",
                  link_text: tInterests("viewBlog"),
                })
              }
            >
              {tInterests("viewBlog")}
            </Link>
          </Button>
        );
      case "photography":
        return (
          <Button variant="default" size="sm" asChild>
            <Link
              href="/photo-gallery"
              className="no-underline"
              onClick={() =>
                trackClick({
                  section: "interests",
                  content_type: "cta",
                  item_id: "view_gallery",
                  item_name: tInterests("viewGallery"),
                  link_url: "/photo-gallery",
                  link_text: tInterests("viewGallery"),
                })
              }
            >
              {tInterests("viewGallery")}
            </Link>
          </Button>
        );
      case "coding":
        return (
          <Button variant="default" size="sm" asChild>
            <Link
              href="https://github.com/ps011"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              onClick={() =>
                trackClick({
                  section: "interests",
                  content_type: "profile",
                  item_id: "github",
                  item_name: "GitHub",
                  link_url: "https://github.com/ps011",
                  link_text: tInterests("viewGithub"),
                })
              }
            >
              {tInterests("viewGithub")}
            </Link>
          </Button>
        );
      default:
        return (
          <Button variant="neutral" size="sm" disabled>
            {tc("comingSoon")}
          </Button>
        );
    }
  };

  return (
    <Section container id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden">
          {/* Top stripe: avatar + identity + social */}
          <div className="flex flex-col items-center gap-3 border-b-2 border-border px-6 py-5 sm:flex-row sm:gap-5">
            <Avatar className="h-48 w-48 shrink-0 border-2 border-border shadow-shadow-sm">
              <AvatarImage src={imageUrl} alt={displayName} />
              <AvatarFallback className="text-xl font-bold">
                {displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start">
              <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:justify-start">
                {designation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3 shrink-0" />
                    {designation}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 shrink-0" />
                    {location}
                  </span>
                )}
                {education && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3 shrink-0" />
                    {education}
                  </span>
                )}
              </div>
              {profiles?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profiles.map((profile) => (
                    <Profile key={profile.name} url={profile.url} name={profile.name} />
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            {stats?.length > 0 && (
              <div className="flex shrink-0 gap-2">
                {stats.map((stat, index) => (
                  <Badge
                    asChild
                    key={stat.label}
                    className="flex flex-col px-3 py-2 text-center shadow-shadow-sm"
                  >
                    <div>
                      <div className="text-lg font-bold leading-none text-main-foreground">
                        {stat.count}
                      </div>
                      <div className="mt-0.5 text-xs text-main-foreground opacity-80">
                        {t(`stat${index}Label`) || stat.label}
                      </div>
                    </div>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* About text */}
          <div
            className="prose prose-sm max-w-none px-6 py-5 text-foreground"
            dangerouslySetInnerHTML={{ __html: aboutHtml }}
          />

          {/* Interests */}
          {interests.length > 0 && (
            <div className="border-t-2 border-border px-6 py-5">
              <div className="mb-4 flex items-center gap-2">
                <Badge className="h-7 w-7 p-0 shadow-shadow-sm [&_svg]:size-4">
                  <Sparkles className="size-4" />
                </Badge>
                <h3 className="text-lg font-bold text-foreground">
                  {t("interestsHeading")}
                </h3>
              </div>
              <motion.ul
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
              >
                {interests.map((interest, index) => (
                  <motion.li
                    key={interest.title}
                    variants={item}
                    className="flex h-full flex-col rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow-sm transition-transform hover:-translate-x-boxShadowX hover:-translate-y-boxShadowY hover:shadow-shadow"
                  >
                    <h4 className="text-base font-bold text-foreground">
                      {t(`interest${index}Title`) || interest.title}
                    </h4>
                    <p className="mt-2 flex-1 text-sm text-foreground/90">
                      {t(`interest${index}Desc`) || interest.description}
                    </p>
                    <div className="mt-4">{renderInterestCTA(interest)}</div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}
        </Card>
      </motion.div>
    </Section>
  );
};

export default About;
