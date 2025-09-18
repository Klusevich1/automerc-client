import { FC } from "react";
import Head from "next/head";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  breadcrumbsSchema?: ListItem[];
};

export interface ListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  breadcrumbsSchema,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={canonical} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DigitalDevils",
            url: "https://digitaldevils.by",
            logo: "/resources/logo-header.png",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "WebSite",
            name: "DigitalDevils",
            url: "https://digitaldevils.by",
          }),
        }}
      />
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbsSchema,
            }),
          }}
        />
      )}
    </Head>
  );
};

export default SEO;
