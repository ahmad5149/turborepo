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
export default function Error({ error, reset }) {
    console.log(error);
    const [pageData, setPageData] = useState(null);
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
    // const handleBack = () => {
    //     reset();
    //     window.history.back();
    // };
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
