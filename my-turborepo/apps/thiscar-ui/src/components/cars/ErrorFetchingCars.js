"use client";
import { SanityImage } from "@/sanity/SanityImage";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { DefaultImage404 } from "../common/defaultImage/DefaultPaths";
import { useDefaultPageContent } from "@/sanity/Sanity";
import "../../contents/scss/404.scss";
import { sendErrorEmail } from "@/app/api/sendErrorEmail";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function ErrorFetchingCars(props) {
    const pageData = useDefaultPageContent();
    const pathname = usePathname();
    const [emailSent, setEmailSent] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    useEffect(() => {
        setCurrentPath(pathname);

        // setCurrentPath((prevPath) => {
        //     if (prevPath !== window.location.href) {
        //         console.log(window.location.href);
        //         return window.location.href;
        //     }
        //     return prevPath;
        // });

        const redirectTimeout = setTimeout(() => {
            window.location.href = "/";
        }, 6000);

        return () => {
            clearTimeout(redirectTimeout);
        };
    }, [props.Message, emailSent]);

    useEffect(() => {
        // Trigger the email sending logic when currentPath is updated
        if (!emailSent && currentPath !== "") {
            console.log("Calling sendErrorEmail");
            //   sendErrorEmailFunction(props.Message, currentPath);
            //   setEmailSent(true);
        }
    }, [currentPath, emailSent, props.Message]);

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center min-height-100">
                <div className="card404 p-5 text-center">
                    <div>
                        <h1>{props.Message ? props.Message : "Oops!"}</h1>
                        <p>{props.Message ? " " : "Try Again"}</p>
                        <hr className="my-1" />

                        {pageData && pageData.image ? (
                            <SanityImage
                                src={pageData.image}
                                className="img-fluid mx-auto default-page-image"
                                alt=""
                                width={410}
                                height={380}
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
                        <p>
                            <span>
                                <a href="/">Click Here</a>
                            </span>{" "}
                            to redirect to Home Page
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorFetchingCars;
const convertDateToLocalTime = (date) => {
    if (!date) return null;
    const utcDate = moment.utc(date, "MMM DD, YYYY, hh:mm:ss A");
    const localDate = utcDate.local();
    const formattedDateTime = localDate.format("MMM DD, YYYY, hh:mm:ss A");
    return formattedDateTime;
};
const sendErrorEmailFunction = async (errors, currentPath) => {
    // console.log(process.env.NEXT_PUBLIC_SENDER_ERROR_EMAIL);
    // console.log(process.env.NEXT_PUBLIC_RECEIVER_ERROR_EMAIL);
    const errorEnvironment =
        process.env.NEXT_PUBLIC_ENVIRONMENT?.toLowerCase() === "production"
            ? ""
            : `[${process.env.NEXT_PUBLIC_ENVIRONMENT?.toUpperCase() ?? "DEV"}] - `;
    const receivers_to = process.env.NEXT_PUBLIC_RECEIVER_TO_ERROR_EMAIL.split(",").map((email) => email.trim());
    const receivers_cc = process.env.NEXT_PUBLIC_RECEIVER_CC_ERROR_EMAIL.split(",").map((email) => email.trim());
    const receivers_bcc = process.env.NEXT_PUBLIC_RECEIVER_BCC_ERROR_EMAIL.split(",").map((email) => email.trim());

    const emailSubject = `${errorEnvironment}Exception Occurred On ${convertDateToLocalTime(new Date())}`;

    const emailText = `Error Details:\n\n${"Error stack: " + (errors?.stack ?? "N/A")}\n\n${
        "Error message: " + (errors?.message != null ? errors.message : errors ?? "N/A")
    }\n\n${"More details & digest: " + (errors ?? "N/A") + (" & " + " " + errors.digest ?? "N/A")}\n\n`;

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
    
            .header {
                text-align: center;
                padding: 20px 0;
            }
    
            .header img {
                max-width: 100px;
                height: auto;
            }
    
            .content {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
    
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 12px;
            }
    
            th {
                background-color: #f2f2f2;
            }
            .image-space {
                margin-bottom: 80px;
            }
        </style>
    </head>
    
    <body>
        
    
        <div class="content">
        <div align="center" class="alignment"
        style="line-height:10px">
        <div style="max-width: 200px;"><img
        alt="THIScar"
        src="https://storage.googleapis.com/tc-production-390801.appspot.com/thiscar/Logo.svg"
        style="display: block; height: auto; border: 0; width: 100%;"
        title="THIScar" width="300" /></div>
     </div>
        <div class="image-space"></div>
            <h2>Error Report</h2>
    
            <p><strong>Subject:</strong> ${emailSubject}</p>
            <p><strong>Message:</strong> ${errors.message || errors || ""}</p>
            <p><strong>Digest:</strong> ${errors.digest || ""}</p>
            <p><strong>Stack:</strong> ${errors.stack || ""}</p>
    
            <table>
                <tr>
                    <th>Message</th>
                    <th>Digest</th>
                    <th>Stack</th>
                </tr>
                <tr>   
                    
            
                        <td>${errors.message || errors || ""}</td>
                        <td>${errors.digest || ""}</td>
                        <td>${errors.stack || ""}</td>
                    </tr>
                
                           
                </tr>
            </table>
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
        console.error("Error sending error email:", emailError.message);
    }
};
