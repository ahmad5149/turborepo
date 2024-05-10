import Script from "next/script";

export default function GoogleAnalytics({ ga_id }) {
    return (
        <>
            <Script
                id="google-analytics"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
            />
            <Script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${ga_id}');`
                }}
            />
        </>
    );
}

export function GAEvent({ action, category, label }) {
    window.gtag("event", action, {
        event_category: category,
        event_label: label
    });
}
