import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <Html lang="ru">
      <Head>
        <link rel="preload" href="/styles/fonts.css" as="style" />
        <link rel="stylesheet" href="/styles/fonts.css" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
