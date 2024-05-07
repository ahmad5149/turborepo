"use client";
import React, { useState, useEffect } from "react";
import "../../contents/scss/cookies.scss";
import Link from "next/link";

function CookiesPolicy() {
    const [playSound, setPlaySound] = useState(true);
    useEffect(() => {
        new Audio("/media/cookies-eating.mp3").play();
    }, [playSound]);
    return (
        <>
            <div className="cookies-policy">
                <div className="Cookies_container pt-5 pb-3">
                    <div>
                        <h3 className="d-flex justify-content-start title">THIScar, LLC Cookies Policy</h3>
                        <span>Effective January 1, 2023</span>
                    </div>
                    <br />
                    <h5>Cookies, Tracking Pixels, Like Technologies and Third-Party Links</h5>
                    <p>
                        This Cookie Policy (“Cookie Policy”) explains how THIScar, LLC (“THIScar” or “we” or “our”) (and
                        third-party service providers acting on our behalf or on their own behalf) use cookies, web
                        beacons, tracking pixels and similar tracking technologies to collect or process personal
                        information when you interact with our website, any associated mobile sites, services,
                        applications, platforms or in person at one of our onsite facilities. This Cookie Policy
                        provides more information about these technologies and your choices regarding these
                        technologies. This Cookie Policy is also included in our Privacy Policy available{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/privacy"
                            aria-label="Privacy policy">
                            here
                        </Link>
                        .
                        <br />
                        Cookies are small text files that store information on your computer hard drive or browser. We
                        use cookies and other automated tools such as tracking pixels to improve the experience of the
                        site and services, such as saving your preferences from visit to visit or to present you with a
                        customized version of our website. Many web browsers are initially set up to accept cookies. By
                        agreeing to the use of cookies on our website, you are consenting to the disclosure of your
                        personal information and data to our third-party service providers for these purposes. You can
                        reset your web browser to refuse all cookies or to indicate when a cookie is sent.
                        <br />
                        Additionally, we employ software technology that enables us to track certain aspects of a user's
                        visit to our website. This technology assists us to better manage content on the website by
                        informing us what content is effective, how consumers engage with the site, and how consumers
                        arrive at and/or depart from our website.
                    </p>
                    <div className="mt-3">
                        <h5>Types of Cookies</h5>
                        <p className="mb-0">
                            Our website and services use the following types of cookies for these purposes:
                        </p>
                        <ul className="list-ul ml-10">
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Strictly Necessary Cookies
                                </label>{" "}
                                : These cookies are required for service functionality, including for system
                                administration, security, and fraud prevention, or to enable purchasing capabilities.
                                You can set your browser to block these cookies, but some parts of the site may not
                                function properly.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Information Storage and Access
                                </label>{" "}
                                : These cookies allow us and our partners to store and access information on the device,
                                such as device identifiers.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Measurement and Analytics
                                </label>{" "}
                                : These cookies collect data regarding your usage of and performance of the services,
                                apply market research to generate audiences, and measure the delivery and effectiveness
                                of content and advertising. We and our third-party vendors use these cookies to perform
                                analytics, so we can improve the content and user experience, develop new products and
                                services, and for statistical purposes. These cookies are also used to recognize you and
                                provide further insights across platforms and devices for the above purposes.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Personalization Cookies
                                </label>{" "}
                                : These cookies enable us to provide certain features, such as determining if you are a
                                first-time visitor, capping message frequency, remembering choices you have made (e.g.,
                                your language preferences, time zone), and assist you with logging in after registration
                                (including across platforms and devices). These cookies also allow your device to
                                receive and send information so you can see and interact with ads and content.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Content Selection and Delivery Cookies
                                </label>{" "}
                                : Data collected under this category can also select and deliver personalized content,
                                such as news articles and videos.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Ad Selection and Delivery Cookies
                                </label>{" "}
                                : These cookies collect data about your browsing habits, your use of the services, your
                                preferences, and your interaction with advertisements across platforms and devices for
                                the purpose of delivering interest-based advertising content on the Services and on
                                third-party sites. Third-party sites and services also use interest-based Advertising
                                cookies to deliver content, including advertisements relevant to your interests on the
                                services and third-party services. If you reject these cookies, you may see contextual
                                advertising that may be less relevant to you.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Social Media Cookies
                                </label>{" "}
                                : These cookies are set by social media platforms on the services to enable you to share
                                content with your friends and networks. Social media platforms can track your online
                                activity outside of the Services. This may impact the content and messages you see on
                                other services you visit.
                            </li>
                        </ul>
                    </div>

                    <div className="mt-3">
                        <h5>Types of Tracking Technologies</h5>
                        <p className="mb-0">Our software typically uses two methods to track user activity:</p>
                        <ul className="list-ul ml-10">
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Tracking Pixels
                                </label>{" "}
                                : Pieces of executable code embedded in a web page that track usage activity including
                                the pages users view, when users view pages, and how long pages are viewed.
                            </li>
                            <li>
                                <label
                                    data-v-67eec9a8=""
                                    className="underline">
                                    Clear Gifs
                                </label>{" "}
                                : Tiny graphics with unique identifiers embedded in web pages and email messages that
                                track whether a user has viewed a particular web page or email message. User activity
                                information may be associated with additional information about a user's session and
                                personal.
                            </li>
                        </ul>
                    </div>

                    <div className="mt-3">
                        <h5>COOKIE MANAGEMENT</h5>
                        <p className="mb-0">
                            You can manage your cookies and choose your cookie preferences via the “cookie banner” when
                            you initially visit our website. You can also use the methods described below to manage
                            cookies. Cookie preferences and management choices are device and browser specific;
                            therefore, you will need to set opt-out preferences for each device and browser. If you
                            replace, change, or upgrade your browser or device, or delete your cookies, you may need to
                            use these opt-out tools again. Cookie management solutions may also rely on cookies. Please
                            adjust your browser cookie settings carefully, following the relevant instructions below.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Browser Controls: </span>
                            You may be able to disable and manage certain cookies through your browser settings. If you
                            use multiple browsers on the same device, you will need to manage your settings for each
                            browser. Please refer to your browser’s help menu for information on how to manage cookies.
                            Please note that 1) certain features of our website may not work if you delete or disable
                            cookies, and 2) disabling cookies will not disable other analytics tools we may use to
                            collect information about you or your use of our Services.
                        </p>

                        <p className="mb-0">
                            <span className="sub-title">Analytics Provider Opt-Outs: </span>
                            To disable analytics cookies you can use the browser controls discussed above. Certain
                            providers have individual opt-out mechanisms:
                        </p>
                    </div>
                    <div className="mt-3 cookies-links">
                        <p className="mb-0">
                            Google’s Privacy Policy and{" "}
                            <Link
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://tools.google.com/dlpage/gaoptout"
                                aria-label="Privacy policy">
                                Google Analytics Opt-Out
                            </Link>
                            <br />
                            Omniture’s Privacy Policy and{" "}
                            <Link
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="http://www.adobe.com/privacy/opt-out.html"
                                aria-label="Privacy policy">
                                Omniture’s Opt-Out
                            </Link>
                            <br />
                            Mixpanel’s Privacy Policy and{" "}
                            <Link
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="http://www.adobe.com/privacy/opt-out.html"
                                aria-label="Privacy policy">
                                Omniture’s Opt-Out
                            </Link>
                        </p>
                    </div>
                    <div className="mt-3">
                        <p className="mb-0">
                            The above are examples of our analytics providers and this is not an exhaustive list. We are
                            not responsible for the effectiveness of any other providers opt-out mechanisms.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Flash Local Storage: </span>
                            These cookies are also known as local shared objects and may store your preferences or
                            display content by us, advertisers and other third parties. Flash cookies should be deleted
                            in the storage section of your Flash Player Settings Manager.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Interest-Based Advertising: </span>
                            We may contract with third-party advertisers, search providers, and ad networks
                            ("Advertisers") to learn more about you and show you ads or other content that we believe
                            would be relevant to you. Advertisers, too, may collect and use information about your use
                            of our website and services. These companies may use cookies and other online tracking
                            technologies to collect and use your information. Additionally, we may also append other
                            data to the data collected by Advertisers to create an interest profile of individual users.
                            For more information or to opt out of receiving interest-based advertising from
                            participating third-party advertisers, please visit Network Advertising Initiative (NAI).
                            Opt-outs are device and browser specific; therefore, you will need to set opt-out
                            preferences for each device and browser. Deleting browser cookies can remove your opt-out
                            preferences; The Digital Advertising Alliance (DAA) offers{" "}
                            <Link
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="http://www.aboutads.info/PMC"
                                aria-label="browser extensions">
                                browser extensions
                            </Link>
                            that help preserve the opt-out preferences you set via the DAA's Consumer Choice Page.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Third Parties that Collect Information on This Site: </span>
                            Certain third parties collect personal information and/or usage data from users of our
                            website using automatic information collection tools such as cookies and tracking pixels.
                            The collection, use, and disclosure of personal information and/or usage data by third
                            parties is governed by the third party’s Privacy Policy. Please refer to their privacy
                            policies for any questions you may have. This following list displays third parties and
                            third-party Privacy Policies may collect Personal Information via our website:
                        </p>
                        <table className="links">
                            <thead>
                                <tr>
                                    <th>Third Party</th>
                                    <th>Privacy Policy</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Facebook</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href="https://www.facebook.com/privacy/explanation"
                                            aria-label="Privacy policy">
                                            https://www.facebook.com/privacy/explanation
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Google</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href=" 	https://policies.google.com/privacy?fg=1"
                                            aria-label="Privacy policy">
                                            https://policies.google.com/privacy?fg=1
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Instagram</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href="https://help.instagram.com/519522125107875?helpref=page_content"
                                            aria-label="Privacy policy">
                                            https://help.instagram.com/519522125107875?helpref=page_content
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>LinkedIn</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href="https://www.linkedin.com/legal/privacy-policy"
                                            aria-label="Privacy policy">
                                            https://www.linkedin.com/legal/privacy-policy
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pinterest</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href=" 	https://policy.pinterest.com/en/privacy-policy"
                                            aria-label="Privacy policy">
                                            https://policy.pinterest.com/en/privacy-policy
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Twitter</td>
                                    <td>
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            href=" 	https://twitter.com/en/privacy"
                                            aria-label="Privacy policy">
                                            https://twitter.com/en/privacy
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mb-0">
                            Please note that we are not responsible for the effectiveness of advertising providers
                            opt-out mechanisms and that opting out does not prevent you from seeing our online
                            advertisements.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Mobile Settings: </span>
                            You may manage the collection of information for interest-based advertising purposes in
                            mobile apps via the device’s settings, including managing the collection of location data.
                            To opt out of mobile ad tracking from Nielsen or other third- parties, you can do so by
                            selecting the “Limit Ad Tracking” (for iOS devices) or “Opt-out of Ads Personalization” (for
                            Android devices) options in your device settings.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Connected Devices: </span>
                            For connected devices, such as smart TVs or streaming devices, you should review the
                            device’s settings and select the option that allows you to disable automatic content
                            recognition or ad tracking. Typically, to opt out, such devices require you to select
                            options like “limit ad tracking” or to disable options such as “interest-based advertising,”
                            “interactive TV,” or “smart interactivity.” These settings vary by device type.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Cross-Device Tracking: </span>
                            If you would like to opt out of our browser-based cross-device tracking for advertising
                            purposes, you may do so by using the various methods described above. You must opt out
                            separately on each device and each browser that you use. For more information about
                            cross-device matching, please visit the Network Advertising Initiative or the Digital
                            Advertising Alliance. If you opt out of cross-device tracking for advertising purposes, we
                            may still conduct cross-device tracking for other purposes, such as analytics.
                        </p>
                        <p className="mb-0">
                            <span className="sub-title">Consequences of Deactivation of Cookies: </span>
                            If you disable or remove cookies, some parts of the services may not function properly.
                            Information may continue to be collected and used for other purposes, such as research,
                            online services analytics, or internal operations, and remember opt-out preferences. THIScar
                            values your privacy and is committed to protecting your personal information. Personal
                            information collected through cookies on our website is governed by our Privacy Policy
                            available{" "}
                            <Link
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="/privacy"
                                aria-label="Privacy policy">
                                here
                            </Link>
                            .
                            <br />
                            Remember…it is always possible for you to visit our website without disclosing your personal
                            information by disabling cookies as described above. Please note that without cookies you
                            may not be able to use all the features of our website or online services. <br /> If you
                            have any questions about the cookies on our website or any personal information collected by
                            our cookies, please contact us:
                        </p>
                    </div>

                    <div className="mt-1 contact-us">
                        <p className="underline">Email:</p>
                        <p>
                            <a
                                href="mailto:privacy@thiscar.com"
                                className="email">
                                privacy@thiscar.com
                            </a>
                        </p>
                        <p className="underline">Mail</p>
                        <p>Privacy Office</p>
                        <p>THIScar, LLC</p>
                        <p>11415 Spell RD</p>
                        <p>Tomball, TX 77375</p>
                        <br />
                        <span>
                            We respond to all cookies requests and inquiries within 45 days of receiving the request.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CookiesPolicy;
