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
                return <Github/>;
            case "linkedin":
                return <Linkedin/>;
            case "twitter":
                return <X/>;
            case "facebook":
                return <Facebook/>;
            case "instagram":
                return <Instagram/>;
            case "stackoverflow":
                return <Stackoverflow/>;
            default:
                return <Github/>;
        }
    };

    return <Link href={url} key={name} target="_blank" rel="noreferrer"
                 className={`${className} tw-max-h-8`}>
        {getProfileIcon(name)}
    </Link>;
};

export default Profile;
