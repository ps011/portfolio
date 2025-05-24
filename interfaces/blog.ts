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
