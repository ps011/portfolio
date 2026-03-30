"use client";

import { Briefcase, MapPin, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AboutProps {
  about: string;
  skills: { logo: string; name: string }[];
  imageUrl: string;
  name: string;
  location: string;
  designation: string;
  education: string;
  stats: { count: number; label: string }[];
  profiles: { name: string; url: string }[];
}

const About = ({
  name,
  about,
  imageUrl,
  location,
  designation,
  education,
  stats,
  profiles,
}: AboutProps) => {
  return (
    <Section container id="about">
      <motion.div
        className="rounded-base border-2 border-border bg-background shadow-shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        {/* Top stripe: avatar + identity + social */}
        <div className="flex flex-col items-center gap-3 border-b-2 border-border px-6 py-5 sm:flex-row sm:gap-5">
          <Avatar className="h-48 w-48 shrink-0 border-2 border-border shadow-[2px_2px_0px_0px_#000000]">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="text-xl font-bold">
              {name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
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
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-base border-2 border-border bg-main px-3 py-2 text-center shadow-[2px_2px_0px_0px_#000000]"
                >
                  <div className="text-lg font-bold leading-none text-main-foreground">
                    {stat.count}
                  </div>
                  <div className="mt-0.5 text-[10px] text-main-foreground opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* About text */}
        {about && (
          <div
            className="prose prose-sm max-w-none px-6 py-5 text-foreground"
            dangerouslySetInnerHTML={{ __html: about }}
          />
        )}
      </motion.div>
    </Section>
  );
};

export default About;
