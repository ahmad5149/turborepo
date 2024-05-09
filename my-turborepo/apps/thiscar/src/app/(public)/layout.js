import "bootstrap/dist/css/bootstrap.min.css";
import "../../contents/scss/variable.scss";
import "../../contents/scss/global_fonts.scss";
import "../../contents/scss/publicStyles.scss";
import Footer from "../../components/common/footer/Footer";
import Script from "next/script";
import { Header } from "../../components/common/header/Header";
import AppProvider from "../../StateManagement/AppProvider";
import PopUp from "../../components/common/popUp/PopUp";
import { useFlyoutPageContent, useMainPageContent, usePopoutContent } from "@/sanity/Sanity";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { appConfig } from "@/appConfig";
import { AuthProvider } from "@/components/auth";
import Flyout from "@/components/common/flyout/Flyout";

import GoogleAnalytics from "@/components/google-analytics";
import GoogleTags from "@/components/google-tags";
import GoogleAdTrack from "@/components/google-ad-track";
import { LoadTradePending } from "@/components/trade-pending/trade-pending-hook";
import { Shared } from "../../../../../packages/ui/src/Shared";

export const metadata = {
    title: "THISCar",
    description: "THISCar"
};
export default async function RootLayout({ children }) {
    const pageData = await useMainPageContent();
    const PopUpData = await usePopoutContent();
    const FlyoutData = await useFlyoutPageContent();
    const sellClearCar =
        "!(function (d) {var e = 'https://drvtrd-widget.netlify.app/drivably.js';if (!d.querySelector(`[src='${e}']`)) {var t = d.createElement('script');(t.src = e), (t.defer = !0), (t.async = !0), d.body.append(t);}})(document);";
    const routes = [
        "/",
        "/about",
        "/personal-shopper",
        "/find-your-ride",
        "/sell",
        "/sell-trade",
        "/how-it-works",
        "/faqs",
        "/careers",
        "/support",
        "/cars",
        "/cars/",
        "/privacy",
        "/signup",
        "/login",
        "/finish-signup",
        "/terms",
        "/cookies-policy",
        "/studio",
        "/vehicle-value",
        "/carpro-appraisal-pro/thank-you"
    ];
    return (
        <html lang="en">
            <head>
                <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" />
                <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js" />
                <Script
                    src="https://content-container.edmunds.com/1945075.js"
                    type="text/javascript"
                    async
                />
                {/* Meta Pixel Code  */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2473374326154638');
fbq('track', 'PageView');
`
                    }}
                />
                <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                        __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "kf9yv3auxt");`
                    }}
                />
                <script src={`https://www.google.com/recaptcha/api.js?render=${appConfig.RECAPTCHA_SITE_KEY}`} />
                <Script
                    src="https://iatdnistorage.blob.core.windows.net/javascripts/21123_thiscar.com.min.js"
                    async
                />

                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src="https://www.facebook.com/tr?id=2473374326154638&ev=PageView&noscript=1"
                    />
                </noscript>
                {/* End of Meta Pixel Code */}
            </head>

            <body>
                {appConfig.ANALYTICS_ID ? <GoogleAnalytics ga_id={appConfig.ANALYTICS_ID} /> : null}
                {appConfig.GOOGLE_AW_ID ? <GoogleTags gtag_aw_id={appConfig.GOOGLE_AW_ID} /> : null}
                {appConfig.GOOGLE_AD_ID ? <GoogleAdTrack gtag_ad_id={appConfig.GOOGLE_AD_ID} /> : null}
                <Shared />
                <AppProvider routes={routes}>
                    <AuthProvider>
                        {/* <RecaptchaProviders> */}
                        {pageData && (
                            <Header
                                header={pageData.header}
                                hamBurgerCopyRight={pageData.hamburger}
                            />
                        )}

                        {PopUpData && <PopUp popupHeadlines={PopUpData.popUp} />}
                        {FlyoutData && <Flyout FlyoutData={FlyoutData.flyOut} />}
                        {children}
                        {pageData && (
                            <Footer
                                headerData={pageData.header}
                                footerData={pageData.footer}
                            />
                        )}
                        {/* </RecaptchaProviders> */}
                    </AuthProvider>
                    <LoadTradePending />
                </AppProvider>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.ignitifySettings = { ignitifyId: "ec6dc474-a763-4b84-816e-a26a74949269"};`
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function () { var w = window; var ic = w.Ignitify; if (typeof ic === 'function') { ic('reattach_activator'); ic('update', w.ignitifySettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Ignitify = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://ignitify-tagmanager-scripts.drivecentric.io/prod/ignitify-tagmanager.js'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (document.readyState === 'complete') { l(); } else if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();`
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: sellClearCar
                    }}
                />
            </body>
        </html>
    );
}
