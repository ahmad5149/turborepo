"use client";
import { useState, React, useContext, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import { fetchNotifications } from "../../../services/offsiteNotificationsService";
import "../../../contents/admin/scss/notifications.scss";
import { pusherClient } from "@/utils/pusher/client";
import AppContext from "@/StateManagement/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatThisCarNotificationDate, formatTimestamp } from "../../../utils/helpers/dateFormatter";
import { formatOffsiteNotificationDate } from "../../../utils/helpers/dateFormatter";
import { debounce } from "lodash";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import moment from "moment-timezone";
// import "../../../../src/contents/admin/scss/mobileListings.scss";
import Link from "next/link";
import { NotificationMobileRow } from "./NotificationMobileRow";
import { transformData } from "./Utilities";

function NotificationMobileListings({ notifications }) {
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
    const pathname = usePathname();
    const routerNav = useRouter();

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
    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
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

    return (
        <>
            <Toolbar
                pageName="Offsite Notifications"
                addNew={{ path1: "offsite-notifications" }}
            />
            <div className="container-xxl notifications-styles">
                <div className="card card-flush">
                    <div className="mobile-dealers text-center m-auto align-items-center py-5 gap-2 gap-md-5">
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
                                    placeholder="Filter by dealer name or VIN"
                                    value={query}
                                    onChange={(e) => {
                                        handleChangeSearch(e.target.value);
                                    }}
                                    onKeyDown={handleKeyPress}
                                    defaultValue={searchParams.get("q")?.toString()}
                                />

                                {/* <div className="position-relative buttonContainer-search right-custom">
                                    <button
                                        onClick={() => {
                                            findSearchResults(query);
                                        }}
                                        className="btn-close closeButton-search">
                                        Search
                                    </button>
                                </div> */}
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
                            <button
                                onClick={() => {
                                    findSearchResults(query);
                                }}
                                className="btn btn-primary w-100">
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div className="table-responsive ">
                            <div
                                className="accordion notifications"
                                id="accordionExampleDealer">
                                <table className="table align-middle table-row-dashed fs-6 gy-0">
                                    <tbody className="fw-semibold text-gray-600">
                                        {!loading && notificationsData.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center">
                                                    No record found...
                                                </td>
                                            </tr>
                                        )}

                                        {notificationsData.map((notification, index) => (
                                            <NotificationMobileRow
                                                key={index}
                                                index={index}
                                                notification={notification}
                                                parentId={"#accordionExampleDealer"}
                                                handleLink={handleLink}
                                            />
                                        ))}

                                        {loading && (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center">
                                                    <div className="admin-loading">
                                                        <LoadingSpinner />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default NotificationMobileListings;
