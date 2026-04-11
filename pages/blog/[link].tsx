import dynamic from "next/dynamic";
import Image from "next/image";
import Profile from "../../components/profile/profile";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { getSiteData, getAboutData, getBlogs, getBlogByLink } from "../../lib/data";

const MarkdownRenderer = dynamic(() => import("../../components/markdown-renderer/markdown-renderer"), { ssr: true });

export async function getStaticProps(context) {
    const link = context.params.link as string;

    if (!link || link.startsWith("http")) {
        return { notFound: true };
    }

    const [siteData, aboutData, blogPost] = await Promise.all([
        getSiteData(),
        getAboutData(),
        getBlogByLink(link),
    ]);

    if (!blogPost || Object.keys(blogPost).length === 0) {
        console.error(`Blog [${link}]: Blog post not found or empty.`);
        return { notFound: true };
    }

    if (!siteData) {
        console.error(`Blog [${link}]: Error fetching site data.`);
        return { notFound: true };
    }

    if (!aboutData) {
        console.error(`Blog [${link}]: Error fetching about data.`);
        return { notFound: true };
    }

    return {
        props: {
            siteData,
            aboutData,
            blogPost,
            messages: (await import(`../../messages/${context.locale}.json`)).default,
        },
        revalidate: 3600,
    };
}

export async function getStaticPaths() {
    const posts = await getBlogs();
    const validPaths = posts
        .filter((post) => post.link && !post.link.startsWith("http"))
        .map((post) => ({ params: { link: post.link } }));
    return {
        paths: validPaths,
        fallback: "blocking",
    };
}

interface SingleBlogPageProps {
    blogPost: {
        title: string;
        banner: string;
        profileLink: string;
        author: string;
        date: string;
        content: string;
    };
    // siteData and aboutData are used by _app/Layout, not directly needed here
}

const SingleBlogPage = ({ blogPost }: SingleBlogPageProps) => {
    const router = useRouter();
    const t = useTranslations("blog");
    if (!blogPost || Object.keys(blogPost).length === 0) { // Robust check for blogPost
        return <p>{t("loading")}</p>;
    }

    const { title, banner, profileLink, author, date, content } = blogPost;
    const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${router.asPath}`;
    const fbSharingUrl = `https://www.facebook.com/sharer.php?u=${currentUrl}`;
    const twitterSharingUrl = `https://twitter.com/intent/tweet?&url=${currentUrl}`;
    const linkedinSharingUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`;

    const shareArticleList = [
        { name: "facebook", url: fbSharingUrl },
        { name: "x", url: twitterSharingUrl },
        { name: "linkedin", url: linkedinSharingUrl },
    ];

    return (
        <>
            <title>{title}</title>
            <article className="flex flex-col">
                <div className="mb-8 relative">
                    <Image height={0} width={0} src={banner} alt={`Banner for ${title}`} className="w-full max-h-[650px] object-cover m-0" sizes="100vw"/>
                    <h1 className=" text-4xl font-bold absolute left-0 right-0 -bottom-4 text-white p-12 rounded-tl-[155px] bg-gradient-to-t from-black/75 to-white/75">{title}</h1>
                </div>
                <div className="container">
                    <div className="mb-8 text-md">
                        <a className="text-neutralGray-900 dark:text-white" href={profileLink} target="_blank" rel="noopener noreferrer">{author}</a>
                        <p className="italic my-2 text-neutralGray-900 dark:text-white">{new Date(date).toUTCString()}</p>
                    </div>
                    <MarkdownRenderer content={content}/>
                    <div className="mt-8">
                        <span className="text-neutralGray-900 dark:text-white">{t("sharePost")}</span>
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
export default SingleBlogPage;
