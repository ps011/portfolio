export interface About {
  name?: string;
  bio?: string;
  imageUrl: string;
  location: string;
  designation: string;
  education: string;
  skills: { name: string; logo: string }[];
  experience: {
    company: string;
    logo: string;
    from: string;
    to: string;
    technologies: string[];
    designation: string;
    location: string;
  }[];
  profiles: { name: string; url: string }[];
  interests: { title: string; description: string }[];
  stats: { count: string; label: string }[];
  countriesVisited: string[];
}
