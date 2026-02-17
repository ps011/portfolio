import type { About } from "./about";

export interface Blog {
  title: string;
  shortDescription: string;
  banner: string;
  thumbnail: string;
  author: string;
  profileLink: string;
  hidden: boolean;
  tags: string;
  content: string;
  date: string;
  published_at?: string;
  updated_at?: string;
  createdAt?: string;
  type: string;
  link: string;
  user: About;
}

export interface BlogCard {
  title: string;
  shortDescription: string;
  thumbnail: string;
  tags: string;
  link: string;
  hidden: boolean;
  date: string;
  type: string;
}
