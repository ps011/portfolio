"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Code,
  User,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../../components/tailwind/section";
import Profile from "../../components/profile/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  skills,
  stats,
  profiles,
}: AboutProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (cardType: string) => {
    const newExpandedCard = expandedCard === cardType ? null : cardType;
    setExpandedCard(newExpandedCard);
    if (newExpandedCard) {
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const cardTypes = [
    { id: "about", icon: User, label: "About Me" },
    { id: "skills", icon: Code, label: "Skills" },
  ] as const;

  return (
    <Section container id="about">
      <motion.div
        className="rounded-base border-2 border-border bg-background px-4 py-8 shadow-shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center justify-between text-foreground lg:flex-row">
          <div className="-mt-16 mb-4 flex-1 lg:order-2 lg:mb-0">
            <Avatar className="mx-auto h-48 w-48 min-h-48 min-w-48">
              <AvatarImage src={imageUrl} alt="Profile" />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-1 justify-center lg:order-1">
            <div className="flex gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading text-2xl font-bold">{stat.count}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 justify-center py-4 lg:order-3">
            <div className="flex gap-4">
              {profiles.map((profile) => (
                <Profile
                  url={profile.url}
                  name={profile.name}
                  key={profile.name}
                  className="text-foreground"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="mb-6 font-heading text-2xl font-bold">{name}</h2>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {location}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm">
            <Briefcase className="size-4 shrink-0" />
            {designation}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm">
            <GraduationCap className="size-4 shrink-0" />
            {education}
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <AnimatePresence mode="wait">
            {expandedCard && (
              <motion.div
                key={`expanded-${expandedCard}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {expandedCard === "about" && (
                  <Card
                    className="cursor-pointer transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
                    onClick={() => toggleCard("about")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="size-5" />
                        About Me
                      </CardTitle>
                      <ChevronUp className="size-5" />
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: about }}
                      />
                    </CardContent>
                  </Card>
                )}
                {expandedCard === "skills" && (
                  <Card
                    className="cursor-pointer transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
                    onClick={() => toggleCard("skills")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Code className="size-5" />
                        Skills
                      </CardTitle>
                      <ChevronUp className="size-5" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="flex flex-col items-center text-center"
                          >
                            <Image
                              height={50}
                              width={50}
                              className="mb-2 object-contain transition-transform hover:scale-110"
                              src={skill.logo}
                              alt={skill.name}
                            />
                            <span className="text-xs text-muted-foreground">
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`grid gap-4 transition-all duration-500 ${
              expandedCard ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {cardTypes.map(({ id, icon: Icon, label }) => {
              if (expandedCard === id) return null;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="flex h-80 cursor-pointer flex-col transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
                    onClick={() => toggleCard(id)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="size-5" />
                        {label}
                      </CardTitle>
                      <ChevronDown className="size-5" />
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between">
                      {id === "about" && (
                        <>
                          <div
                            className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                            dangerouslySetInnerHTML={{
                              __html:
                                about?.length > 200
                                  ? about.substring(0, 200) + "..."
                                  : about,
                            }}
                          />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Click to read more
                          </p>
                        </>
                      )}
                      {id === "skills" && (
                        <>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {skills.slice(0, 8).map((skill) => (
                              <div
                                key={skill.name}
                                className="flex flex-col items-center text-center"
                              >
                                <Image
                                  height={40}
                                  width={40}
                                  className="mb-1 object-contain"
                                  src={skill.logo}
                                  alt={skill.name}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {skill.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          {skills.length > 8 && (
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                              +{skills.length - 8} more. Click to see all
                            </p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default About;
