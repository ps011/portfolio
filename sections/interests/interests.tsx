"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Section from "../../components/tailwind/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InterestsProps {
  illustration: string;
  interests: {
    title: string;
    description: string;
  }[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

const Interests = ({ illustration, interests }: InterestsProps) => {
  const getInterestType = (
    title: string
  ): "blogging" | "photography" | "coding" | "other" => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("blog") || lowerTitle.includes("writing"))
      return "blogging";
    if (
      lowerTitle.includes("photo") ||
      lowerTitle.includes("camera") ||
      lowerTitle.includes("image")
    )
      return "photography";
    if (
      lowerTitle.includes("coding") ||
      lowerTitle.includes("programming") ||
      lowerTitle.includes("development")
    )
      return "coding";
    return "other";
  };

  const getCTA = (interest: { title: string; description: string }) => {
    const type = getInterestType(interest.title);
    switch (type) {
      case "blogging":
        return (
          <Button variant="default" size="default" asChild>
            <Link href="/blog" className="no-underline">
              View My Blog Posts
            </Link>
          </Button>
        );
      case "photography":
        return (
          <Button variant="default" size="default" asChild>
            <Link href="/photo-gallery" className="no-underline">
              Explore Photo Gallery
            </Link>
          </Button>
        );
      case "coding":
        return (
          <Button variant="default" size="default" asChild>
            <Link
              href="https://github.com/ps011"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              View My GitHub
            </Link>
          </Button>
        );
      default:
        return (
          <Button variant="neutral" size="default" disabled>
            Coming Soon
          </Button>
        );
    }
  };

  return (
    <Section container id="interests">
      <div className="flex flex-col-reverse items-center justify-around gap-8 md:flex-row">
        <motion.div
          className="flex flex-1 flex-col gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {interests.length > 0 &&
            interests.map((interest) => (
              <motion.div key={interest.title} variants={item}>
                <Card className="transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading">
                      {interest.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground">{interest.description}</p>
                    <div className="mt-4">{getCTA(interest)}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </motion.div>
        <motion.div
          className="flex flex-1 justify-center pb-4 md:pb-0"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Image
            height={0}
            width={0}
            src={illustration}
            alt="Interests"
            className="h-auto w-full max-w-md"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </Section>
  );
};

export default Interests;
