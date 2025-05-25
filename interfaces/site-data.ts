import type { HeaderProps } from "../components/header/header";
import type { MetaProps } from "../components/meta/meta";

export interface Banner {
  illustration: string;
  texts: any; // JSON type, can be refined
  ctaLabel: string;
  ctaUrl: string;
  downloadable: boolean;
}

export interface SiteData {
  header: HeaderProps;
  meta: MetaProps;
  banner: Banner;
  name: string;
} 