export interface Blog {
  title: string;
  shortDescription: string;
  banner: string;
  thumbnail: string;
  author: string;
  profileLink: string;
  hidden: boolean;
  tags: string[];
  content: string;
  date: string;
  published_at: string;
  updated_at: string;
  createdAt: string;
  type: BlogType;
  link: string;
  authorEmail: string;
  user: string;
}

export type BlogType = "blogs" | "hobby-projects" | "coding-challenge";
