import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@prasheel/ui";

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    messages: (await import(`../messages/${context.locale ?? "en"}.json`))
      .default,
  },
});

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page not found | Prasheel Soni</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-base border-2 border-border bg-secondary-background p-6 text-center shadow-shadow">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            404
          </p>
          <h1 className="mt-2 text-3xl font-black text-foreground">
            Page not found
          </h1>
          <div className="mt-6 flex justify-center">
            <Button asChild>
              <Link href="/" className="no-underline">
                <ArrowLeft className="size-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
