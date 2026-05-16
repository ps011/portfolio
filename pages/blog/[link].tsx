import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Profile from "../../components/profile/profile";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
}

const formatDate = (iso: string, locale: string) => {
    try {
        return new Date(iso).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
    } catch {
        return iso;
    }
};

const LOCALE_MAP: Record<string, string> = { en: "en-US", hi: "hi-IN" };

const SingleBlogPage = ({ blogPost }: SingleBlogPageProps) => {
    const router = useRouter();
    const t = useTranslations("blog");
    const dateLocale = LOCALE_MAP[router.locale ?? "en"] ?? "en-US";
    if (!blogPost || Object.keys(blogPost).length === 0) {
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
            <Head>
                <title>{`${title} | Prasheel Soni`}</title>
            </Head>
            <div className="bg-background min-h-screen pb-16">
                <div className="container mx-auto px-4 pt-6">
                    <Button variant="neutral" size="sm" asChild>
                        <Link href="/blog" className="no-underline">
                            <ArrowLeft className="size-4" />
                            {t("backToIndex")}
                        </Link>
                    </Button>
                </div>

                <article className="container mx-auto px-4 pt-6">
                    {banner && (
                        <div className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-base border-3 border-border shadow-shadow">
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src={banner}
                                    alt={`Banner for ${title}`}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <header className="mx-auto mb-8 max-w-3xl">
                        <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-base border-3 border-border bg-secondary-background px-4 py-3 shadow-shadow">
                            <a
                                href={profileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-foreground underline decoration-2 underline-offset-2 hover:opacity-70"
                            >
                                {author}
                            </a>
                            <span aria-hidden="true" className="text-muted-foreground">•</span>
                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CalendarDays className="size-4" />
                                {formatDate(date, dateLocale)}
                            </span>
                        </div>
                    </header>

                    <div className="mx-auto max-w-3xl">
                        <MarkdownRenderer content={content} />
                    </div>

                    <footer className="mx-auto mt-12 max-w-3xl">
                        <div className="rounded-base border-3 border-border bg-secondary-background p-5 shadow-shadow">
                            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">
                                {t("sharePost")}
                            </p>
                            <div className="flex items-center gap-3">
                                {shareArticleList.map((share) => (
                                    <Profile
                                        key={share.name}
                                        url={share.url}
                                        name={share.name}
                                        className="w-8"
                                    />
                                ))}
                            </div>
                        </div>
                    </footer>
                </article>
            </div>
        </>
    );
};
export default SingleBlogPage;
