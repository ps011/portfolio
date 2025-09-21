import { GetStaticProps } from "next";
import GitHubCalendar from "react-github-calendar";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async () => {
  const siteDataRes = await fetch(`${process.env.BASE_URL}/site-datas/`);
  const siteDataArray = await siteDataRes.json();

  const aboutRes = await fetch(`${process.env.BASE_URL}/abouts/`);
  const aboutDataArray = await aboutRes.json();

  if (!siteDataArray || siteDataArray.length === 0 || !siteDataArray[0]) {
    console.error("DevPage: Error fetching site data.");
    return { notFound: true };
  }
  const site = siteDataArray[0];

  if (!aboutDataArray || aboutDataArray.length === 0 || !aboutDataArray[0]) {
    console.error("DevPage: Error fetching about data.");
    return { notFound: true };
  }
  const about = aboutDataArray[0];

  return {
    props: {
      siteData: site,
      aboutData: about,
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
      <div className="container mx-auto p-4 bg-white dark:bg-tertiary-800 h-screen">
        <GitHubCalendar username="ps011" />
      </div>
    </>
  );
};

export default DevPage;
