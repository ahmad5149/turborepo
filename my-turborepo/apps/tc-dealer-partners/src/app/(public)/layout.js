import "bootstrap/dist/css/bootstrap.min.css";
import "../../contents/scss/variable.scss";
import "../../contents/scss/global_fonts.scss";
import Footer from "../../components/common/footer/Footer";
import Script from "next/script";
import { Header } from "../../components/common/header/Header";
import AppProvider from "../../StateManagement/AppProvider";
import { useMainPageContent, useOffsiteContent } from "../../sanity/Sanity";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { appConfig } from "../../appConfig";
import { AuthProvider } from "../../components/auth";
import GoogleAnalytics from "../../components/google-analytics";
import GoogleTags from "../../components/google-tags";
import GoogleAdTrack from "../../components/google-ad-track";
export const metadata = {
    title: "Partners Inventory",
    description: "THIScar Partners Inventory"
};

export default async function RootLayout({ children }) {
    const pageData = await useMainPageContent();
    const offsiteData = await useOffsiteContent();
    const routes = ["/", "/about", "/support", "/cars", "/cars/", "/privacy", "/login", "/terms", "/cookies-policy"];
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    media="all"
                    href="https://cdn.auto-dash.com/dygen/seo/css/dealers/thiscar.min.css"
                />
                <script src={`https://www.google.com/recaptcha/api.js?render=${appConfig.RECAPTCHA_SITE_KEY}`} />
            </head>

            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
                crossOrigin="anonymous"
            />

            <Script src="https://firebasestorage.googleapis.com/v0/b/tc-production-390801.appspot.com/o/Scripts%2Foffsite-script.js?alt=media&token=c7770529-054c-4521-8a97-7c3d66c84eba" />

            <body className={""}>
                {appConfig.ANALYTICS_ID ? <GoogleAnalytics ga_id={appConfig.ANALYTICS_ID} /> : null}
                {appConfig.GOOGLE_AW_ID ? <GoogleTags gtag_aw_id={appConfig.GOOGLE_AW_ID} /> : null}
                {appConfig.GOOGLE_AD_ID ? <GoogleAdTrack gtag_ad_id={appConfig.GOOGLE_AD_ID} /> : null}
                {/* <button id="openPopupButton">Open Popup</button> */}
                <AppProvider routes={routes}>
                    <AuthProvider>
                        {/* <RecaptchaProviders> */}
                        {pageData && (
                            <Header
                                header={pageData.header}
                                hamBurgerCopyRight={pageData.hamburger}
                                offsiteText={offsiteData}
                            />
                        )}

                        {/*PopUpData && <PopUp popupHeadlines={PopUpData.popUp} /> */}
                        {/* FlyoutData && <Flyout FlyoutData={FlyoutData.flyOut} /> */}
                        {/*FlyoutData && (
              <ChatButton ChatFlyoutData={FlyoutData.chatButton} />
            ) */}
                        {children}
                        {pageData && (
                            <Footer
                                headerData={pageData.header}
                                footerData={pageData.footer}
                            />
                        )}
                        {/* </RecaptchaProviders> */}
                    </AuthProvider>
                </AppProvider>
            </body>
        </html>
    );
}
