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
      <motion.div
        className="container w-full max-w-full rounded-base border-2 border-border bg-background p-8 shadow-shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
      >
            <Accordion type="single" collapsible className="w-full m-4">
              {experience.map((entry, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-3 w-full mb-4 px-4 bg-main border-b-8 border-r-8">
                  <AccordionTrigger className="w-full hover:no-underline">
                    <div className="grid w-full grid-cols-[5rem_1fr] items-center gap-4 text-left max-md:grid-cols-[4rem_1fr] max-md:gap-3">
                      <div className="flex h-16 w-20 shrink-0 items-center max-md:h-8 max-md:w-16">
                        {entry.logo ? (
                          <Image
                            height={40}
                            width={80}
                            src={entry.logo}
                            alt={`${entry.company} logo`}
                            className="max-h-10 w-full object-contain object-left max-md:max-h-8"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate font-heading font-bold">
                          {entry.designation} @ {entry.company}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {entry.from} – {entry.to}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.technologies?.map((tech) => (
                        <Badge key={tech} variant="neutral">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
      </motion.div>
    </Section>
  );
};

export default Experience;
