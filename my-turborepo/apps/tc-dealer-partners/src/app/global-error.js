"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { GetDefaultImagePath } from "@/components/common/defaultImage/DefaultImage";
import { DefaultImage404 } from "@/components/common/defaultImage/DefaultPaths";

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <div className="d-flex justify-content-center align-items-center min-height-100">
                    <div>
                        <div className="p-5 text-center">
                            <h1 style={{ fontSize: "50px", marginBottom: "0px !important" }}>404</h1>
                            <br></br>
                            <p style={{ color: "gray" }}>
                                <span style={{ color: "gray", fontSize: "15px", fontWeight: 500, marginBottom: "5px" }}>
                                    site under maintenance!
                                </span>
                            </p>
                            <hr
                                className="my-1"
                                style={{ border: "1px solid rgba(0, 0, 0, 0.175)", width: "auto" }}
                            />

                            <img
                                src={GetDefaultImagePath(DefaultImage404)}
                                alt=""
                                width={410}
                                height={380}
                            />
                            <hr
                                className="my-1"
                                style={{ border: "1px solid rgba(0, 0, 0, 0.175)", width: "auto" }}
                            />
                            <p style={{ color: "gray" }}>
                                <span style={{ color: "gray", fontSize: "15px", fontWeight: 500, marginBottom: "5px" }}>
                                    Contact us: 1-800-844-7227
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
