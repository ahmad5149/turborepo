import Script from "next/script";

export default function GoogleTags({ gtag_aw_id }) {
  return (
    <>
      <Script id="google-tags"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag_aw_id}`}
      />
      <Script
        id="google-tags"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gtag_aw_id}');`,
        }}
      />
    </>
  );
}