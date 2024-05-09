import Script from "next/script";

export default function GTagLead({ gtag_lead_id }) {
  return (
    <>
      <Script
        id="google-lead-conversion"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gtag_lead_id}');`,
        }}
      />
    </>
  );
}