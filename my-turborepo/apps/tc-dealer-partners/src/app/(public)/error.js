"use client"; // Error components must be Client Components
import { useEffect, useState } from "react";
import "../../contents/scss/error.scss";
import "../../contents/scss/404.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../contents/scss/variable.scss";
import "../../contents/scss/global_fonts.scss";
import { SanityImage } from "@/sanity/SanityImage";
import { GetDefaultImagePath } from "@/components/common/defaultImage/DefaultImage";
import { DefaultImage404 } from "@/components/common/defaultImage/DefaultPaths";
import { useDefaultPageContent } from "@/sanity/Sanity";
import { usePathname } from "next/navigation";
import { sendErrorEmail } from "@/app/api/sendErrorEmail";
import moment from "moment-timezone";
import { useAuth } from "@/components/auth";

export default function Error({ error, reset }) {
    console.log(error);
    const [pageData, setPageData] = useState(null);
    const pathname = usePathname();
    const [emailSent, setEmailSent] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const user = useAuth();
    // useDefaultPageContent returns promise, save in pageData and use
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await useDefaultPageContent();
                setPageData(data);
            } catch (fetchError) {
                console.error("Error fetching data from Sanity", fetchError);
                // You might want to handle this error accordingly
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    useEffect(() => {
        // Trigger the email sending logic when currentPath is updated
        if (!emailSent && currentPath !== "") {
            debugger;
            sendErrorEmailFunction([error], currentPath, user);
            setEmailSent(true);
        }
    }, [currentPath, emailSent, error]);
    if (!error) {
        return null;
    }
    return (
        <>
            <div>
                <div className="error d-flex justify-content-center align-items-center min-height-100">
                    <div className="card404 p-5 text-center">
                        <h1>404</h1>
                        <p>Something went wrong!</p>
                        <hr className="my-1" />
                        {pageData && pageData.image ? (
                            <SanityImage
                                src={pageData.image}
                                alt=""
                                width={410}
                                height={360}
                            //   className="img-fluid mx-auto default-page-image"
                            />
                        ) : (
                            <img
                                src={GetDefaultImagePath(DefaultImage404)}
                                alt=""
                                width={410}
                                height={380}
                            />
                        )}
                        <hr className="my-1" />

                        <p className="my-2">Contact us: 1-800-844-7227</p>
                        <p>
                            <span>
                                <a href="/">Click here</a>
                            </span>{" "}
                            to go back
                        </p>
                        {/* <button
                    className="custom_btn error_btn"
                    onClick={handleBack}>
                    Go Back
                </button> */}
                    </div>
                </div>
            </div>
        </>
    );
}
const convertDateToLocalTime = (date) => {
    if (!date) return null;
    const utcDate = moment.utc(date, "MMM DD, YYYY, hh:mm:ss A");
    const localDate = utcDate.local();
    const formattedDateTime = localDate.format("MMM DD, YYYY, hh:mm:ss A");
    return formattedDateTime;
};

const sendErrorEmailFunction = async (errors, currentPath, user) => {
    debugger
    const errorEnvironment =
        process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "production"
            ? ""
            : `[${process.env.NEXT_PUBLIC_ENVIRONMENT?.toUpperCase() ?? "DEV"}] - `;
    const receivers_to = process.env.NEXT_PUBLIC_RECEIVER_TO_ERROR_EMAIL.split(",").map((email) => email.trim());
    const receivers_cc = process.env.NEXT_PUBLIC_RECEIVER_CC_ERROR_EMAIL.split(",").map((email) => email.trim());
    const receivers_bcc = process.env.NEXT_PUBLIC_RECEIVER_BCC_ERROR_EMAIL.split(",").map((email) => email.trim());
    const emailSubject = `${errorEnvironment}Exception Occurred On ${convertDateToLocalTime(new Date())}`;

    const emailText = `Error Details:\n\n${"Error stack: " + (errors[0]?.stack ?? "N/A")}\n\n${"Error message: " + (errors[0]?.message ?? "N/A")
        }\n\n${"More details & digest: " + (errors[0] ?? "N/A") + (" & " + " " + errors[0].digest ?? "N/A")}\n\n`;
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Report</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
            .content {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
            }
            .label {
                font-weight: bold;
                flex: 0 0 120px; /* Fixed width for labels */
                margin-right: 10px; /* Space between label and data */
            }
            .data {
                flex: 1; /* Flexible width for data */
            }
            .label-data {
                display: flex;
                align-items: center;
                margin-bottom: 10px; /* Space between label-data pairs */
            }
            #toggle {
                display: none;
            }
            #toggle + label::after {
                content: "See more...";
                color: blue;
                cursor: pointer;
            }
            #toggle:checked + label::after {
                content: "See less";
            }
            .full-stack-trace {
                display: none;
            }
            #toggle:checked ~ .full-stack-trace {
                display: block;
            }
        </style>
    </head>
    <body>
    <div class="content">
        <div align="center" class="alignment" style="line-height:10px">
            <div style="max-width: 200px;"><img
                        alt="THIScar Partner"
                        src="https://storage.googleapis.com/tc-production-390801.appspot.com/thiscar/Logo.svg"
                        style="display: block; height: auto; border: 0; width: 100%;"
                        title="THIScar Partner" width="300" /></div>
        </div>
        <p>Hi,</p>
        <p>Exception has occurred at <strong> 'THIScar Partner', </strong>Please review, <br/> <br/></p>
        
        <div class="label-data">
            <div class="label">Subject:</div>
            <div class="data">${emailSubject}</div>
        </div>
    
        <div class="label-data">
            <div class="label">Message:</div>
            <div class="data">${errors[0].message || ""}</div>
        </div>
    
        <div class="label-data">
            <div class="label">Source:</div>
            <div class="data">${process.env.NEXT_PUBLIC_BASE_URL}${currentPath}</div>
        </div>
    
        <div class="label-data">
            <div class="label">User:</div>
            <div class="data">${user?.displayName ?? ""}</div>
        </div>
    
        <div class="label-data">
            <div class="label">Stack Trace:</div>
            <div class="data">
                <input type="checkbox" id="toggle">
                <label for="toggle"></label>
                <div class="full-stack-trace">${errors[0].stack}</div>
            </div>
        </div>
    
        <p> <br/> <br/><strong>Thank You,</strong></p>
        <p> THIScar Partner Team</p>
        
    </div>
    </body>
    </html>
    
`;

    try {
        await sendErrorEmail({
            to: receivers_to || "shahzad@thiscar.com", //process.env.NEXT_PUBLIC_RECEIVER_ERROR_EMAIL,
            cc: receivers_cc || "shahzad@thiscar.com",
            bcc: receivers_bcc || "shahzad@thiscar.com",
            subject: emailSubject,
            text: emailText,
            html: emailHtml
        });
        console.log("sending error email:", emailHtml);
    } catch (emailError) {
        console.log("Error sending error email:", emailError.message);
        console.log("Error sending error email:", emailError);
        console.error("Error sending error email:", emailError.message);
    }
};