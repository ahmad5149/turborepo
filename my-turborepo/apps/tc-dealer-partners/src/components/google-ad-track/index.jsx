import Script from "next/script";

export default function GoogleAdTrack({ gtag_ad_id }) {
  return (
    <>
      <Script
        id="google-ad-track"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtag_ad_id}');
        `,
        }}
      />
      <noscript><Script id="google-ad-track"
        async
        src={`https://www.googletagmanager.com/ns.html?id=${gtag_ad_id}`}
      />
      </noscript>
    </>
  );
}