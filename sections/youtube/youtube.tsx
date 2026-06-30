"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@prasheel/ui";
import type { YouTubeVideo } from "../../interfaces/youtube";
import Section from "../../components/tailwind/section";
import { trackSelectContent } from "@/lib/gtag";

const formatPublishedDate = (publishedAt: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(publishedAt));

function YouTubeCard({ video }: { video: YouTubeVideo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="flex h-full flex-col transition-shadow hover:shadow-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-base bg-secondary-background">
          <Image
            src={video.thumbnailUrl}
            alt={`${video.title} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-2 text-base uppercase tracking-wide">
            {video.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-foreground">
            {formatPublishedDate(video.publishedAt)}
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="default" size="default" className="w-full" asChild>
            <Link
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 no-underline"
              onClick={() =>
                trackSelectContent({
                  section: "youtube_card",
                  content_type: "video",
                  item_id: video.id,
                  item_name: video.title,
                  link_url: video.url,
                  link_text: "Watch on YouTube",
                })
              }
            >
              Watch on YouTube
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const itemBasis = (count: number) => {
  if (count >= 4) return "md:basis-1/2 lg:basis-1/4";
  if (count === 3) return "md:basis-1/2 lg:basis-1/3";
  return "md:basis-1/2 lg:basis-1/3";
};

export default function YouTube({ videos }: { videos: YouTubeVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <Section container id="videos" heading="Videos">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video.id} className={itemBasis(videos.length)}>
              <YouTubeCard video={video} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Section>
  );
}
