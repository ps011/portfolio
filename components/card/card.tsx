"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card as UICard,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CardProps {
  thumbnail: string;
  title: string;
  shortDescription: string;
  tags: string;
  link: string;
}

const Card = ({
  thumbnail,
  title,
  shortDescription,
  tags,
  link,
}: CardProps) => {
  const tagsArray: string[] = tags
    ? Array.isArray(tags)
      ? (tags as unknown as string[])
      : (tags as string).split(",").map((tag) => (tag as string).trim())
    : [];

  const getLink = (href: string) =>
    href.startsWith("http") ? href : `/blog/${href}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <UICard className="flex h-full flex-col transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY">
        {thumbnail ? (
          <div className="relative h-48 w-full overflow-hidden rounded-t-base">
            <Image
              src={thumbnail}
              alt={`${title} thumbnail`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-2 text-base uppercase tracking-wide">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 pt-0">
          <p className="line-clamp-3 text-sm text-foreground">
            {shortDescription}
          </p>
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagsArray.map((tag) => (
                <Badge key={tag} variant="neutral" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="default" size="default" className="w-full" asChild>
            <Link href={getLink(link)} target="_blank" className="no-underline">
              Read more
            </Link>
          </Button>
        </CardFooter>
      </UICard>
    </motion.div>
  );
};

export default Card;
