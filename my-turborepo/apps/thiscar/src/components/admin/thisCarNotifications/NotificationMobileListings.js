"use client";
import { useState, React, useContext, useEffect } from "react";
import { memo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import { fetchNotifications ,fetchNotificationsForExport} from "../../../services/notificationsService";
import "../../../contents/admin/scss/notifications.scss";
import { pusherClient } from "@/utils/pusher/client";
import { NotificationLogs } from "./partials/NotificationLogs";
import AppContext from "@/StateManagement/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatThisCarNotificationDate, formatTimestamp } from "../../../utils/helpers/dateFormatter";
import { debounce } from "lodash";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import moment from "moment-timezone";
// import "../../../../src/contents/admin/scss/mobileListings.scss";
import { NotificationMobileRow } from "./NotificationMobileRow";
import { downloadXLS } from "../../../utils/downloadXLS";

function NotificationMobileListings({ notifications, notificationFound, allNotifications = [] }) {
    const searchParams = useSearchParams();
    const { setNotificationId } = useContext(AppContext);
    const [exportListingPopup, setExportListingPopup] = useState(false);

    const params = new URLSearchParams(searchParams);

    const [notificationsData, setNotificationsData] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(notificationFound);
    const [loading, setLoading] = useState(false);
    var [selectedStatus, setSelectedStatus] = useState("");
    var [selectedType, setSelectedType] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [vinId, setVinId] = useState("");
    const [requestedUser, setRequestedUser] = useState("");
    const [requestedTime, setRequestedTime] = useState("");
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState(params.get("sortOrder") ? params.get("sortOrder") : "desc");
    const [sortBy, setSortBy] = useState(params.get("sortBy") ? params.get("sortBy") : "dateOfAttempt._seconds");
    const [query, setQuery] = useState(null);
    const [hasSearchResults, setHasSearchResults] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const pathname = usePathname();
    const routerNav = useRouter();
    const [liveNotifications, setLiveNotifications] = useState([]);

    const channelName = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "dev";

    const filterNotifications = (prevNotifications, data) => {
        const existingIndex = prevNotifications.findIndex(
            (prevNotification) => prevNotification.uuid == data.uuid && prevNotification.attempt === data.attempt
        );
        if (data.status === "expired") {
            if (existingIndex !== -1) {
                prevNotifications.splice(existingIndex, 1);
            }
            return prevNotifications;
        } else if (existingIndex !== -1) {
            const updatedNotifications = [...prevNotifications];
            const conflictedData = updatedNotifications[existingIndex];
            data.createdAt = conflictedData.createdAt;
            // data.responseDate = data.responseDate
            //     ? data.responseDate._nanoseconds
            //         ? formatTimestamp(data.responseDate)
            //         : convertDateToLocalTime(data.responseDate)
            //     : "N/A";
            data.dateOfAttempt = data.dateOfAttempt
                ? data.dateOfAttempt?._nanoseconds
                    ? formatTimestamp(data.dateOfAttempt)
                    : convertDateToLocalTime(data.dateOfAttempt)
                : "N/A";
            updatedNotifications[existingIndex] = data;
            return updatedNotifications;
        } else {
            const filteredNotifications = prevNotifications.filter(
                (prevNotification) => prevNotification.uuid !== data.uuid
            );

            return [data, ...filteredNotifications];
        }
    };

    useEffect(() => {
        const channel = pusherClient.subscribe("notification").bind(channelName, (data) => {
            if (data.uuid) {
                setLiveNotifications((prevNotifications) => filterNotifications(prevNotifications, data));

                setNotificationsData((prevNotifications) => {
                    const updatedNotifications = prevNotifications.filter(
                        (prevNotification) => prevNotification.uuid !== data.uuid
                    );

                    return updatedNotifications;
                });
            }
        });

        return () => {
            channel.unbind();
        };
    }, []);

    async function startAgain() {
        setNotificationsData([]);
        setLiveNotifications([]);
        setLoading(true);
    }
    async function getSearchParams() {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        const status = params.get("status") || "";
        const type = params.get("type") || "";
        const sortByCol = params.get("sortBy") || sortBy;
        const sortOrderCol = params.get("sortOrder") || sortOrder;
        return { q, status, type, sortByCol, sortOrderCol };
    }

    async function fetchData(q, status, type, sortBy, sortOrder) {
        setNotificationsData([]);
        setLoading(true);

        fetchNotifications({ q, page: 1, status, type, sortby: sortBy, sortOrder: sortOrder })
            .then((res) => {
                setTotalNotifications(res.found);
                const notifications = res?.hits?.map((item) => item.document) || [];
                const updatedNotifications = formatThisCarNotificationDate(notifications);
                setPage(1);
                setLoading(false);
                if (updatedNotifications.length > 0) {
                    setNotificationsData((prevData) => [...prevData, ...updatedNotifications]);
                }
            })
            .catch((error) => {
                console.error("Error in main code:", error.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        const updatedNotifications = formatThisCarNotificationDate(notifications);
        setNotificationsData(updatedNotifications);
    }, []);

    const handleStatusAndTypeFilter = async (status, type) => {
        //await startAgain();
        setLastPage(false);
        let typeUpd = type;
        let statusUpd = status;
        const stateParams = await getSearchParams();
        if (status !== "All" && status !== "") {
            params.set("status", status);
        } else {
            statusUpd = null;
            params.delete("status");
        }

        if (type !== "All" && type !== "") {
            params.set("type", type);
        } else {
            typeUpd = null;
            params.delete("type");
        }

        fetchData(stateParams.q, statusUpd, typeUpd, stateParams.sortByCol, stateParams.sortOrderCol);

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
            setSortOrder("asc"); // Default to ascending order
            sortOrd = "asc";
        }

        setSortBy(sortByCol);
        await startAgain();
        const stateParams = await getSearchParams();
        setTimeout(() => {
            fetchNotifications({
                q: stateParams.q,
                page: 1,
                sortby: sortByCol,
                sortOrder: sortOrd,
                type: selectedType,
                status: selectedStatus
            })
                .then((res) => {
                    setTotalNotifications(res.found);
                    const notifications = res?.hits?.map((item) => item.document) || [];
                    const updatedNotifications = formatThisCarNotificationDate(notifications);
                    setPage(1);
                    setLoading(false);
                    if (updatedNotifications.length > 0) {
                        setNotificationsData((prevData) => [...prevData, ...updatedNotifications]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 1000);

        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sortByCol);
        params.set("sortOrder", sortOrd);
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const convertDateToLocalTime = (date) => {
        if (!date) return null;
        const utcDate = moment.utc(date, "MMM D, YYYY, h:mm:ss A");
        const localDate = utcDate.local();
        const formattedDateTime = localDate.format("MMM D, YYYY, h:mm A");
        return formattedDateTime;
    };

    const showNotificationLogs = (vin, notificationId, createdAt, createdBy) => {
        console.log("clicked");
        setVinId(vin);
        setShowLogs(true);
        setNotificationId(notificationId);
        setRequestedUser(createdBy);
        setRequestedTime(createdAt._nanoseconds ? formatTimestamp(createdAt) : convertDateToLocalTime(createdAt));
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
                setTotalNotifications(res.found);
                const notifications = res?.hits?.map((item) => item.document);
                const updatedNotifications = formatThisCarNotificationDate(notifications);
                setPage(res?.page);
                setLoading(false);
                if (updatedNotifications?.length > 0) {
                    setNotificationsData((prevData) => {
                        const uniqueNotifications = updatedNotifications.filter(
                            (newNotification) =>
                                !prevData.some(
                                    (existingNotification) => existingNotification.uuid === newNotification.uuid
                                )
                        );
                        if ([...prevData, ...uniqueNotifications].length === res?.found) {
                            setLastPage(true);
                        } else setLastPage(false);

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

    const findSearchResults = async (q) => {
        setHasSearchResults(true);
        setSortBy("dateOfAttempt._seconds");
        await startAgain();
        setSortOrder("desc");
        const params = new URLSearchParams(searchParams);
        const sortby = params.get("sortBy");
        const sortOrder = params.get("sortOrder");
        const getQuery = params.get("q") || q;
        fetchNotifications({ q: getQuery, sortby, sortOrder }).then((res) => {
            setTotalNotifications(res.found);
            const notifications = res?.hits?.map((item) => item?.document);
            const updatedNotifications = formatThisCarNotificationDate(notifications);

            setPage(res?.page);
            setLoading(false);
            if (updatedNotifications?.length) {
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

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            findSearchResults(query);
        }
    };

    const handleInfiniteScroll = async () => {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q");
        const sortby = params.get("sortBy");
        const sortOrder = params.get("sortOrder");
        const status = params.get("status");
        const type = params.get("type");

        const { scrollTop, clientHeight, scrollHeight } = document?.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
            try {
                if (!lastPage) {
                    setLoading(true);

                    const res = await fetchNotifications({ type, status, page: page + 1, q, sortby, sortOrder });
                    setTotalNotifications(res.found);
                    const notifications = res?.hits.map((item) => item.document) || [];
                    const updatedNotifications = formatThisCarNotificationDate(notifications);

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

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };

    const handleStatusChange = async (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        const stateParams = await getSearchParams();
        handleStatusAndTypeFilter(selectedStatus, stateParams.type);
    };
    function addSuffix(number) {
        if (number === undefined || number === null) {
            return "N/A";
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const remainderTen = number % 10;
        const remainderHundred = number % 100;

        return number + suffixes[remainderTen <= 3 && remainderHundred !== 11 ? remainderTen : 0];
    }

    const openExportListingModal = () => {
        setExportListingPopup(true);
    };

    const closeExportListingModal = () => {
        setExportListingPopup(false);
    };
    const handleTypeChange = async (selectedType) => {
        setSelectedType(selectedType);
        const stateParams = await getSearchParams();

        handleStatusAndTypeFilter(stateParams.status, selectedType);
    };

    return (
        <>
            <Toolbar
                pageName="ThisCar Notifications"
                addNew={{ path1: "thiscar-notifications" }}
            />
            <div className="container-xxl notifications-styles">
                {showLogs && (
                    <NotificationLogs
                        vinId={vinId}
                        setShowLogs={setShowLogs}
                        requestedUser={requestedUser}
                        requestedTime={requestedTime}
                    />
                )}

                <div className="text-start mb-2 notifications-found-label">
                    {" "}
                    {totalNotifications == "N/A" || !totalNotifications ? 0 : totalNotifications} Notifications found
                </div>
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

                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                <div className="w-100 mw-150px">
                                    <div className="form-floating">
                                        <select
                                            id="statusSelect"
                                            className="form-select form-select-solid"
                                            data-control="select2"
                                            data-hide-search="true"
                                            data-placeholder="status"
                                            onChange={(e) => {
                                                handleStatusChange(e.target.value);
                                            }}
                                            defaultValue={searchParams.get("status")?.toString()?.toLowerCase()}
                                            data-kt-ecommerce-product-filter="status">
                                            <option
                                                value="All"
                                                disabled={true}>
                                                Filter
                                            </option>
                                            <option value="All">All</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="submitted">Submitted</option>
                                            <option value="expired">Expired</option>
                                            <option value="declined">Declined</option>
                                        </select>
                                        <label htmlFor="statusSelect">Status</label>
                                    </div>
                                </div>
                                <div className="w-100 mw-150px">
                                    <div className="form-floating">
                                        <select
                                            className="form-select form-select-solid"
                                            data-control="select2"
                                            data-hide-search="true"
                                            data-placeholder="Filter"
                                            onChange={(e) => {
                                                handleTypeChange(e.target.value);
                                            }}
                                            defaultValue={searchParams.get("type")?.toString()?.toLowerCase()}
                                            data-kt-ecommerce-product-filter="type">
                                            <option
                                                value="All"
                                                disabled={true}>
                                                Filter
                                            </option>
                                            <option value="All">All</option>
                                            <option value="available">Available</option>
                                            <option value="24hourhold">24 hour hold</option>
                                            <option value="purchase">Purchase</option>
                                        </select>
                                        <label htmlFor="statusSelect">Type</label>
                                    </div>
                                </div>
                                <div className="w-80 mw-150px">
                                    <div className="form-floating">
                                        <button
                                            onClick={() => {
                                                openExportListingModal(allNotifications);
                                            }}
                                            className="btn btn-primary">
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div className="table-responsive">
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
                                                showNotificationLogs={showNotificationLogs}
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
                {exportListingPopup && <DownloadNotificationFilters closeExportListingModal={closeExportListingModal} />}

            </div>
        </>
    );
}
export default NotificationMobileListings;

function DownloadNotificationFilters({ closeExportListingModal }) {
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    function addSuffix(number) {
        if (number === undefined || number === null) {
            return "N/A";
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const remainderTen = number % 10;
        const remainderHundred = number % 100;

        return number + suffixes[remainderTen <= 3 && remainderHundred !== 11 ? remainderTen : 0];
    }
    
    const downloadNotifications = (allNotifications) => {
        const headers = [
            "Dealer",
            "User",
            "VIN",
            "Dealer stock#",
            "Type",
            "Attempt",
            "Status",
            "Answer via",
            "Sent Date",
            "Date of response",
            "Notes"
        ]; // Define headers
        const filename = "THIScarNotifications";

        const extractedFields = allNotifications.map((item) => [
            item.document.dealerName,
            item.document.contactName,
            item.document.vin,
            item.document.stockId,
            item.document.type,
            addSuffix(item.document.attempt),
            item.document.status,
            item.document.answerVia,
            item.document?.dateOfAttempt
                ? item.document?.dateOfAttempt._nanoseconds
                    ? formatTimestamp(item.document?.dateOfAttempt)
                    : convertDateToLocalTime(item.document?.dateOfAttempt)
                : "N/A",
            item.document?.responseDate && item.document.status.toLowerCase() != "submitted"
                ? item.document?.responseDate?._nanoseconds
                    ? formatTimestamp(item.document?.responseDate)
                    : convertDateToLocalTime(item.document?.responseDate)
                : "N/A",

            item.document.responseMessage
        ]);
        downloadXLS(extractedFields, headers, filename);
    };

    const fetchResults = () => {
        if (startDate && !endDate) {
            setError("Please select valid dates.");
        } else {
            let utcStartInSeconds = "";
            let utcEndInSeconds = "";
            (async () => {
                // setLoading(true);
                if (startDate && endDate) {
                    var selectedStartDate = new Date(startDate);
                    selectedStartDate.setHours(0, 0, 0, 0);

                    var selectedEndDate = new Date(endDate);
                    selectedEndDate.setHours(23, 59, 59, 999);

                    utcStartInSeconds = Math.floor(selectedStartDate.getTime() / 1000);
                    utcEndInSeconds = Math.floor(selectedEndDate.getTime() / 1000);
                }
                const filteredNotifications = await fetchNotificationsForExport(utcStartInSeconds, utcEndInSeconds);  
                if(filteredNotifications && filteredNotifications.length > 0)
                {
                    downloadNotifications(filteredNotifications);
                    closeExportListingModal();
                }  
                else
                {
                    Swal.fire({
                        title: 'No notifications found against the selected range',
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Okay"
                    }).then(async (result) => {
                    });
                }
            })();

            document.body.style.overflow = "auto";
        }
    };
    return (
        <>
            <div className="overlay"></div>
            <div
                className={`modal fade ${true ? "show" : ""}`}
                id="export-listing-modal"
                tabIndex="-1"
                aria-labelledby="export-listing-modal"
                style={{ display: true ? "block" : "none" }}
                aria-hidden={!true}>
                <div className="modal-dialog modal-dialog-centered ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Export Notifications</h5>
                            <button
                                type="button"
                                className="btn-close closeModal"
                                aria-label="Close"
                                onClick={() => {
                                    closeExportListingModal();
                                }}></button>
                        </div>
                        <div
                            className="modal-body pb-0"
                            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            <div
                                className="pb-8"
                                style={{ textAlign: "start" }}>
                                <label
                                    className="ms-3 text-start w-100"
                                    htmlFor="dateRange">
                                    Date
                                </label>
                                <DatePicker
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange={true}
                                    onChange={(updatedDates) => {
                                        let [start, end] = updatedDates;

                                        setStartDate(start);
                                        setEndDate(end);
                                        setError("");
                                    }}
                                    isClearable={startDate || endDate} // Conditionally set isClearable based on startDate and endDate
                                    className="ms-2 form-control form-control-solid"
                                    placeholderText="Select date range"
                                    icon="bi bi-calendar-check"
                                />
                            </div>
                            {!!error?.length && <div style={{ textAlign: "start", color: "red" }}>{error}</div>}
                            <div
                                className="modal-footer"
                                style={{ justifyContent: "center" }}>
                                <button
                                    type="button"
                                    className="btn btn-primary custom_btn"
                                    onClick={fetchResults}>
                                    Export Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
