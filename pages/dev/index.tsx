import { GetStaticProps } from "next";
import { GitHubCalendar } from "react-github-calendar";
import Head from "next/head";
import { getSiteData, getAboutData } from "../../lib/data";

export const getStaticProps: GetStaticProps = async (context) => {
  const [siteData, aboutData] = await Promise.all([
    getSiteData(),
    getAboutData(),
  ]);

  if (!siteData) {
    console.error("DevPage: Error fetching site data.");
    return { notFound: true };
  }

  if (!aboutData) {
    console.error("DevPage: Error fetching about data.");
    return { notFound: true };
  }

  return {
    props: {
      siteData,
      aboutData,
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
    revalidate: 3600,
  };
};

const DevPage = () => {
  return (
    <>
      <Head>
        <title>Dev | Prasheel Soni</title>
      </Head>
      <div className="container mx-auto p-4 bg-white dark:bg-neutralGray-800 h-screen">
        <GitHubCalendar username="ps011" />
      </div>
    </>
  );
};

export default DevPage;
