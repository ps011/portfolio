import Document, {
  Html, Head, Main, NextScript,
} from "next/document";
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import { GA_TRACKING_ID } from "../lib/gtag";

const isProduction = process.env.NODE_ENV === "production";

export default class MyDocument extends Document {
  render() {
    return (
      <Html {...mantineHtmlProps}>
        <Head>
            <ColorSchemeScript defaultColorScheme="auto" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap"
                  rel="stylesheet" />
          {/* enable analytics script only for production */}
          {isProduction && (
              <>
                  <script
                      async
                      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                  />
                  <script
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                      }}
                  />
                  <script
                      src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer.min.js" async></script>
              </>
          )}
        </Head>
          <body className="dark:bg-gray-700">
          <Main/>
          <NextScript />
        </body>
      </Html>
    );
  }
}
