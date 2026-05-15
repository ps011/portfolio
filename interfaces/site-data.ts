import type { HeaderProps } from "../components/header/header";
import type { MetaProps } from "../components/meta/meta";

export interface Banner {
  ctaUrl: string;
  downloadable: boolean;
}

export interface SiteData {
  header: HeaderProps;
  meta: MetaProps;
  banner: Banner;
}
