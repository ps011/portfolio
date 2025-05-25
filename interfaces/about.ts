import type { Blog } from "./blog";
import type { SiteData } from "./site-data";

export interface About {
  name: string;
  imageUrl: string;
  about: string;
  resumeUrl: string;
  location: string;
  designation: string;
  education: string;
  skills: any; // JSON type, can be refined
  experience: any; // JSON type, can be refined
  profiles: any; // JSON type, can be refined
  interests: any; // JSON type, can be refined
  stats: any; // JSON type, can be refined
  blogs: Blog[];
  site_data: SiteData;
  countriesVisited: any; // JSON type, can be refined
} 