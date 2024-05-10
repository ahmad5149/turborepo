"use client";
import { memo } from "react";
import "../../../../contents/admin/scss/timeline.scss";

export const ResponseTimeline = memo(({ responseTimeline }) => {
    const formatTimestamp = (timestamp) => {
        if (timestamp) {
            const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
            const date = new Date(milliseconds);
            const formattedDate = date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
            });
            return formattedDate;
        } else {
            return "N/A";
        }
    };

    return (
        <section className="bsb-timeline-5 py-5 py-xl-8">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-10 col-md-8 col-xl-6">
                        <ul className="timeline">
                            {responseTimeline?.map((timeline) => (
                                <li
                                    key={timeline?.id}
                                    className="timeline-item">
                                    <span className="timeline-icon">
                                        <i className="bi-check-lg "></i>
                                    </span>
                                    <div className="timeline-body">
                                        <div className="timeline-content">
                                            <div className="card ">
                                                <div className="card-header p-0">
                                                    {formatTimestamp(timeline?.responseDate)}
                                                </div>
                                                <div className="card-body p-2">
                                                    <h5 className="card-title text-start">{timeline?.status}</h5>
                                                    <p className="card-text text-start">{timeline?.responseMessage}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
});
