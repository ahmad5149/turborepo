"use client";
import { useState, React, useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import { fetchNotifications } from "../../../services/offsiteNotificationsService";
import "../../../contents/admin/scss/notifications.scss";
import { transformData } from "./Utilities";
import { debounce } from "lodash";
import { pusherClient } from "@/utils/pusher/client";
import { formatOffsiteNotificationDate } from "../../../utils/helpers/dateFormatter";
import moment from "moment-timezone";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import "../../../../src/contents/admin/scss/mobileListings.scss";
import { UpdateOffsiteNotificationResponse } from "@/services/notificationsService";
import { useAuth } from "@/components/auth";
import Swal from "sweetalert2";
import { sendOffsiteEmail } from "@/app/api/sendOffsiteEmail";
import { GetMakeModelByVIN } from "@/services/carService";

function OffsiteNotifications({ notifications, confirmSaleOrNoSale }) {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const [notificationsData, setNotificationsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState(params.get("sortOrder") ? params.get("sortOrder") : "asc");
    const [sortBy, setSortBy] = useState(params.get("sortBy") ? params.get("sortBy") : "dealerName");
    const [query, setQuery] = useState(null);
    const [liveNotifications, setLiveNotifications] = useState([]);
    const [hasSearchResults, setHasSearchResults] = useState(false);
    const [ellipsisMenuContent, setEllipsisMenuContent] = useState(null);
    const [ellipsisMenuOpen, setEllipsisMenuOpen] = useState(false);
    const pathname = usePathname();
    const user = useAuth();
    const ellipsisRef = useRef(null);

    // console.log("🚀 ~ notificationsData:", notificationsData);
    const channelName = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "dev";

    useEffect(() => {
        const channel = pusherClient.subscribe("offsite-notification").bind(channelName, (data) => {
            setLiveNotifications([data, ...liveNotifications]);
        });

        return () => {
            channel.unbind();
        };
    }, [liveNotifications]);

    useEffect(() => {
        const updatedNotifications = formatOffsiteNotificationDate(notifications);
        setNotificationsData(updatedNotifications);
    }, []);

    async function startAgain() {
        setNotificationsData([]);
        setLiveNotifications([]);
        setLoading(true);
    }
    async function getSearchParams() {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        const sortByCol = params.get("sortBy") || sortBy;
        const status = params.get("status") || "";
        const sortOrderCol = params.get("sortOrder") || sortOrder;
        return { q, sortByCol, status, sortOrderCol };
    }

    const getNotificationColorForType = (value) => {
        if (value != null) {
            value = value?.replace(/\s/g, "");
            switch (value.toLowerCase()) {
                case "available":
                    return "type-available";
                case "24hourhold" || "24 hour hold": {
                    return "type-hour-hold";
                }
                case "purchase":
                    return "type-purchase";
                default:
                    return "type-default";
            }
        } else {
            return "type-default";
        }
    };

    const convertDateToLocalTime = (date) => {
        if (!date) return null;
        const utcDate = moment.utc(date, "MMM D, YYYY, h:mm:ss A");
        const localDate = utcDate.local();
        const formattedDateTime = localDate.format("MMM D, YYYY, h:mm A");
        return formattedDateTime;
    };

    const handleInfiniteScroll = async () => {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q");
        const sortby = params.get("sortBy");
        const sortOrder = params.get("sortOrder");

        const { scrollTop, clientHeight, scrollHeight } = document?.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
            try {
                if (!lastPage) {
                    setLoading(true);
                    const res = await fetchNotifications({ page: page + 1, q, sortby, sortOrder });

                    const notifications = transformData(res?.hits);
                    const updatedNotifications = formatOffsiteNotificationDate(notifications);

                    if (updatedNotifications?.length) setPage(res?.page);

                    if (updatedNotifications.length > 0) {
                        setNotificationsData((prevData) => {
                            const uniqueNotifications = updatedNotifications.filter(
                                (newNotification) =>
                                    !prevData.some(
                                        (existingNotification) => existingNotification.uuid === newNotification.uuid
                                    )
                            );

                            if ([...prevData, ...uniqueNotifications].length === res?.found) {
                                setLastPage(true);
                            } else {
                                setLastPage(false);
                            }

                            return [...prevData, ...uniqueNotifications];
                        });
                    } else {
                        setLastPage(true);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error in searchNotifications:", error.message);
            }
        }
    };

    const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 500);

    useEffect(() => {
        const handleScroll = () => {
            debouncedHandleInfiniteScroll();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    const findSearchResults = async (q) => {
        setHasSearchResults(true);
        setSortBy("createdAt");
        await startAgain();
        setSortOrder("desc");
        const params = new URLSearchParams(searchParams);
        const sortby = params.get("sortBy");
        const sortOrder = params.get("sortOrder");
        const getQuery = params.get("q") || q;
        fetchNotifications({ q: getQuery, sortby, sortOrder }).then((res) => {
            const notifications = transformData(res?.hits || []);
            const updatedNotifications = formatOffsiteNotificationDate(notifications);

            setPage(res?.page);
            setLoading(false);
            if (updatedNotifications.length > 0) {
                setNotificationsData((prevData) => {
                    const uniqueNotifications = updatedNotifications.filter(
                        (newNotification) =>
                            !prevData.some((existingNotification) => existingNotification.uuid === newNotification.uuid)
                    );
                    if ([...prevData, ...uniqueNotifications].length === res?.found) {
                        setLastPage(true);
                    } else {
                        setLastPage(false);
                    }
                    return [...prevData, ...uniqueNotifications];
                });
            }
        });
    };

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        setQuery(q);
        setHasSearchResults(!!q);
    }, []);

    const handleChangeSearch = (q) => {
        setQuery(q);
        if (q) {
            params.set("q", q);
        } else {
            params.delete("q");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };
    const handleEmptySearch = async (q) => {
        setQuery(q);
        if (hasSearchResults) {
            await startAgain();
            fetchNotifications({ q }).then((res) => {
                const notifications = transformData(res?.hits || []);
                const updatedNotifications = formatOffsiteNotificationDate(notifications);

                setPage(res?.page);
                setLoading(false);
                if (updatedNotifications.length > 0) {
                    setNotificationsData((prevData) => {
                        const uniqueNotifications = updatedNotifications.filter(
                            (newNotification) =>
                                !prevData.some(
                                    (existingNotification) => existingNotification.uuid === newNotification.uuid
                                )
                        );
                        if ([...prevData, ...uniqueNotifications].length === res?.found) {
                            setLastPage(true);
                        } else {
                            setLastPage(false);
                        }
                        return [...prevData, ...uniqueNotifications];
                    });
                }
            });
        }
        setHasSearchResults(false);
        params.delete("q");

        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const sortColumn = async (sortByCol) => {
        setLastPage(false);
        let sortOrd = sortOrder;
        if (sortBy == sortByCol) {
            if (sortOrder == "asc") {
                setSortOrder("desc");
                sortOrd = "desc";
            } else {
                setSortOrder("asc");
                sortOrd = "asc";
            }
        } else {
            setSortBy(sortByCol);
            setSortOrder("asc");
            sortOrd = "asc";
        }

        setSortBy(sortByCol);
        await startAgain();
        const stateParams = await getSearchParams();
        setTimeout(() => {
            fetchNotifications({ q: stateParams.q, page: 1, sortby: sortByCol, sortOrder: sortOrd })
                .then((res) => {
                    const notifications = transformData(res?.hits);
                    const updatedNotifications = formatOffsiteNotificationDate(notifications);
                    setPage(1);
                    setLoading(false);
                    if (updatedNotifications.length > 0) {
                        setNotificationsData((prevData) => [...prevData, ...updatedNotifications]);
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })
                .finally((res) => {
                    console.log("finally", "res", res);
                    setLoading(false);
                });
        }, 1000);

        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sortByCol);
        params.set("sortOrder", sortOrd);
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    function sortingClasses(column, order) {
        let sort = "";
        if (sortBy == column) {
            sort = "sorting";
            if (order == "asc") {
                sort += " sorting_asc";
            } else if (order == "desc") {
                sort += " sorting_desc";
            }
        }

        return sort;
    }

    const convertToTitleCase = (inputString) => {
        return inputString?.charAt(0)?.toUpperCase() + inputString?.slice(1)?.toLowerCase();
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            findSearchResults(query);
        }
    };

    const openEllipse = (index, uuid) => {
        console.log(ellipsisRef);

        if (ellipsisRef.current) {
            console.log(ellipsisRef);
            const className = ellipsisRef.current.className;
            if (className === "btn" || className === "dropdown") {
                setEllipsisMenuOpen((prev) => !prev);
                setEllipsisMenuContent((prevContent) => (prevContent === uuid ? null : uuid));
            }
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            const isEllipsisClicked = event.target.closest(".fas.fa-ellipsis-h");

            // if (ellipsisMenuOpen && !isEllipsisClicked) {
            //     console.log("🚀 ~ handleClick menu~ :");
            //     setEllipsisMenuOpen(false);
            //     setEllipsisMenuContent(null);
            // }

            if (!event.target.closest(".menu")) {
                if (ellipsisMenuContent) {
                    console.log("🚀 ~ handleClick menu~ :", ellipsisMenuContent);
                    console.log("🚀 ~ handleClick menu ~ ", ellipsisMenuOpen);
                    setEllipsisMenuOpen(false);
                    setEllipsisMenuContent(null);
                }
            }
        }

        document.addEventListener("click", handleClickOutside, { capture: true });
        return () => {
            document.removeEventListener("click", handleClickOutside, { capture: true });
        };
    }, [ellipsisMenuOpen, ellipsisMenuContent]);

    const handleOptionClick = async (response, uuid, notificationId, vin, requestingDealerId, email, flag) => {
        console.log("🚀 ~ handleOptionClick ~ description:", email);

        let addSpaceToResponse = response;
        var requestingDealerEmail = email;
        // Display loading screen
        const loadingAlert = Swal.fire({
            allowOutsideClick: false,
            html: `
                <div style="text-align: center;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div style="margin-top: 10px;">Loading...</div>
                </div>`,
            showConfirmButton: false,
            showCancelButton: false
        });

        try {
            const result = await UpdateOffsiteNotificationResponse(notificationId, response, user?.displayName);
            try {
                // const requestingDealer = await getDealersById(requestingDealerId);
                // requestingDealerEmail = requestingDealer.ownerEmail;

                var MakesData = await GetMakeModelByVIN(vin);
            } catch (error) {
                console.error("🚀 ~ requesting dealer not found error:", error);
            }
            //update listings on UI after selecting a option
            const updatedListingIndex = notificationsData.findIndex((listing) => listing.uuid === uuid);
            const updatedListingIndexPusher = liveNotifications.findIndex((listing) => listing.vin === vin);

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
                                alt="THIScar"
                                src="https://storage.googleapis.com/tc-production-390801.appspot.com/thiscar/Logo.svg"
                                style="display: block; height: auto; border: 0; width: 100%; marginBottom:30px"
                                title="THIScar" width="300" /></div>
                </div>
                <div><br><br><br><br></div>
                <p>${
                    response.toLowerCase() === "saleconfirmed"
                        ? confirmSaleOrNoSale.saleConfirmed
                        : response.toLowerCase() === "vehicleunavailable"
                          ? confirmSaleOrNoSale.vehicleUnavailable
                          : "N/A"
                } <br/> <br/></p>
                <div class="label-data">
                    <div class="label">VIN:</div>
                    <div class="data">${vin}</div>
                </div>
                <div class="label-data">
                     <div class="label">Make & Model:</div>
                     <div class="data">${MakesData.year}\t${MakesData.make}\t${MakesData.model}\t${MakesData.trim}</div>
                </div>
       
                <div class="label-data">
                    <div class="label">Deal Status:</div>
                    <div class="data"> ${
                        addSpaceToResponse
                            ? addSpaceToResponse
                                  ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                                  ?.replace(/^\w/, (c) => c.toUpperCase())
                            : "N/A"
                    }</div>
                </div>
                <p> <br/> <br/><strong>Thank You,</strong></p>
                <p> THIScar</p>
                
            </div>
            </body>
            </html>
            
        `;
            // addSpaceToResponse ? addSpaceToResponse?.replace(/([a-z])([A-Z])/g, "$1 $2") : "N/A"

            const emailText = `VIN: ${vin ?? "N/A"}\n\nDeal Status: ${
                addSpaceToResponse ? addSpaceToResponse?.replace(/([a-z])([A-Z])/g, "$1 $2") : "N/A"
            }\n\nNotes: ${
                response.toLowerCase() === "saleconfirmed"
                    ? confirmSaleOrNoSale.saleConfirmed
                    : response.toLowerCase() === "vehicleunavailable"
                      ? confirmSaleOrNoSale.vehicleUnavailable
                      : "N/A"
            }
                \n\n`;

            const emailSubject = `Deal Confirmation ${vin}`;
            if (result.success) {
                loadingAlert.close();

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text:
                        response.toLowerCase() === "saleconfirmed"
                            ? confirmSaleOrNoSale.saleConfirmed
                            : response.toLowerCase() === "vehicleunavailable"
                              ? confirmSaleOrNoSale.vehicleUnavailable
                              : result.message ?? "N/A",
                    confirmButtonText: "Close",
                    timer: 7000,
                    timerProgressBar: true
                }).then(async (result) => {
                    console.log(requestingDealerEmail);
                    if (updatedListingIndex !== -1) {
                        const updatedListing = { ...notificationsData[updatedListingIndex] };
                        updatedListing.offsiteStatus = response;
                        const updatedNotificationsData = [...notificationsData];
                        updatedNotificationsData[updatedListingIndex] = updatedListing;
                        setNotificationsData(updatedNotificationsData);
                    } else {
                        console.error("Notification with UUID", uuid, "not found in notificationsData");
                    }
                    if (updatedListingIndexPusher !== -1) {
                        const updatedListing = {
                            ...liveNotifications[updatedListingIndexPusher],
                            offsiteStatus: response
                        };
                        const updatedLiveNotifications = [...liveNotifications];
                        updatedLiveNotifications[updatedListingIndexPusher] = updatedListing;
                        setLiveNotifications(updatedLiveNotifications);
                    } else {
                        console.error("Notification with UUID", uuid, "not found in liveNotifications");
                    }
                    if (requestingDealerEmail) {
                        await sendOffsiteEmail({
                            to: requestingDealerEmail,
                            cc: "",
                            bcc: "",
                            subject: emailSubject ?? "",
                            text: emailText ?? "",
                            html: emailHtml ?? ""
                        });
                    }
                });
            } else {
                loadingAlert.close();
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: result.message,
                    confirmButtonText: "Close",
                    timer: 7000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.log("🚀 ~ handleOptionClick ~ error:", error);
            loadingAlert.close();

            // Display error alert for any unexpected errors
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "An unexpected error occurred.",
                confirmButtonText: "Close",
                timer: 7000,
                timerProgressBar: true
            });
        }
    };

    return (
        <>
            <Toolbar
                pageName="Offsite Notifications"
                addNew={{ path1: "offsite-notifications" }}
            />
            <div className="notifications-styles">
                <div
                    className="post fs-6 d-flex flex-column-fluid"
                    id="kt_post">
                    <div className="container-xxl ">
                        <div className="card card-flush ">
                            <div className="card-header align-items-center py-5 gap-2 gap-md-5 display-inline">
                                <span className="mobile-view ">
                                    <div className="card-title">
                                        <div className="d-flex  align-items-center position-relative my-1 searchbar-width">
                                            <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                            </i>
                                            <input
                                                style={{ width: "100%" }}
                                                type="text"
                                                data-kt-ecommerce-product-filter="search"
                                                className="form-control form-control-solid ps-12"
                                                placeholder="Filter by VIN or user"
                                                value={query}
                                                onChange={(e) => {
                                                    handleChangeSearch(e.currentTarget.value);
                                                }}
                                                onKeyDown={handleKeyPress}
                                                defaultValue={searchParams.get("q")?.toString()}
                                            />
                                            <div className="position-relative buttonContainer-search right-custom">
                                                <button
                                                    onClick={() => {
                                                        handleEmptySearch("");
                                                    }}
                                                    disabled={!!!query}
                                                    type="button"
                                                    className="btn-close closeButton-search"></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-start">
                                        <button
                                            onClick={() => {
                                                findSearchResults(query);
                                            }}
                                            className="btn btn-primary searchbtn-width">
                                            Search
                                        </button>
                                    </div>
                                </span>
                                <span className="desktop-view">
                                    <div className="card-title">
                                        <div className="d-flex align-items-center position-relative my-1">
                                            <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                            </i>
                                            <input
                                                type="text"
                                                data-kt-ecommerce-product-filter="search"
                                                className="form-control form-control-solid w-300px ps-12"
                                                placeholder="Filter by VIN or user"
                                                value={query}
                                                onChange={(e) => {
                                                    handleChangeSearch(e.currentTarget.value);
                                                }}
                                                onKeyDown={handleKeyPress}
                                                defaultValue={searchParams.get("q")?.toString()}
                                            />
                                            <div className="position-relative buttonContainer-search right-custom">
                                                <button
                                                    onClick={() => {
                                                        handleEmptySearch("");
                                                    }}
                                                    disabled={!!!query}
                                                    type="button"
                                                    className="btn-close closeButton-search"></button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    findSearchResults(query);
                                                }}
                                                className="btn btn-primary">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </span>
                            </div>
                            <div className="card-body pt-0">
                                <div
                                    id="kt_ecommerce_products_table_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer notifications">
                                    <div className="table-responsive">
                                        <table
                                            className="overflow-x-auto w-100 table dataTable align-middle table-row-dashed fs-6 gy-0"
                                            id="kt_ecommerce_products_table">
                                            <thead>
                                                <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                                    <th
                                                        className={`cursor-pointer text-start min-w-90px ps-2 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("requestingDealerName", sortOrder)}`}
                                                        onClick={() => sortColumn("requestingDealerName")}>
                                                        Requesting Dealer
                                                    </th>

                                                    <th
                                                        className={`cursor-pointer text-start min-w-40px ps-2 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("dealerName", sortOrder)}`}
                                                        onClick={() => sortColumn("dealerName")}>
                                                        Inventory Owner
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer ps-2 text-start min-w-40px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("userName", sortOrder)}`}
                                                        onClick={() => sortColumn("userName")}>
                                                        User
                                                    </th>

                                                    <th
                                                        className={`cursor-pointer text-start min-w-60px ps-2 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("vin", sortOrder)}`}
                                                        onClick={() => sortColumn("vin")}>
                                                        VIN
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-70px ps-2 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("dealerStockId", sortOrder)}`}
                                                        onClick={() => sortColumn("dealerStockId")}>
                                                        Dealer Stock#
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-90px ps-2 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("type", sortOrder)}`}
                                                        onClick={() => sortColumn("type")}>
                                                        Type
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-90px ps-4 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("type", sortOrder)}`}
                                                        onClick={() => sortColumn("offsiteStatus")}>
                                                        Status
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ps-4 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("createdAt", sortOrder)}`}
                                                        onClick={() => sortColumn("createdAt")}>
                                                        Sent Date
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ps-5 ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        }`}>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="fw-semibold text-gray-600 fs-6">
                                                {!loading &&
                                                    notificationsData.length === 0 &&
                                                    liveNotifications.length === 0 && (
                                                        <tr>
                                                            <td colSpan="12">No records found...</td>
                                                        </tr>
                                                    )}

                                                {liveNotifications.map((notification, index) => (
                                                    <tr key={index}>
                                                        <td className="text-start pe-0">
                                                            {notification?.requestingDealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {notification?.dealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {notification?.userName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <span
                                                                className={`fw-bold ${
                                                                    notification?.vin != null ? "purple-text" : ""
                                                                }`}>
                                                                {notification?.vin || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            <span className="fw-bold me-3">
                                                                {notification?.dealerStockId || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0 notification-type">
                                                            <span
                                                                className={`fw-bold oval ${getNotificationColorForType(
                                                                    notification?.type
                                                                )}`}>
                                                                {convertToTitleCase(notification?.type) || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            {notification?.offsiteStatus === "saleConfirmed" ? (
                                                                <span className="fw-bold me-0 ms-3">
                                                                    Sale Confirmed
                                                                </span>
                                                            ) : notification?.offsiteStatus === "vehicleUnavailable" ? (
                                                                <span className="fw-bold me-0 ms-3">No Sale</span>
                                                            ) : (
                                                                <span className="fw-bold me-0 ms-3">N/A</span>
                                                            )}
                                                        </td>
                                                        <td className="text-start pe-0 ps-5">
                                                            {convertDateToLocalTime(notification?.createdAt) || "N/A"}
                                                        </td>
                                                        <td
                                                            className="text-center"
                                                            style={{ width: "40px" }}>
                                                            {/* Ellipsis menu */}

                                                            <div
                                                                className="dropdown"
                                                                onClick={() => openEllipse(index, notification.uuid)}>
                                                                <button
                                                                    className="btn"
                                                                    type="button"
                                                                    ref={ellipsisRef}>
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </button>
                                                                {ellipsisMenuContent === notification.uuid &&
                                                                    ellipsisMenuOpen && (
                                                                        <div
                                                                            className="top-100 position-absolute postion_set show menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-200px show"
                                                                            data-kt-menu="true">
                                                                            <div className="menu-item px-3 my-0">
                                                                                <div className="menu-link px-3 py-1">
                                                                                    <button
                                                                                        className="btn btn-link"
                                                                                        onClick={() =>
                                                                                            handleOptionClick(
                                                                                                "saleConfirmed",
                                                                                                notification.uuid,
                                                                                                notification?.notificationId,
                                                                                                notification?.vin,
                                                                                                notification?.requestingDealerId,
                                                                                                notification?.email,
                                                                                                true
                                                                                            )
                                                                                        }>
                                                                                        {/* Sale Confirmed */}
                                                                                        <span
                                                                                            style={{
                                                                                                marginLeft: "10px",
                                                                                                color:
                                                                                                    notification?.offsiteStatus ===
                                                                                                    "saleConfirmed"
                                                                                                        ? "Highlight"
                                                                                                        : ""
                                                                                            }}>
                                                                                            {notification?.offsiteStatus ===
                                                                                            "saleConfirmed"
                                                                                                ? "\u2713" +
                                                                                                  "\tSale Confirmed"
                                                                                                : "\tSale Confirmed"}
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                                <hr
                                                                                    className="dropdown-divider m-0"
                                                                                    style={{
                                                                                        borderTop:
                                                                                            "1px solid rgba(0,0,0,.15)"
                                                                                    }}
                                                                                />

                                                                                <div className="menu-link px-3 py-1 mt-1">
                                                                                    <button
                                                                                        className="btn btn-link"
                                                                                        onClick={() =>
                                                                                            handleOptionClick(
                                                                                                "vehicleUnavailable",
                                                                                                notification.uuid,
                                                                                                notification?.notificationId,
                                                                                                notification?.vin,
                                                                                                notification?.requestingDealerId,
                                                                                                notification?.email,
                                                                                                true
                                                                                            )
                                                                                        }>
                                                                                        <span
                                                                                            style={{
                                                                                                marginLeft: "5px",
                                                                                                color:
                                                                                                    notification?.offsiteStatus ===
                                                                                                    "vehicleUnavailable"
                                                                                                        ? "Highlight"
                                                                                                        : ""
                                                                                            }}>
                                                                                            {notification?.offsiteStatus ===
                                                                                            "vehicleUnavailable"
                                                                                                ? "\u2713" +
                                                                                                  "\tVehicle Unavailable"
                                                                                                : "\tVehicle Unavailable"}
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {notificationsData.map((notification, index) => (
                                                    <tr key={index}>
                                                        <td className="text-start pe-0">
                                                            {notification?.requestingDealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {notification?.dealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {notification?.userName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <span
                                                                className={`fw-bold ${
                                                                    notification?.vin != null ? "purple-text" : ""
                                                                }`}>
                                                                {notification?.vin || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            <span className="fw-bold me-3">
                                                                {notification?.dealerStockId || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0 notification-type">
                                                            <span
                                                                className={`fw-bold oval ${getNotificationColorForType(
                                                                    notification?.type
                                                                )}`}>
                                                                {convertToTitleCase(notification?.type) || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            {notification?.offsiteStatus === "saleConfirmed" ? (
                                                                <span className="fw-bold me-0 ms-3">
                                                                    Sale Confirmed
                                                                </span>
                                                            ) : notification?.offsiteStatus === "vehicleUnavailable" ? (
                                                                <span className="fw-bold me-0 ms-3">No Sale</span>
                                                            ) : (
                                                                <span className="fw-bold me-0 ms-3">N/A</span>
                                                            )}
                                                        </td>

                                                        <td className="text-start pe-0 ps-5">
                                                            {notification?.createdAt || "N/A"}
                                                        </td>
                                                        <td
                                                            className="text-center"
                                                            style={{ width: "40px" }}>
                                                            {/* Ellipsis menu */}

                                                            <div
                                                                //  ref={ellipsisRef}
                                                                className="dropdown"
                                                                onClick={() => openEllipse(index, notification.uuid)}>
                                                                <button
                                                                    className="btn"
                                                                    type="button"
                                                                    ref={ellipsisRef}
                                                                    //   id={`ellipsisMenu${index}`}
                                                                    //  data-bs-toggle="dropdown"
                                                                    //  aria-expanded="false"
                                                                    //</div> onClick={() => openEllipse(index)}
                                                                >
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </button>
                                                                {ellipsisMenuContent === notification.uuid &&
                                                                    ellipsisMenuOpen && (
                                                                        <div
                                                                            className="top-100 position-absolute postion_set show menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-200px show"
                                                                            data-kt-menu="true">
                                                                            <div className="menu-item px-3 my-0">
                                                                                <div className="menu-link px-3 py-1">
                                                                                    <button
                                                                                        className="btn btn-link"
                                                                                        onClick={() =>
                                                                                            handleOptionClick(
                                                                                                "saleConfirmed",
                                                                                                notification.uuid,
                                                                                                notification?.id,
                                                                                                notification?.vin,
                                                                                                notification?.requestingDealerId,
                                                                                                notification?.email,
                                                                                                false
                                                                                            )
                                                                                        }>
                                                                                        <span
                                                                                            style={{
                                                                                                marginLeft: "10px",
                                                                                                color:
                                                                                                    notification?.offsiteStatus ===
                                                                                                    "saleConfirmed"
                                                                                                        ? "Highlight"
                                                                                                        : ""
                                                                                            }}>
                                                                                            {notification?.offsiteStatus ===
                                                                                            "saleConfirmed"
                                                                                                ? "\u2713" +
                                                                                                  "\tSale Confirmed"
                                                                                                : "\tSale Confirmed"}
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                                <hr
                                                                                    className="dropdown-divider m-0"
                                                                                    style={{
                                                                                        borderTop:
                                                                                            "1px solid rgba(0,0,0,.15)"
                                                                                    }}
                                                                                />

                                                                                <div className="menu-link px-3 py-1 mt-1">
                                                                                    <button
                                                                                        className="btn btn-link"
                                                                                        onClick={() =>
                                                                                            handleOptionClick(
                                                                                                "vehicleUnavailable",
                                                                                                notification.uuid,
                                                                                                notification?.id,
                                                                                                notification?.vin,
                                                                                                notification?.requestingDealerId,
                                                                                                notification?.email,
                                                                                                false
                                                                                            )
                                                                                        }>
                                                                                        <span
                                                                                            style={{
                                                                                                marginLeft: "5px",
                                                                                                color:
                                                                                                    notification?.offsiteStatus ===
                                                                                                    "vehicleUnavailable"
                                                                                                        ? "Highlight"
                                                                                                        : ""
                                                                                            }}>
                                                                                            {notification?.offsiteStatus ===
                                                                                            "vehicleUnavailable"
                                                                                                ? "\u2713" +
                                                                                                  "\tVehicle Unavailable"
                                                                                                : "\tVehicle Unavailable"}
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {loading && (
                                        <div className="admin-loading">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default OffsiteNotifications;
