import Link from "next/link";
import Image from "next/image";
import { Text, Title, Box } from "@mantine/core";
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
        tagsArray = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim());
    }

    const getLink = (link: string) => {
        if (link.startsWith("http")) {
            return link;
        } else {
            return `/blog/${link}`;
        }
    };

    const heightWithThumbnail = "430px";
    const heightWithoutThumbnail = "280px";

    return (
        <Box
            className="flex flex-col shadow-md border-0 m-2 p-4 bg-neutral-100 rounded-md dark:bg-neutralGray-700 dark:text-white dark:shadow-gray-900"
            style={{ height: thumbnail ? heightWithThumbnail : heightWithoutThumbnail }}
        >
            <Box style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {thumbnail && (
                    <div className="mb-4">
                        <Image
                            src={thumbnail}
                            alt={`Blog ${title} Description`}
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-48 rounded-md object-cover"
                        />
                    </div>
                )}
                <Box style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" /* minHeight removed as parent has fixed height now */ }}>
                    <div>
                        <Title order={6} className="text-primary uppercase" mb="xs">{title}</Title>
                        <Text size="sm" lineClamp={3} mb="sm">{shortDescription}</Text>
                        <div>
                            {
                                tagsArray.length ?
                                    tagsArray.map(
                                        (tag) => <Badge text={tag} className="mr-2 dark:bg-dark-primary-300" key={tag}/>,
                                    )
                                    : ""}
                        </div>
                    </div>
                    <Button variant="filled" fullWidth>
                        <Link href={getLink(link)} target="_blank">
                            Read more
                        </Link>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Card;
