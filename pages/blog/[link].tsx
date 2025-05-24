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
        <article className="flex flex-col">
            <div className="mb-8 relative">
                <Image height={0} width={0} src={banner} alt="Post" className="w-full max-h-[650px] object-cover m-0"
                       sizes="100vw"/>
                <h1 className="absolute left-0 right-0 -bottom-4 text-white p-12 rounded-tl-[155px] bg-gradient-to-t from-black/75 to-white/75">{title}</h1>
            </div>
            <div className="container">
                <div className="mb-8 text-md">
                    <a className="text-primary-100" href={profileLink}>{author}</a>
                    <p className="italic my-2">{new Date(date).toUTCString()}</p>
                </div>
                <MarkdownRenderer content={content}/>
                <div className="mt-8">
                    <span>Share this Post:</span>
                    <div className="flex justify-flex-start mt-4">
                        {shareArticleList.map((share) => (
                            <Profile key={share.name} url={share.url} name={share.name} className="w-8 mr-4"/>
                        ))}
                    </div>
                </div>
            </div>
        </article>
        </>
    );
};
export default Blog;
