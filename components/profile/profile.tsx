import Github from "../icons/github";
import Link from "next/link";
import Linkedin from "../icons/linkedin";
import X from "../icons/x";
import Facebook from "../icons/facebook";
import Instagram from "../icons/instagram";
import Stackoverflow from "../icons/stackoverflow";
import { Button } from "@prasheel/ui";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/gtag";

type ProfileAnalytics =
  | false
  | {
      section?: string;
      contentType?: string;
      itemId?: string;
      itemName?: string;
      linkText?: string;
    };

interface ProfileProps {
  url: string;
  name: string;
  className?: string;
  analytics?: ProfileAnalytics;
  onClick?: () => void;
}

const Profile = ({
  url,
  name,
  className,
  analytics,
  onClick,
}: ProfileProps) => {

  const getProfileIcon = (name: string) => {
    switch (name) {
      case "github":
        return <Github />;
      case "linkedin":
        return <Linkedin />;
      case "twitter":
      case "x":
        return <X />;
      case "facebook":
        return <Facebook />;
      case "instagram":
        return <Instagram />;
      case "stackoverflow":
        return <Stackoverflow />;
      default:
        return <Github />;
    }
  };

  const handleClick = () => {
    if (analytics !== false) {
      trackClick({
        section: analytics?.section || "profile",
        content_type: analytics?.contentType || "profile",
        item_id: analytics?.itemId || name,
        item_name: analytics?.itemName || name,
        link_url: url,
        link_text: analytics?.linkText || `${name} profile`,
      });
    }
    onClick?.();
  };

  return (
    <Button variant="default" size="icon" className="[&_svg]:size-6" asChild>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} profile`}
        className="no-underline"
        onClick={handleClick}
      >
        <span className={cn("block size-6 text-main-foreground", className)} aria-hidden="true">
          {getProfileIcon(name)}
        </span>
      </Link>
    </Button>
  );
};

export default Profile;
