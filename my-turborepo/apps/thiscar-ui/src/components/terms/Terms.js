import React from "react";
import "../../contents/scss/terms.scss";
import Link from "next/link";

function Terms() {
    return (
        <div className="terms-of-use">
            <div className="terms-of-use-container py-5">
                <div>
                    <h3 className="d-flex justify-content-start title">TERMS OF USE</h3>
                    <span>Effective January 1, 2023</span>
                </div>
                <br />
                <div className="sub-title">
                    <h5>Terms of use</h5>
                    <p>
                        Welcome to the THIScar, LLC Terms of Use Agreement (“Terms”). These Terms apply to your use of
                        this website, any associated sites, services, applications, or platforms (“Sites”). If you are
                        using the Sites on behalf of an organization, you are agreeing to these Terms for that
                        organization and affirm that you have the authority to bind that organization to these terms.
                        Please review these Terms carefully, as they affect your legal rights. Your use of the Sites
                        constitutes your agreement and acceptance of the Terms. If at any time you do not accept the
                        Terms, stop using the website. As used in these Terms, “THIScar,” “us,” “our,” or “we” refers to
                        THIScar, LLC., which owns and operates the Sites. “You” and “Your” mean the user(s) of the
                        Sites.
                    </p>
                    <p>
                        <b>
                            THESE TERMS CONTAIN BOTH A MANDATORY INDIVIDUAL ARBITRATION PROVISION AND CLASS ACTION/JURY
                            TRIAL WAIVER PROVISION. THESE PROVISIONS REQUIRE THE USE OF ARBITRATION ON AN INDIVIDUAL
                            BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS. BY USING THE SITES, YOU
                            EXPRESSLY AGREE TO BE BOUND BY AND ABIDE BY THEM, INCLUDING THE MANDATORY INDIVIDUAL
                            ARBITRATION PROVISION AND THE CLASS ACTION/JURY TRIAL WAIVER PROVISION. IF YOU DO NOT AGREE
                            TO THESE TERMS, YOU SHOULD NOT ACCESS OR USE THE SITES AND MUST IMMEDIATELY DISCONTINUE ANY
                            AND ALL USE OF THE SITES.
                        </b>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Acceptable Usage Policy</h5>
                    <div className="article">
                        <p>
                            By using this Site, you expressly agree not to reproduce, modify, adapt, edit, post,
                            translate, publicly display, telecommunicate, upload to, transmit, distribute, store, create
                            derivative works of the Site or otherwise publish any of the Site throughout the World, in
                            any media, now known or hereafter devised. We reserve the right to investigate your use of
                            the Site and to take any appropriate action against you that we determine is necessary in
                            our sole discretion if you violate these Terms, or otherwise create liability or damage for
                            use, other Site visitors, or any other third party. The following is a partial list of the
                            kinds of activities that are prohibited on or through the Site:
                        </p>
                        <ol className="list-decimal ml-10">
                            <li>
                                Submitting any material or engaging in activity that is unlawful, untrue, libelous,
                                defamatory, slanderous, obscene, pornographic, indecent, lewd, suggestive, harassing,
                                threatening, invasive of privacy or publicity rights, abusive, inflammatory, fraudulent,
                                harmful to minors or otherwise objectionable or inappropriate.
                            </li>
                            <li>
                                Submitting any material or engaging in activity that would constitute, encourage, or
                                provide instructions for a criminal offense, violate the rights of any party, or that
                                would otherwise create liability or violate any local, state, foreign, national, or
                                international law.
                            </li>
                            <li>
                                Submitting any material or engaging in activity that may infringe any patent, trademark,
                                trade secret, copyright or other intellectual or proprietary right of any party
                                (including rights of privacy and publicity) or unlawfully publishing or misusing private
                                or personally identifiable information of any third party, including, without
                                limitation, addresses, phone numbers, email addresses, Social Security numbers and
                                credit card numbers.
                            </li>
                            <li>
                                Submitting any material or engaging in activity that impersonates any person or entity
                                or otherwise misrepresents your affiliation with a person or entity.
                            </li>
                            <li>
                                Engaging in activity that involves unsolicited promotions, political campaigning,
                                advertising or solicitations or the transmission of "junk mail" or unsolicited mass
                                mailing or "spam" to THIScar USERs or others.
                            </li>
                            <li>
                                Engaging in activity that creates or facilitates viruses, corrupted data or other
                                harmful, disruptive, or destructive files.
                            </li>
                            <li>
                                Interfering with or disrupting the Site, our computer systems, servers, or networks.
                            </li>
                            <li>
                                Attempting to gain unauthorized access to any part of the Site, to accounts that belong
                                to other USERs, or to computer systems or networks connected to the Site.
                            </li>
                            <li>
                                Engaging in any systematic extraction of data or data fields, including, without
                                limitation, email addresses or inventory information, by use of any automated mechanism,
                                such as web robots, crawlers, or spiders (except in strict conformance with the Robots
                                Exclusion Protocol—robots.txt) or otherwise; or
                            </li>
                            <li>
                                Submitting any material or engaging in activity that, in the sole judgment of THIScar
                                contravenes the above, is otherwise objectionable or inappropriate, or which restricts
                                or inhibits any other person from using or enjoying the Site, or which may expose
                                THIScar or its affiliates or USERs to any harm or liability of any type.
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="mt-3">
                    <h5>Copyrights, Trademarks, and Patents</h5>
                    <p>
                        All content on the Sites (including but not limited to graphics, drawings, design, text,
                        software, selection, and arrangement) is protected by copyright laws in the United States. We
                        grant you permission to use the Sites and its contents for your own personal use. You may not
                        access, download, copy, modify, distribute, transmit, display, reproduce, publish, license,
                        create derivative works from, transfer, or sell any part of the content or Sites for commercial
                        purposes, whether on behalf of yourself or a third party. All THIScar trademarks, service marks
                        and trade names are trademarks or registered trademarks of THIScar, LLC. All other product
                        names, logos, brands, trademarks and registered trademarks are property of their respective
                        owners.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>User Content</h5>
                    <p>
                        The Sites may allow you to share things like comments, photos, messages, or documents with us or
                        with other USERS. When you share your content, you continue to own the intellectual property
                        rights to your content, and you are free to share the content with anyone else wherever you
                        want. However, to use your content on our Sites, you need to grant us a license for any content
                        that you create or upload using our Sites. When you upload, transmit, create, post, display or
                        otherwise provide any information, materials, documents, media files or other content on or
                        through our Sites (“User Content”) you grant us an irrevocable, unlimited, worldwide,
                        royalty-free, and non-exclusive license to copy, reproduce, adapt, modify, edit, distribute,
                        translate, publish, publicly perform and publicly display the User Content (“User Content
                        License”), to the full extent allowed by Applicable Law.
                    </p>
                    <p>
                        We do our best to keep User Content safe, but we’re not responsible if any of your User Content
                        or other data is lost. You should keep local copies or make backups of contents and other data
                        in the event something goes wrong.
                    </p>
                    <p>
                        <b>
                            YOU ARE ENTIRELY RESPONSIBLE FOR THE USER CONTENT PROVIDED BY YOU AND FOR ANY CONSEQUENCES
                            ARISING IN CONNECTION WITH THAT USER CONTENT (INCLUDING ANY LOSS OR DAMAGE SUFFERED OR
                            INCURRED BY US OR OTHER USERS). YOU REPRESENT AND WARRANT THAT (I) YOU ARE THE OWNER OF ALL
                            RIGHTS PERTAINING TO THE USER CONTENT OR OTHERWISE AUTHORIZED TO GRANT US THE USER CONTENT
                            LICENSE; (II) THE USER CONTENT WILL NOT INFRINGE ANY INTELLECTUAL PROPERTY OR OTHER
                            THIRD-PARTY RIGHTS; (III) THE USER CONTENT WILL COMPLY AND CONFORM TO ANY AGE CLASSIFICATION
                            RULES AND REQUIREMENTS (INCLUDING ACCURATE AND ADEQUATE CLASSIFICATION AND RATING OF ANY
                            USER CONTENT, AS THE CASE MAY BE) UNDER APPLICABLE LAW.
                        </b>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Social Media</h5>
                    <p>
                        We welcome you to share User Content and information about our products and services through
                        social media. When you use social media to share Site content, you grant us the right to
                        reproduce and publish your social media posting and to use the username / social media handle
                        that you used when sharing the content. You are responsible for complying with the terms and
                        conditions of social media platforms.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Digital Millennium Copyright Act</h5>
                    <div className="list ml-10">
                        <ol type="A">
                            <b>
                                <li>DMCA Notice</li>
                            </b>
                            <p>
                                If you are a copyright owner or an agent thereof and believe that any content on our
                                Sites infringes upon your copyrights, you may submit a notification (“Notification”)
                                pursuant to the Digital Millennium Copyright Act (“DMCA”) by providing our Copyright
                                Agent with the following information in writing (see 17 U.S.C 512(c)(3) for further
                                detail):
                            </p>
                            <ol className="list-decimal ml-10">
                                <li>
                                    A physical or electronic signature of a person authorized to act on behalf of the
                                    owner of an exclusive right that is allegedly infringed.
                                </li>
                                Identification of the copyrighted work claimed to have been infringed, or, if multiple
                                copyrighted works at a single online site are covered by a single Notification, a
                                representative list of such works at that site.
                                <li>
                                    Identification of the material that is claimed to be infringing or to be the subject
                                    of infringing activity and that is to be removed or access to which is to be
                                    disabled and information reasonably sufficient to permit the service provider to
                                    locate the material.
                                </li>
                                <li>
                                    Information reasonably sufficient to permit the service provider to contact you,
                                    such as an address, telephone number, and, if available, an electronic mail.
                                </li>
                                <li>
                                    A statement that you have a good faith belief that use of the material in the manner
                                    complained of is not authorized by the copyright owner, its agent, or the law; and a
                                    statement that the information in the Notification is accurate, and under penalty of
                                    perjury, that you are authorized to act on behalf of the owner of an exclusive right
                                    that is allegedly infringed.
                                </li>
                            </ol>
                            <p>
                                You can send your DMCA Notice to legal@thiscar.com. A copy of your DMCA Notification
                                will be sent to the person who uploaded the material addressed in the Notification.
                            </p>
                            <p>
                                Please be advised that under Section 512(f) of the Digital Millennium Copyright Act you
                                may be held liable for damages and attorneys’ fees if you make material
                                misrepresentations in a DMCA Notification.
                            </p>
                            <b>
                                {" "}
                                <li>DMCA Counter-Notice</li>{" "}
                            </b>
                            <p>
                                If you, the user, receive a DMCA Notification because your content is claimed to
                                infringe a copyright, but you believe in good faith that your content is not infringing
                                or that you have authorization to use the material, you may respond to the DMCA
                                Notification by sending a counter notification (“Counter Notification”) to our DMCA
                                Agent (whose contact information is provided above) that includes:
                            </p>
                            <ol className="list-decimal ml-10">
                                <li>Your physical or electronic signature.</li>
                                <li>
                                    Identification of the material that has been removed or to which access has been
                                    disabled, and the location at which the material appeared before it was removed or
                                    access to it was disabled (such as a URL for the webpage for where the material is
                                    posted).
                                </li>
                                <li>
                                    A statement from you under the penalty of perjury, that you have a good faith belief
                                    that the material was removed or disabled as a result of a mistake or
                                    misidentification of the material to be removed or disabled; and your name, physical
                                    address and telephone number, and a statement that you consent to the jurisdiction
                                    of a United States District Court for the judicial district in which your physical
                                    address is located, or if your physical address is outside of the United States, for
                                    any judicial district in which THIScar may be found, and that you will accept
                                    service of process from the person who provided notification of allegedly infringing
                                    material or an agent of such person.
                                </li>
                            </ol>
                            <p>
                                If you submit a DMCA Counter Notification, a copy of the counter notification, including
                                your name and contact information, will be sent to the copyright owner or person who
                                provided the DMCA notification. Please note that sending a DMCA Counter Notification may
                                not result in your content being restored to our services if the copyright owner chooses
                                to file suit against you within ten (10) business days of receiving the counter
                                notification.
                            </p>
                        </ol>
                    </div>
                </div>
                <div className="mt-3">
                    <h5>Third-Party Services</h5>
                    <p>
                        We engage a network of partners and service providers to furnish you with useful content and
                        functionality in connection with our Sites. This may include information, links, advertisements,
                        chat services, or other content or functionality provided by third parties (“Third-Party
                        Services”). We are not responsible for, and have no control over, any Third-Party Services, and
                        we aren’t liable for any damages or losses that are caused by any Third-Party Services.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Website and Content Subject to Change</h5>
                    <p>
                        While we try to make our Sites error-free, we do not guarantee that the content provided through
                        the Sites is complete, current, or error-free (including content related to product
                        availability, specifications, features, or prices). If we discover errors, we will make
                        reasonable efforts to correct them. In some cases, product measurements and descriptions are
                        approximate and provided only for ease of explanation or convenience.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Product, Services, and Financing Information</h5>
                    <p>
                        This Site provides information, including, but not limited to, specific product pricing, product
                        specifications, used car values, extended service agreements, financial calculators, current
                        financing offers, and basic company information for informational purposes only and nothing
                        contained herein constitutes financial advice or an offer to sell, finance, purchase or lease a
                        specific product or service to you unless otherwise expressly acknowledged and apparent from the
                        content. Prices listed on this Site exclude tax, title, registration, temporary tag, service
                        charge, and other fees. See vehicle listing for additional details. Review individual vehicle
                        listings for additional information.
                        <br />
                        Finance, purchase, or lease options are offered by third-party lenders only on approved credit
                        and may not be available in all areas of the United States. Rates and requirements vary based on
                        each lender's underwriting guidelines. Although we may assist you in locating financing through
                        third-party lenders, including by offering an online pre-qualification application, we are not
                        the lender and do not make financing offers or financing decisions.
                        <br />
                        This Site shall not be used or relied upon by you as a substitute for information that is
                        available to you from an Off Lease Only representative.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Export Control</h5>
                    <p>
                        You are responsible for complying with United States and foreign export controls and for any
                        violation of such controls, including any United States embargoes or other rules and regulations
                        restricting exports. You represent that you are not: (1) located in, or a resident or a national
                        of, any country subject to a government embargo or other restriction, or that has been
                        designated by any government as a “terrorist supporting” country; or (2) on any government list
                        of restricted end users.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Warranty Disclaimer</h5>
                    <p>
                        <b>
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR SITES ARE PROVIDED “AS IS” AND ON AN
                            “AS AVAILABLE” BASIS, WITHOUT WARRANTIES OF ANY KIND FROM US, EITHER EXPRESS OR IMPLIED. TO
                            THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES OR OTHER TERMS
                            EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OR TERMS
                            OF MERCHANTABILITY, SATISFACTORY QUALITY, WORKMANLIKE EFFORT, FITNESS FOR A PARTICULAR
                            PURPOSE, RELIABILITY OR AVAILABILITY, ACCURACY, LACK OF VIRUSES, NON-INFRINGEMENT OF
                            THIRD-PARTY RIGHTS, OR OTHER VIOLATION OF RIGHTS. SOME JURISDICTIONS DO NOT ALLOW EXCLUSIONS
                            OR LIMITATIONS OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT APPLY
                            TO YOU. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM US OR OUR
                            AFFILIATES SHALL BE DEEMED TO ALTER OUR DISCLAIMER OF WARRANTY REGARDING OUR SITES, OR TO
                            CREATE A WARRANTY OF ANY SORT FROM US. WITHOUT LIMITING THE PREVIOUS DISCLAIMER, AND TO THE
                            MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE DO NOT REPRESENT, WARRANT, OR GUARANTEE THAT
                            OUR SITES OR THE CONTENT THEREIN WILL (i) OPERATE IN AN UNINTERRUPTED, TIMELY, SECURE, OR
                            ERROR-FREE MANNER; (ii) WILL BE FREE FROM ALL HARMFUL COMPONENTS OR ERRORS; (iii) WILL BE
                            SECURE OR IMMUNE (INCLUDING THE CONTENT DELIVERED TO YOU OR THE INFORMATION YOU PROVIDED)
                            FROM UNAUTHORIZED ACCESS; OR (iv) WILL BE ACCURATE, COMPLETE, OR RELIABLE, THAT THE QUALITY
                            OF THE SITES WILL BE SATISFACTORY TO YOU, OR THAT ERRORS WILL BE CORRECTED. IN ADDITION, WE
                            DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THIRD-PARTY SERVICES,
                            ADVERTISEMENTS, CONTENT, OR ANY OTHER PRODUCT, SITES OR SERVICES ADVERTISED OR OFFERED BY A
                            THIRD PARTY ON OR THROUGH OUR SITES.
                        </b>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Limitation of Liability</h5>
                    <p>
                        <b>
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT,
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFIT, REVENUE,
                            GOODWILL, BUSINESS, OPPORTUNITY, OR DATA, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY
                            OTHER INTANGIBLE LOSSES. THE LIMITATIONS OF THIS SECTION SHALL APPLY TO ANY THEORY OF
                            LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE) OR
                            OTHERWISE, AND WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF ANY SUCH DAMAGE,
                            AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE, AND
                            EVEN TO ANY CLAIMS YOU MAY BRING AGAINST ANY OTHER PARTY TO THE EXTENT THAT WE WOULD BE
                            REQUIRED TO INDEMNIFY THAT PARTY FOR SUCH CLAIM. SOME JURISDICTIONS DO NOT ALLOW LIMITATION
                            OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS
                            LIMITATION MAY NOT APPLY TO YOU. YOU ACKNOWLEDGE AND AGREE THAT THESE LIMITATIONS ARE
                            REASONABLE GIVEN THE BENEFITS OF THE SITES AND YOU WILL ACCEPT SUCH RISK AND/OR INSURE
                            ACCORDINGLY.
                        </b>
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Indemnity</h5>
                    <p>
                        You agree to indemnify, defend, and hold harmless us, our licensors, our agents, and all
                        officers, directors, and employees from any and all third-party claims, actions, losses,
                        damages, liabilities, judgements, grants, costs, and expenses (including reasonable attorneys’
                        fees) arising from: (i) your use of our Sites or use by any person that you allow to use our
                        Sites that is not in accordance with these Terms, (ii) any breach of these Terms by you or by
                        any person that you allow to use our Sites, or (iii) any violation of any laws or regulations or
                        the rights of any third party by you or by any person that you allow to use our Sites.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Binding Arbitration of All Non-Small Claims Disputes</h5>
                    <p>
                        <b>
                            DISPUTES WITH THIScar ARISING IN ANY WAY FROM THESE TERMS SHALL BE RESOLVED EXCLUSIVELY
                            THROUGH FINAL AND BINDING ARBITRATION, AND NOT BY A COURT OR JURY.
                        </b>
                        Any controversy, claim or dispute arising out of or related to these Terms, the Site, and your
                        relationship with THIScar, LLC, including, but not limited to, alleged violations of state or
                        federal statutory or common law rights or duties shall be solely and exclusively resolved
                        according to the procedures set forth in this paragraph. If the dispute or claim is not
                        otherwise resolved through direct discussions or mediation, it shall then be resolved by final
                        and binding arbitration administered by the American Arbitration Association, in accordance with
                        its rules for the resolution of consumer disputes ("AAA Rules") and applying Texas Law. You
                        waive any right to bring your dispute or claim in court except as permitted by the AAA Rules.
                        Arbitration fees will be allocated in accordance with the AAA Rules. All proceedings brought
                        pursuant to this section will be conducted in Harris County, Texas before a single arbitrator.
                        Arbitrations may be conducted on the basis of papers only if both parties agree. You further
                        agree that, to the fullest extent permitted by applicable law, (i) any and all claims,
                        judgments, and awards shall be limited to direct damages, and in no event will you be entitled
                        to receive attorneys' fees or other legal costs; and (ii) under no circumstances will you be
                        permitted to obtain awards for, and you hereby waive all rights to claim, indirect, punitive,
                        incidental, special, or consequential damages, and any other damages, and any and all rights to
                        have damages multiplied or otherwise increased.
                        <b>
                            BY AGREEING TO THESE TERMS, EACH PARTY IRREVOCABLY WAIVES ANY RIGHT IT MAY HAVE TO JOIN
                            CLAIMS OR DISPUTES WITH THOSE OF OTHERS IN THE FORM OF A CLASS ACTION, CLASS ARBITRATION OR
                            SIMILAR PROCEDURAL DEVICE; AND WAIVES ANY RIGHT IT MAY HAVE TO PRESENT ITS CLAIM OR DISPUTE
                            IN A COURT OF LAW EXCEPT IN ACCORDANCE WITH THE AAA RULES.
                        </b>
                        Any court proceedings related to these Terms, the Site, and your relationship with THIScar, LLC,
                        including any court proceedings permitted by the AAA Rules, will be brought in the state or
                        federal courts of Harris County, Texas, and each party consents to the jurisdiction of such
                        courts. Judgment on the award rendered by the arbitrator(s), if any, may be entered for
                        enforcement purposes in any court having jurisdiction thereof.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Other Content</h5>
                    <p>
                        The Sites may contain links to third-party websites or resources. THIScar does not endorse and
                        is not responsible or liable for their availability, accuracy, the related content, products, or
                        services. You are solely responsible for your use of any such websites or resources.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Geographic Scope</h5>
                    <p>
                        Our Sites are intended for use within the United States of America. Claims about our products or
                        services are limited to the United States, unless otherwise disclosed. The Sites are intended to
                        solely promote products that are sold in the United States. We do not represent or warrant that
                        the Sites are appropriate or available for use outside the United States.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Governing Law</h5>
                    <p>
                        The formation, existence, construction, performance, validity, and all aspects whatsoever of
                        these Terms will be governed by the law of the State of Texas, without reference to its choice
                        of laws principles. These Terms will not be governed by the UN Convention on Contracts for the
                        International Sale of Goods, the application of which is expressly excluded. Notwithstanding the
                        foregoing, we may apply for injunctive remedies (or an equivalent type of urgent legal relief)
                        in any court of competent jurisdiction.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Entire Agreement & Severability</h5>
                    <p>
                        These Terms, our{" "}
                        <Link
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="/privacy"
                            aria-label="privacy">
                            Privacy Policy
                        </Link>{" "}
                        , any additional terms that accompany our Sites, any amendments, and any additional agreements
                        you may enter with us shall constitute the entire agreement between you and us with respect to
                        our Sites and supersede all prior or contemporaneous oral or written communications, proposal,
                        and representations with respect to our Sites or any subject matter covered by these Terms. If
                        any provision of these Terms is deemed to be invalid, illegal, or unenforceable (in whole or in
                        part), then that provision will be limited or eliminated to the minimum extent necessary, and
                        the remaining provisions of these Terms will remain in full force and effect. You may be subject
                        to additional terms and conditions that govern your use of third-party services, content, or
                        software.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>No Waiver</h5>
                    <p>
                        If we do not exercise or enforce any legal right or remedy which is set out in these Terms or
                        which we have the benefit of under any Applicable Law, this will not be construed as a formal
                        waiver of our rights or remedies and such rights or remedies will remain available to us.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Reservation of Rights & Feedback</h5>
                    <p>
                        Nothing in these Terms gives you a right to use the THIScar name or any of the THIScar
                        trademarks, logos, domain names, and other distinctive brand features. All rights, title, and
                        interest in and to our Sites (excluding content provided by third parties) are and will remain
                        the exclusive property of THIScar and its licensors. If you choose to make available any
                        comments, ideas, feedback, or suggestions, we will be free to use such comments, ideas,
                        feedback, or suggestion as we see fit and without any obligation to you.
                        <br />
                        <b>
                            <u>Binding Arbitration Opt Out.</u>
                        </b>
                        You may opt out of this binding arbitration agreement. In doing so, neither you nor THIScar can
                        compel the other to arbitrate. To opt out, you must notify THIScar within 30 days of initially
                        becoming subject to this arbitration agreement by emailing legal@thiscar.com. Your notice must
                        include your full name, postal address, email address and a clear statement that you want to opt
                        out of this arbitration agreement.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Survival</h5>
                    <p>
                        Any provisions within these Terms that by their nature should continue to be in effect, shall
                        survive the expiration or termination of these Terms, and remain valid and binding.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Additional Terms May Apply</h5>
                    <p>
                        Depending on which of our products or services you use, additional terms may apply (“Additional
                        Terms”). Additional Terms may also apply for promotions, sweepstakes, contest, giveaways, or
                        similar programs. If these Terms are inconsistent with any Additional Terms, the Additional
                        Terms will control.
                    </p>
                </div>
                <div className="mt-3">
                    <h5>Changes to These Terms</h5>
                    <p>
                        From time to time, we may change these Terms in our sole discretion. We reserve the right to
                        make these changes without notice, though we will update the “Last Updated” line at the
                        beginning of these Terms after each revision. You are responsible for regularly reviewing these
                        Terms, and your continued use of the Sites following any changes indicates your acceptance of
                        those changes.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Terms;
