import Script from "next/script";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const umamiHost = process.env.NEXT_PUBLIC_UMAMI_HOST;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiDomains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  return (
    <>
      {children}

      {umamiHost && umamiWebsiteId && (
        <Script
          async
          src={`https://${umamiHost}/script.js`}
          data-website-id={umamiWebsiteId}
          data-domains={umamiDomains}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
