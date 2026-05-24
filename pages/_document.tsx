import { Html, Head, Main, NextScript } from "next/document";
import { themePresets } from "@prasheel/ui";

const themePresetsJson = JSON.stringify(themePresets);

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var presets = ${themePresetsJson};
  var themeId = localStorage.getItem('portfolio-theme') || 'blue';
  var darkMode = localStorage.getItem('portfolio-dark-mode') === 'true';
  var theme = presets[themeId] || presets.blue;
  var vars = darkMode ? theme.dark : theme.light;
  var root = document.documentElement;
  for (var key in vars) root.style.setProperty(key, vars[key]);
  root.classList.toggle('dark', darkMode);
})();
            `.trim(),
          }}
        />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </Head>
        <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <Main/>
        <NextScript />
      </body>
    </Html>
  );
}
