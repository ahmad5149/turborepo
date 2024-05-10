import React from "react";
import "../../contents/scss/404.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../contents/scss/variable.scss";
import "../../contents/scss/global_fonts.scss";
import { DefaultImage404 } from "../../components/common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../../components/common/defaultImage/DefaultImage";
import { GetTabName } from "@/utils/WebPageUtil";
import { SanityImage } from "@/sanity/SanityImage";
import { useDefaultPageContent } from "@/sanity/Sanity";

export const metadata = {
    title: GetTabName("Page Not Found"),
    description: "Page Not Found"
};

async function NotFoundPage(props) {
    const pageData = await useDefaultPageContent();
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center min-height-100">
                <div className="card404 p-5 text-center">
                    <div>
                        <h1>{props.Message ? props.Message : "404"}</h1>
                        <p>{props.Message ? " " : "Page Not Found"}</p>
                        <hr className="my-1" />
                        {/* <img
              src={GetImageSource(pageData.image, DefaultImage404)}
              className='img-fluid mx-auto'
              alt=''
              style={{ width: "100%", height: "auto" }}
            /> */}
                        {/* <SanityImage
              src={pageData.image}
              className='img-fluid mx-auto default-page-image'
              defaultImage={GetDefaultImagePath(DefaultImage404)}
              alt=''
              width={410}
              height={380}
            /> */}
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

                        <p className="my-2">Please check the URL</p>
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

export default NotFoundPage;
