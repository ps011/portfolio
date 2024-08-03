import Image from "next/image";
import {useEffect, useState} from "react";
import Section from "../tailwind/section";
import Button from "../tailwind/button";

type InstagramPost = {
    id: string;
    caption: string;
    media_url: string;
    media_type: string;
    timestamp: string;
    permalink: string;
}

type InstagramPaging = {
    cursors: {
        before: string;
        after: string;
    }
}

type InstagramFeed = {
    data: InstagramPost[];
    paging?: InstagramPaging;
}

export default function Instagram() {
    const [instagramFeed, setInstagramFeed] = useState<InstagramFeed | null>(null);
    const [after, setAfter] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchFeed = async (after: string | null = null) => {
        try {
            let url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp,permalink&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN}`;
            if (after) {
                url += `&after=${after}`;
            }
            const data = await fetch(url);

            if (!data.ok) {
                throw new Error("Failed to fetch Instagram feed");
            }

            const feed = await data.json();

            setInstagramFeed(prevFeed => {
                if (prevFeed && prevFeed.data.length > 0) {
                    return {
                        ...feed,
                        data: [...prevFeed.data, ...feed.data],
                    };
                }
                return feed;
            });
            setAfter(feed.paging?.cursors.after);
        } catch (err: any) {
            console.error("Error fetching Instagram feed:", err.message);
            setError(err.message);
        }
    };

    const loadMore = () => {
        fetchFeed(after);
    };

    // Fetch the initial feed
    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <>
            {error && <p className="text-red-500">{error}</p>}

            {instagramFeed && (
                <Section id="photo-gallery" heading="Instagram Feed">
                    <div className="tw-flex tw-flex-wrap tw-justify-center">
                        {instagramFeed.data.map((post: InstagramPost) => (
                            <div key={post.id} className="tw-max-h-96 tw-max-w-96 tw-p-4">
                                {post.media_type === "VIDEO" ? (
                                    <video
                                        src={post.media_url}
                                        controls={false}
                                        className="tw-w-full tw-h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={post.media_url}
                                        alt={post.caption ?? ""}
                                        className="tw-w-full tw-h-full tw-object-cover  tw-rounded-md"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {after && <Button className="tw-block tw-mx-auto tw-mt-8" role="primary" onClick={loadMore}>Load More</Button>}
                </Section>
            )}
        </>
    );
}
