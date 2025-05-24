import Github from "../icons/github";
import Link from "next/link";
import Linkedin from "../icons/linkedin";
import X from "../icons/x";
import Facebook from "../icons/facebook";
import Instagram from "../icons/instagram";
import Stackoverflow from "../icons/stackoverflow";

interface ProfileProps {
    url: string;
    name: string;
    className?: string;
}

const Profile = ({url, name, className}: ProfileProps) => {

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
        <Link 
            href={url} 
            key={name} 
            target="_blank" 
            rel="noreferrer"
            className={`${className || ''} dark:text-white inline-block`}
        >
            <span className="block w-6 h-6"> 
                {getProfileIcon(name)}
            </span>
        </Link>
    );
};

export default Profile;
