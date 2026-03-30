"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Section from "../../components/tailwind/section";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ExperienceItem {
  logo: string;
  designation: string;
  company: string;
  from: string;
  to: string;
  location: string;
  technologies: string[];
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

const Experience = ({ experience }: ExperienceProps) => {
  return (
    <Section container id="experience" heading="Experience">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {experience.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <AccordionItem
              value={`item-${index}`}
              className="rounded-base border-2 border-border bg-main shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:text-main-foreground">
                <div className="grid w-full grid-cols-[4rem_1fr] items-center gap-4 text-left text-main-foreground sm:grid-cols-[5rem_1fr]">
                  <div className="flex h-10 w-full shrink-0 items-center">
                    {entry.logo ? (
                      <Image
                        height={40}
                        width={80}
                        src={entry.logo}
                        alt={`${entry.company} logo`}
                        className="max-h-10 w-full object-contain object-left brightness-0 invert"
                      />
                    ) : (
                      <span className="text-lg font-bold">—</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold">
                      {entry.designation}
                      <span className="font-normal opacity-80"> @ {entry.company}</span>
                    </span>
                    <span className="mt-0.5 block text-sm opacity-80">
                      {entry.from} – {entry.to}
                      {entry.location && (
                        <span className="ml-3">{entry.location}</span>
                      )}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5">
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {entry.technologies?.map((tech) => (
                    <Badge key={tech} variant="default" className="border-main-foreground bg-main-foreground text-main">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </Section>
  );
};

export default Experience;
