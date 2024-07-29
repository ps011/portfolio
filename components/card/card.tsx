import Link from "next/link";
import Image from "next/image";
import Badge from "../tailwind/badge";

interface CardProps {
    thumbnail: string;
    title: string;
    shortDescription: string;
    tags: string;
    link: string;
}

const Card = ({
                  thumbnail, title, shortDescription, tags, link,
              }: CardProps) => {
    let tagsArray: string[] = [];
    if (tags) {
        if (typeof tags === "string") {
            tagsArray = tags.split(",");
        } else {
            tagsArray = tags;
        }
    }

    const getLink = (link: string) => {
        if (link.startsWith("http")) {
            return link;
        } else {
            return `/blog/${link}`;
        }
    };

    return (
        <div className="tw-flex tw-flex-col tw-shadow-md tw-border-0 tw-m-2 tw-p-4 tw-h-full tw-bg-neutral-100 tw-rounded-md tw-items-stretch" data-aos="flip-right">
            {thumbnail
                ? (
                    <div className="tw-mb-4">
                        <Image
                            src={thumbnail}
                            alt={`Blog ${title} Description`}
                            width={0}
                            height={100}
                            sizes="40vw"
                            className="tw-w-full tw-h-48"
                        />
                    </div>
                ) : (
                    <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                        <i className="ni ni-check-bold"/>
                    </div>
                )}
            <div>
                <h6 className="tw-text-primary tw-uppercase">{title}</h6>
                <p className="tw-mt-3">{shortDescription}</p>
                <div>
                    {
                        tagsArray.length ?
                            tagsArray.map(
                                (tag) => <Badge text={tag} className="tw-mr-2" key={tag}/>
                            )
                            : ""}
                </div>
            </div>
            <Link href={getLink(link)} className="btn btn-primary mt-4" target="_blank">
                Read more
            </Link>
        </div>
    );
};

export default Card;
