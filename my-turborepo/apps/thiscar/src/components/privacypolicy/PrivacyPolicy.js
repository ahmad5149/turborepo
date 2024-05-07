import React from "react";
import "../../contents/scss/privacy.scss";
import Link from "next/link";

function PrivacyPolicy() {
    return (
        <div className="privacy-policy">
            <div className="Privacy_container py-5">
                <div>
                    <h3 className="d-flex justify-content-start title">THIScar, LLC Privacy Policy</h3>
                    <span>Effective January 1, 2023</span>
                </div>
                <br />
                <p>
                    When you (“User”) visit the THIScar, LLC (“THIScar,” “we,” “us,” “our”) website, any associated
                    mobile sites, services, applications, or platforms, (“Site”) you share personal information with us.
                    Because THIScar values your privacy and is committed to protecting your personal information, we are
                    providing you with our THIScar Privacy Policy (“Privacy Policy,” “Policy”) which describes how we
                    collect, use, share, treat and how we keep your personal information safe. Our Privacy Policy also
                    provides you with valuable information about your personal data choices, your rights regarding your
                    personal data and how to exercise your data choices and data rights.
                </p>
                <div className="mt-3">
                    <h5>PRIVACY POLICY OVERVIEW</h5>
                    <div className="article">
                        <ol className="list-decimal ml-10">
                            <li>What is Personal Information</li>
                            <li>How Your Personal Information is Collected</li>
                            <li>Personal Information We Collect</li>
                            <li>Cookies, Tracking Pixels, Like Technologies and Third-Party Links</li>
                            <li>How We Use the Personal Information We Collect</li>
                            <li>Personal Information Sharing</li>
                            <li>How We Protect and Safeguard Your Personal Information</li>
                            <li>Your Privacy Rights</li>
                            <li>Additional US State Privacy Rights</li>
                            <li>Children & Personal Information</li>
                            <li>Changes, Modifications and Updates to This Policy</li>
                            <li>How To Contact Us</li>
                        </ol>
                    </div>
                </div>
                <div className="mt-3">
                    <h5>What is Personal Information</h5>
                    <p>
                        At THIScar, we consider Personal Information to be any piece of data or information that can be
                        used to identify you or your electronic devices. Personal Information also includes any
                        information or data that is <label className="un">related to you</label> as well as any
                        information or data that can be associated with your household. We collect two types of personal
                        information.
                    </p>
                    <ol className="list-decimal ml-10 mb-2">
                        <li>Personally Identifiable Information</li>
                        <li>Sensitive Personal Information</li>
                    </ol>
                    <p>
                        Protecting sensitive personal information is of particular importance in that it consists of
                        personal data such as your social security number, financial information, and biometric data.
                        THIScar does not collect medical data or medical records.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>How Your Personal Information Is Collected</h5>
                    <div className="article">
                        <p>
                            We may collect personal information directly from you or from information we obtain
                            automatically from third-parties, social media platforms or from cookies, tracking pixels
                            and like technologies as described below:
                        </p>
                        <div className="article">
                            <span className="sub-title">From You:</span>
                            <br />
                            <span>We collect information directly from you, whenever you:</span>
                            <ul className="list-disc ml-10 pt-1">
                                <li>Visit our Site and enter information or register for an account</li>
                                <li>Make a purchase through our Site</li>
                                <li>Appear onsite to a THIScar facility</li>
                                <li>Contact us with questions, comments, or request for support</li>
                                <li>Upload information or content through our Platforms</li>
                                <li>Submit a product or experience rating, review, or survey</li>
                                <li>Consent to receive THIScar emails or newsletters</li>
                                <li>Contact customer service or request customer support</li>
                                <li>
                                    Complete a job application, apply for a loan, or fill out forms on our platforms
                                </li>
                            </ul>
                            <span className="sub-title">From Your Device or Browser:</span>
                            <p>
                                Certain personal information is automatically collected from your device or browser for
                                analysis purposes when you visit our website, our platforms, when you interact with our
                                social media pages or online advertising, or when you interact with our onsite Wi-Fi
                                connections or open our emails.
                            </p>

                            <span className="sub-title">From Third Parties:</span>
                            <p>
                                We engage contractors, business partners, service providers and third parties to provide
                                services such as financing, insurance credit bureau reporting, marketing, and
                                advertising (to name a few). These third parties share personal information they have
                                collected about with us.
                                <br />
                                Your information may also be collected and processed by third parties that process your
                                information in accord with their own Privacy Policies (or Privacy Notices or Privacy
                                Disclosures). If a third-party provides us with your personal information, we will
                                process that information for the purpose(s) for which it was collected and as described
                                in this Privacy Policy.
                            </p>
                            <span className="sub-title">From Social Media Platforms:</span>
                            <p>
                                Typically, social media platforms share aggregated information - data about groups of
                                consumers that cannot be linked or associated with an individual. Shared, aggregated
                                data from social media platforms does not include personal information.
                            </p>
                            <span className="sub-title">
                                From Cookies, Tracking Pixels, Like Technologies and Third Part Links:
                            </span>
                            <p>
                                THIScar collects information from cookies, tracking pixels, like technologies and
                                third-party links. Read below for detailed information regarding these practices.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <h5>Cookies, Tracking Pixels, Like Technologies and Third-Party Links:</h5>
                    <p>
                        When you visit our Site, certain personal information is automatically collected from you.
                        THIScar contracts with third-party advertising and analytics companies to deliver online
                        advertisings to you. These companies may use cookies or similar technologies to collect
                        information about you from out Site. For detailed information regarding our cookies, tracking
                        pixels, like technologies and third-party links, opting out of certain cookies and choosing your
                        cookie preferences, please view our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/cookies-policy"
                            aria-label="Cookie policy">
                            Cookie Policy.
                        </Link>
                        <br />
                        Cookies are small text files that store information on your computer hard drive or browser. We
                        use cookies and other automated tools such as tracking pixels to improve the experience of the
                        site and services, such as saving your preferences from visit to visit or to present you with a
                        customized version of our Site. Many web browsers are initially set up to accept cookies. By
                        agreeing to the use of cookies on our Site, you are consenting to the disclosure of your
                        personal information and data to our third-party service providers for these purposes. You can
                        reset your web browser to refuse all cookies or to indicate when a cookie is sent. For
                        additional and more detailed information regarding our cookies, opting out of certain cookies
                        and choosing your cookie preferences, please view our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/cookies-policy"
                            aria-label="Cookie policy">
                            Cookie Policy.
                        </Link>
                    </p>
                    <p>
                        We may also employ software technologies that enable us to track certain aspects of a user's
                        visit to our Site. This technology assists us to better manage content on the Site by informing
                        us what content is effective, how consumers engage with the site, and how consumers arrive at
                        and/or depart from our Site. For additional and more detailed information regarding software
                        technologies, including out to opt out of these technologies please view our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/cookies-policy"
                            aria-label="Cookie policy">
                            Cookie Policy.
                        </Link>
                    </p>
                    <p>
                        We may contract with third-party advertisers, search providers, and ad networks ("Advertisers")
                        to learn more about you and to show you ads or other content that we believe would be relevant
                        to you. Advertisers may collect and use information about your use of our Site and services.
                        These companies may use cookies and other online tracking technologies to collect and use your
                        information. Further, advertising companies may use and share the information collected to
                        deliver advertising tailored to your interests. We may append other data to the data collected
                        by Advertisers to create an interest profile of our individual users. For additional and more
                        detailed information regarding our advertising cookies, and targeted advertising (which includes
                        choosing not to receive targeted advertising from many ad networks and partners, please view our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/cookies-policy"
                            aria-label="Cookie policy">
                            Cookie Policy.
                        </Link>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Personal Information We Collect</h5>
                    <p>
                        We welcome you to share User Content and information about our products and services through
                        social media. When you use social media to share Site content, you grant us the right to
                        reproduce and publish your social media posting and to use the username / social media handle
                        that you used when sharing the content. You are responsible for complying with the terms and
                        conditions of social media platforms.
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>Categories of Personal Information Collected</th>
                                <th>Specific Pieces of Information Collected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Personal Identifiers and Contact Information</td>
                                <td>
                                    First and Last name; Phone Number; Postal Address; Username and Password; Email
                                    address; IP Address; Birthday and Month
                                </td>
                            </tr>
                            <tr>
                                <td>Sensitive Personal Information</td>
                                <td>
                                    Social Security Number; Driver’s License Number; State ID Card Number; Passport
                                    Number; Account Log-In; Financial Account Number; Debit or Credit Card Number;
                                    Security / Access Code, Password, Precise Geolocation; Genetic Data; Contents of
                                    Mail, Email and Text Messages; Union Membership
                                </td>
                            </tr>
                            <tr>
                                <td>Financial Information</td>
                                <td>
                                    Debit or Credit Card Payment Information (Name on Card, Number, Expiration Date,
                                    Security Code); Bank Account Number; Check Images
                                </td>
                            </tr>
                            <tr>
                                <td>Commercial Information</td>
                                <td>
                                    VIN, Temporary Tag Number; License Plate Number; Vehicle Registration; Title
                                    Information
                                </td>
                            </tr>
                            <tr>
                                <td>Business Documents</td>
                                <td>
                                    Utility Bills; Lease; Bank Statements; Tax Returns; Paystubs, 1099s, Payment Advice
                                </td>
                            </tr>
                            <tr>
                                <td>Employment / Professional Information</td>
                                <td>
                                    Employment / Work History Information; Occupation Information; Resume; CV; Proof of
                                    Income Documents
                                </td>
                            </tr>
                            <tr>
                                <td>Educational Information</td>
                                <td>
                                    Educational Institution Attended and Dates Attended; Degrees or Certifications
                                    Awarded
                                </td>
                            </tr>
                            <tr>
                                <td>Electronic Network Activity Information</td>
                                <td>
                                    Browsing History; Site Usage and Services Data; Device Information; Cookies;
                                    Automated Technologies
                                </td>
                            </tr>
                            <tr>
                                <td>Geolocation Information</td>
                                <td>
                                    Information Regarding Device Location; IP Address, Position Location-Based
                                    Technology
                                </td>
                            </tr>
                            <tr>
                                <td>Audio Visual Information</td>
                                <td>
                                    CCTV Footage; Audio Call Recordings; User Profile Photos; Reviews or Testimonial
                                    Videos
                                </td>
                            </tr>
                            <tr>
                                <td>Biometric Information</td>
                                <td>
                                    Physiological, biological, or behavioral characteristics, Voiceprints for fraud
                                    detection and authentication; Facial recognition or fingerprint for your account
                                    log-in
                                </td>
                            </tr>
                            <tr>
                                <td>Inferences Drawn from Personal Information</td>
                                <td>
                                    Credit Report; Credit Score; Bankruptcy History; Motor Vehicle Report; Criminal
                                    Records; Background Check
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-3">
                    <h5>How We Use the Information We Collect</h5>
                    <p>We use the information we collect about you to:</p>
                    <ul className="list-disc ml-10">
                        <li>Perform required business purposes, operational activities, and obligations</li>
                        <li>Fulfill legal obligations, applicable laws, regulations, court orders or legal process</li>
                        <li>Create and / or manage User accounts or profiles</li>
                        <li>Provide Users with the products, services, or information they request</li>
                        <li>Provide bills of sale, finance agreements, extended service agreements</li>
                        <li>Fulfill purposes for which Users provided their personal information to THIScar</li>
                        <li>Provide User support and assistance with services provided by THIScar</li>
                        <li>Personalize services, content and communications based upon User preferences</li>
                        <li>Conduct fraud protection, security protocol and debugging activities</li>
                        <li>Manage User Credit Applications, Vehicle Purchases and Business Transactions</li>
                        <li>Market services by sending emails, advertisings, newsletters, or communications</li>
                        <li>Display web-based advertisements based upon user behavioral preferences</li>
                        <li>Respond to correspondence from Users</li>
                        <li>Contact Users when necessary or requested</li>
                        <li>
                            Prevent, detect, or investigate data security incidents or other potentially illegal or
                            prohibited activities
                        </li>
                        <li>Protect the rights, property, or safety of Users, THIScar or other party</li>
                        <li>Enforce User legal agreements, contracts, legal obligations or resolve disputes</li>
                        <li>Respond to claims regarding site postings, content violations or Third-Party rights</li>
                        <li>
                            Respond and fulfill data subjects’ requests and data subject rights including identity
                            verification
                        </li>
                    </ul>
                </div>
                <div className="mt-3">
                    <h5>Personal Information Sharing</h5>
                    <p>
                        THIScar may share your personal information with third parties who perform services on our
                        behalf. We share information only to the extent necessary to allow third parties to perform
                        their services. We do not authorize our service providers to use or disclose the information
                        except as necessary to perform services on our behalf or to comply with legal requirements.
                        <br />
                        We share the personal information we collect through the Services if you ask us to do so or
                        otherwise with your consent. We may also disclose your personal information in other
                        circumstances, including:
                    </p>
                    <ul className="list-disc ml-10">
                        <li>Law enforcement authorities</li>
                        <li>Government or public agencies or officials</li>
                        <li>
                            Regulators, and/or any other person or entity with appropriate legal authority or
                            justification for receipt of such information, if required or permitted to do so by law or
                            legal process
                        </li>
                        <li>
                            When we believe disclosure is necessary or appropriate to prevent physical harm or financial
                            loss, or in connection with an investigation of suspected or actual fraudulent or illegal
                            activity, or
                        </li>
                        <li>
                            In the event we may or do sell or transfer all or a portion of our business or assets
                            (including in the event of a merger, acquisition, joint venture, reorganization,
                            divestiture, dissolution, or liquidation).
                        </li>
                    </ul>
                    <p>
                        THIScar may share your personal information with certain third parties or business partners that
                        do not provide services directly to or on THIScar’s behalf; yet instead, these third parties or
                        business partners may use your personal information to provide vehicle ancillary services such
                        as GAP insurance, vehicle warranties, service contracts, GPS location services, key replacement,
                        vehicle protection, alarm and insurance products.
                        <br />
                        The above industry practice type of sharing personal information may be considered a "sale" in
                        certain jurisdictions. However, THIScar does not sell personal information to third parties for
                        profit.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Children & Personal Information</h5>
                    <p>
                        THIScar does not intend for its Site be viewed or utilized by anyone under the age of sixteen
                        (16). We do not knowingly collect, sell, or share information of consumers under the age of
                        (16). If you are a parent or guardian and believe we may have collected information about your
                        child, please contact us immediately as described in the contact us section of this Notice. For
                        more information, please see our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/terms"
                            aria-label="Terms">
                            Terms of Use Agreement.
                        </Link>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Changes, Modifications and Updates to This Policy</h5>
                    <p>
                        We may update this Privacy Policy from time to time. When we make material changes to the way we
                        collect, use your personal information, or make changes to the service offered, we will provide
                        you with notice by posting the updated Privacy Policy on this Site. We will indicate at the top
                        of the policy its most recent update.
                    </p>
                </div>
                <div className="mt-3 contact-us">
                    <h5>Contact Us</h5>
                    <p>
                        While we have attempted to ensure our Privacy Policy is easy to understand and free of confusing
                        legal terms, we realize you may need to know more about our privacy practices and standards. For
                        any additional questions about how we collect, use, share or treat your personal information,
                        please contact us at:
                    </p>
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
                        We respond to all privacy requests and inquiries within 45 days of receiving the request.
                    </span>
                </div>
                <div className="mt-3">
                    <p>
                        This site is being monitored by one or more third-party software(s), and may capture information
                        about your visit. You may opt-out from the data collection on your visit through a universal
                        consumer options page located at{" "}
                        <a
                            href="http://collectionoptoutservices.com"
                            target="_blank">
                            http://collectionoptoutservices.com
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
