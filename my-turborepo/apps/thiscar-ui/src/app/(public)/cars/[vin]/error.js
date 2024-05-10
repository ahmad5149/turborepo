"use client"; // Error components must be Client Components
import { useEffect } from "react";
import "../../../../contents/scss/error.scss";
import { GetDefaultImagePath } from "@/components/common/defaultImage/DefaultImage";
import { DefaultImage404 } from "@/components/common/defaultImage/DefaultPaths";
import "../../../../contents/scss/404.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../contents/scss/variable.scss";
import "../../../../contents/scss/global_fonts.scss";
import { useDefaultPageContent } from "@/sanity/Sanity";
import { useState } from "react";
import { SanityImage } from "@/sanity/SanityImage";
//import { usePathname } from "next/navigation";
//import { sendErrorEmail } from "@/app/api/sendErrorEmail";
// import { LogoPath } from "../../../../components/common/defaultImage/DefaultPaths";
//import "../../../../../public/media/logo.png";
export default function ErrorVDP({ error, reset }) {
    const [pageData, setPageData] = useState(null);
    // const pathname = usePathname();
    // const [emailSent, setEmailSent] = useState(false);
    // const [currentPath, setCurrentPath] = useState("");

    console.log(error);
    // useDefaultPageContent returns promise, save in pageData and use
    useEffect(() => {
        useDefaultPageContent()
            .then((data) => {
                setPageData(data);
            })
            .catch((error) => {
                console.error("Error fetching data from Sanity", error);
            });
    }, []);
    useEffect(() => {}, [error]);
    // useEffect(() => {
    //     setCurrentPath(pathname);
    // }, [pathname]);

    // useEffect(() => {
    //     // Trigger the email sending logic when currentPath is updated
    //     if (!emailSent && currentPath !== "") {
    //         console.log("Calling sendErrorEmail");
    //         console.log(error.digest);
    //          sendErrorEmailFunction([error], currentPath); //[error] send array to handle multiple errors
    //          setEmailSent(true);
    //     }
    // }, [currentPath, emailSent, error]);
    if (!error) {
        return null;
    }

    return (
        <>
            <div>
                <div className="error d-flex justify-content-center align-items-center min-height-100">
                    <div className="card404 p-5 text-center">
                        <h1>404</h1>
                        <p>Data not found!</p>
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

                        <p className="my-2">Please check the VIN</p>
                        <p>
                            <span>
                                <a href="/cars">Click here</a>
                            </span>{" "}
                            to go back
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// const sendErrorEmailFunction = async (errors, currentPath) => {
//     // console.log(process.env.NEXT_PUBLIC_SENDER_ERROR_EMAIL);
//     // console.log(process.env.NEXT_PUBLIC_RECEIVER_ERROR_EMAIL);
//     const receivers_to = process.env.NEXT_PUBLIC_RECEIVER_TO_ERROR_EMAIL.split(",").map((email) => email.trim());
//     const receivers_cc = process.env.NEXT_PUBLIC_RECEIVER_CC_ERROR_EMAIL.split(",").map((email) => email.trim());
//     const receivers_bcc = process.env.NEXT_PUBLIC_RECEIVER_BCC_ERROR_EMAIL.split(",").map((email) => email.trim());

//     const emailSubject = `Error on Your website\n\n${""}\n\n(URL): ${currentPath}`;

//     const emailText = `Error Details:\n\n${"Error stack: " + (errors[0]?.stack ?? "N/A")}\n\n${
//         "Error message: " + (errors[0]?.message ?? "N/A")
//     }\n\n${"More details & digest: " + (errors[0] ?? "N/A") + (" & " + " " + errors[0].digest ?? "N/A")}\n\n`;

//     const emailHtml = `<!DOCTYPE html>
//     <html lang="en">

//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Error Report</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #f5f5f5;
//                 margin: 0;
//                 padding: 20px;
//             }

//             .header {
//                 text-align: center;
//                 padding: 20px 0;
//             }

//             .header img {
//                 max-width: 100px;
//                 height: auto;
//             }

//             .content {
//                 background-color: #ffffff;
//                 padding: 20px;
//                 border-radius: 5px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                 margin-top: 20px;
//             }

//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//             }

//             th, td {
//                 border: 1px solid #dddddd;
//                 text-align: left;
//                 padding: 12px;
//             }

//             th {
//                 background-color: #f2f2f2;
//             }
//             .image-space {
//                 margin-bottom: 80px;
//             }
//         </style>
//     </head>

//     <body>

//         <div class="content">
//         <div align="center" class="alignment"
//         style="line-height:10px">
//         <div style="max-width: 200px;"><img
//         alt="THIScar"
//         src="https://storage.googleapis.com/tc-production-390801.appspot.com/thiscar/Logo.svg"
//         style="display: block; height: auto; border: 0; width: 100%;"
//         title="THIScar" width="300" /></div>
//         </div>
//         <div class="image-space"></div>
//             <h2>Error Report</h2>

//             <p><strong>Subject:</strong> ${emailSubject}</p>
//             <p><strong>Message:</strong> ${errors[0].message || ""}</p>
//             <p><strong>Digest:</strong> ${errors[0].digest || ""}</p>
//             <p><strong>Stack:</strong> ${errors[0].stack || ""}</p>

//             <table>
//                 <tr>
//                     <th>Message</th>
//                     <th>Digest</th>
//                     <th>Stack</th>
//                 </tr>
//                 <tr>
//                     ${
//                         errors &&
//                         errors
//                             .map(
//                                 (error, index) => `
//                     <tr key=${index}>
//                         <td>${error.message || ""}</td>
//                         <td>${error.digest || ""}</td>
//                         <td>${error.stack || ""}</td>
//                     </tr>
//                 `
//                             )
//                             .join("")
//                     }
//                 </tr>
//             </table>
//         </div>
//     </body>

//     </html>

//     `;
//     try {
//         await sendErrorEmail({
//             to: receivers_to || "shahzad@thiscar.com", //process.env.NEXT_PUBLIC_RECEIVER_ERROR_EMAIL,
//             cc: receivers_cc || "shahzad@thiscar.com",
//             bcc: receivers_bcc || "shahzad@thiscar.com",
//             subject: emailSubject,
//             text: emailText,
//             html: emailHtml
//         });
//         console.log("sending error email:", emailHtml);
//     } catch (emailError) {
//         console.log("Error sending error email:", emailError.message);
//         console.log("Error sending error email:", emailError);
//         console.error("Error sending error email:", emailError.message);
//     }
// };
