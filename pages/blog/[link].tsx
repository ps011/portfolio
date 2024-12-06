import dynamic from "next/dynamic";

const MarkdownRenderer = dynamic(() => import("../../components/markdown-renderer/markdown-renderer"), { ssr: false });
import Image from "next/image";
import Profile from "../../components/profile/profile";
import {useRouter} from "next/router";

export async function getStaticProps(context) {
    if (!context.params.link.startsWith("http")) {
        let data = await fetch(`${process.env.BASE_URL}/blogs/${context.params.link}`);
        data = await data.json();
        return {props: data};
    }
    return {props: {}};
}

export async function getStaticPaths() {
    const data = await fetch(`${process.env.BASE_URL}/blogs`);
    const posts = await data.json();
    return {
        paths: posts.map((post) => ({
            params: {
                link: post.link,
            },
        })),
        fallback: false,
    };
}

interface BlogProps {
    title: string;
    banner: string;
    profileLink: string;
    author: string;
    date: string;
    content: string;
}

const Blog = ({
                  title, banner, profileLink, author, date, content,
              }: BlogProps) => {
    const router = useRouter();
    const currentUrl = `${process.env.BASE_URL}${router.asPath}`;
    const fbSharingUrl = `https://www.facebook.com/sharer.php?u=${currentUrl}`;
    const twitterSharingUrl = `https://twitter.com/intent/tweet?&url=${currentUrl}`;
    const linkedinSharingUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`;

    const shareArticleList = [
        {
            name: "facebook",
            url: fbSharingUrl,
        },
        {
            name: "x",
            url: twitterSharingUrl,
        },
        {
            name: "linkedin",
            url: linkedinSharingUrl,
        },
    ];

    return (
        <>
            <title>{title} by {author}</title>
        <article className="tw-flex tw-flex-col">
            <div className="tw-mb-8 tw-relative">
                <Image height={0} width={0} src={banner} alt="Post" className="tw-w-full tw-max-h-[650px] tw-object-cover tw-m-0"
                       sizes="100vw"/>
                <h1 className="tw-absolute tw-left-0 tw-right-0 tw--bottom-4 tw-text-white tw-p-12 tw-rounded-tl-[155px] tw-bg-gradient-to-t tw-from-black/75 tw-to-white/75">{title}</h1>
            </div>
            <div className="tw-container">
                <div className="tw-mb-8 tw-text-md">
                    <a className="tw-text-primary-100" href={profileLink}>{author}</a>
                    <p className="tw-italic tw-my-2">{new Date(date).toUTCString()}</p>
                </div>
                <MarkdownRenderer content={content}/>
                <div className="tw-mt-8">
                    <span>Share this Post:</span>
                    <div className="tw-flex tw-justify-flex-start tw-mt-4">
                        {shareArticleList.map((share) => (
                            <Profile key={share.name} url={share.url} name={share.name} className="tw-w-8 tw-mr-4"/>
                        ))}
                    </div>
                </div>
            </div>
        </article>
        </>
    );
};
export default Blog;
