import React from "react";
import { GetDefaultImagePath } from "@/components/common/defaultImage/DefaultImage";
import { DefaultImage404 } from "@/components/common/defaultImage/DefaultPaths";
import "../../../contents/scss/error.scss";
import "../../../contents/scss/404.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../contents/scss/variable.scss";
import "../../../contents/scss/global_fonts.scss";
import { useDefaultPageContent } from "@/sanity/Sanity";
import { SanityImage } from "@/sanity/SanityImage";
async function CarWithInvalidVIN({ message = "Please check the VIN" }) {
    const pageData = await useDefaultPageContent();
    return (
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

                    <p className="my-2">{message}</p>
                    <p>
                        <span>
                            <a href="/cars">Click here</a>
                        </span>{" "}
                        to go back
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CarWithInvalidVIN;
