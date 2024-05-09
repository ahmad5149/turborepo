import { SanityImage } from "@/sanity/SanityImage";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { DefaultImage404 } from "../common/defaultImage/DefaultPaths";
import { useDefaultPageContent } from "@/sanity/Sanity";
import "../../contents/scss/404.scss";

async function ErrorFetchingCars(props) {
    const pageData = await useDefaultPageContent();

    setTimeout(() => {
        window.location.href = "/";
    }, 6000);
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
