import Link from "next/link";
import Image from "next/image";
import Badge from "../tailwind/badge";
import Button from "../tailwind/button";

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
        <div
            className="tw-flex tw-flex-col tw-shadow-md tw-border-0 tw-m-2 tw-p-4 tw-h-full tw-bg-neutral-100 tw-rounded-md tw-items-stretch dark:tw-bg-gray-600 dark:tw-text-white dark:tw-shadow-gray-900"
            data-aos="flip-right">
            <div>
                {thumbnail
                    ? (
                        <div className="tw-mb-4">
                            <Image
                                src={thumbnail}
                                alt={`Blog ${title} Description`}
                                width={0}
                                height={0}
                                sizes="40vw"
                                className="tw-w-full tw-h-48 tw-rounded-md tw-object-cover"
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
                                    (tag) => <Badge text={tag} className="tw-mr-2 dark:tw-bg-dark-primary-300" key={tag}/>
                                )
                                : ""}
                    </div>
                </div>
            </div>
            <Button role="primary" fullWidth className="tw-mt-4">
                <Link href={getLink(link)} target="_blank">
                    Read more
                </Link>
            </Button>
        </div>
    );
};

export default Card;
