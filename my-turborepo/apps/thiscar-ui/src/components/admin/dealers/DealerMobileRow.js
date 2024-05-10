"use client";

import React from "react";
import Link from "next/link";

export const DealerMobileRow = ({ index, dealer, parentId, handleLink, handleDelete }) => {
    return (
        <tr key={index}>
            <td className="text-start pe-0">
                <div
                    className="accordion-item"
                    key={index}>
                    <h2
                        className="accordion-header"
                        id={`heading-${index}`}>
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${index}`}
                            aria-expanded="true"
                            aria-controls={`collapse-${index}`}>
                            <div>
                                <div className="pb-2">
                                    <b>Dealer Name</b>
                                    <div>{dealer?.name}</div>
                                </div>

                                <div>
                                    <b>Status</b> {dealer.isActive && <div>Active</div>}
                                    {!dealer.isActive && <div>Inactive</div>}
                                    {dealer.isDeleted && <div>Deleted</div>}
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div
                        id={`collapse-${index}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent={parentId}>
                        <div>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Dealer Name
                                </label>
                            </div>
                            <div className="name">
                                <h4> {dealer.name}</h4>
                            </div>
                        </div>

                        <div className="dealer-info">
                            <div className="heading">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Website
                                </label>
                            </div>
                            <div className="website-link">
                                <h4>
                                    {" "}
                                    <a href={dealer.website}>{dealer.website}</a>
                                </h4>
                            </div>

                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Inv Count
                                </label>
                            </div>
                            <h4>
                                <Link
                                    href={`/admin/inventory?q=${dealer.chromeDealerId}&&name=${dealer.name}`}
                                    passHref>
                                    {dealer.invCount ?? 0}
                                </Link>
                            </h4>
                            <div className="heading mt-2">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Phone
                                </label>
                            </div>
                            <div className="name">
                                <h4> {dealer.phone}</h4>
                            </div>
                            <div className="heading mb-1 mt-1">
                                <label
                                    htmlFor="exampleFormControlInput1"
                                    className="form-label">
                                    Actions
                                </label>
                            </div>
                            <div className="d-flex align-items-stretch flex-shrink-0 mb-1">
                                <Link
                                    onClick={handleLink}
                                    href={`/admin/dealers/add-dealer?id=${dealer.uuid}&key=${Math.random()
                                        .toString(36)
                                        .substring(2, 7)}`}
                                    passHref>
                                    <div
                                        style={{
                                            background: "#f1faff"
                                        }}
                                        className="btn btn-icon btn-active-light-primary fs-6">
                                        <span className="active">
                                            <i
                                                className="ki-duotone ki-pencil fs-2"
                                                style={{
                                                    color: "#00a3ff"
                                                }}>
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                            </i>
                                        </span>
                                    </div>
                                </Link>
                                <div
                                    style={{
                                        background: "#f1faff"
                                    }}
                                    className="btn btn-icon btn-active-light-primary fs-6 ms-2">
                                    <span
                                        onClick={() => handleDelete(dealer.uuid, index)}
                                        className="active">
                                        <i
                                            style={{
                                                color: "#00a3ff"
                                            }}
                                            className="ki-duotone ki-basket fs-2x">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                            <span className="path4"></span>
                                        </i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
};
