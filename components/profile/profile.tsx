import Github from "../icons/github";
import Link from "next/link";
import Linkedin from "../icons/linkedin";
import X from "../icons/x";
import Facebook from "../icons/facebook";
import Instagram from "../icons/instagram";
import Stackoverflow from "../icons/stackoverflow";
import { Button } from "@prasheel/ui";
import { cn } from "@/lib/utils";

interface ProfileProps {
  url: string;
  name: string;
  className?: string;
}

const Profile = ({ url, name, className }: ProfileProps) => {

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

  return (
    <Button variant="default" size="icon" className="[&_svg]:size-6" asChild>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} profile`}
        className="no-underline"
      >
        <span className={cn("block size-6 text-main-foreground", className)} aria-hidden="true">
          {getProfileIcon(name)}
        </span>
      </Link>
    </Button>
  );
};

export default Profile;
