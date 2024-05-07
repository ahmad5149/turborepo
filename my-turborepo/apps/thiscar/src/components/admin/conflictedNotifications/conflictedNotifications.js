"use client";
import { useState, React, useContext, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import { fetchConflictedNotifications, EditNotificationResponse } from "../../../services/notificationsService";
import "../../../contents/admin/scss/notifications.scss";
import { pusherClient } from "@/utils/pusher/client";
import { NotificationLogs } from "../thisCarNotifications/partials/NotificationLogs";
import { EditNotification } from "../thisCarNotifications/partials/EditNotification";
import AppContext from "@/StateManagement/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatThisCarNotificationDate, formatTimestamp } from "../../../utils/helpers/dateFormatter";
import { debounce } from "lodash";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import { useAuth } from "@/components/auth";

function ThisCarNotifications({ notifications, notificationFound }) {
    const user = useAuth();
    const searchParams = useSearchParams();
    const { setNotificationId } = useContext(AppContext);

    const params = new URLSearchParams(searchParams);

    const [notificationsData, setNotificationsData] = useState([]);
    const [requestedUser, setRequestedUser] = useState("");
    const [requestedTime, setRequestedTime] = useState("");
    const [totalNotifications, setTotalNotifications] = useState(notificationFound);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");
    const [showLogs, setShowLogs] = useState(false);
    const [editNotification, setEditNotification] = useState(false);
    const [vinId, setVinId] = useState("");
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
    0;
    useEffect(() => {
        const channel = pusherClient.subscribe("conflict").bind(channelName, (data) => {
            if (data.uuid) {
                if (data.removeItem) {
                    setLiveNotifications((prevNotifications) => {
                        const index = prevNotifications.findIndex((notification) => notification.uuid === data.uuid);
                        if (index !== -1) {
                            const updatedNotifications = [...prevNotifications];
                            updatedNotifications.splice(index, 1);
                            return updatedNotifications;
                        }
                        return prevNotifications;
                    });

                    setNotificationsData((prevNotificationsData) => {
                        const index = prevNotificationsData.findIndex(
                            (notification) => notification.uuid === data.uuid
                        );
                        if (index !== -1) {
                            const updatedNotificationsData = [...prevNotificationsData];
                            updatedNotificationsData.splice(index, 1);
                            return updatedNotificationsData;
                        }
                        return prevNotificationsData;
                    });
                } else {
                    setLiveNotifications((prevNotifications) => [data, ...prevNotifications]);
                }
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

        fetchConflictedNotifications({ q, page: 1, status, type, sortby: sortBy, sortOrder: sortOrder })
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
                // Handle the error if needed
                console.error("Error in main code:", error.message);
                setLoading(false);
                //return 0;
            });
    }

    const updateResponse = async (response, notificationId) => {
        setEditNotification(false);

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
            const result = await EditNotificationResponse(notificationId, response, user?.displayName);

            if (result.success) {
                loadingAlert.close();

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: result.message,
                    confirmButtonText: "OK"
                }).then(async (result) => {
                    // Check if the user clicked "OK"
                    if (result.isConfirmed) {
                        await startAgain();

                        setTimeout(async () => {
                            const params = await getSearchParams();
                            await fetchData(...Object.values(params));
                        }, 2000);
                    }
                });
            } else {
                loadingAlert.close();

                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: result.message,
                    confirmButtonText: "OK"
                });
            }
        } catch (error) {
            loadingAlert.close();

            // Display error alert for any unexpected errors
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "An unexpected error occurred.",
                confirmButtonText: "OK"
            });
        }
    };

    useEffect(() => {
        const updatedNotifications = formatThisCarNotificationDate(notifications);
        setNotificationsData(updatedNotifications);
    }, []);

    const getNotificationColorForType = (value) => {
        if (value != null) {
            value = value.replace(/\s/g, ""); // Removes spaces - 24 hour hold

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
    const getNotificationColorForStatus = (status, conflictedStatus = false) => {
        if (conflictedStatus === true) {
            return "status-conflicted"; // Apply a specific class for conflicted status
        }

        if (status != null) {
            switch (status.toLowerCase()) {
                case "accepted":
                    return "status-accepted";
                case "submitted":
                    return "status-submitted";
                case "expired":
                    return "status-expired";
                case "declined":
                    return "status-declined";
                default:
                    return "status-default";
            }
        } else {
            return "status-default";
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
            setSortOrder("asc"); // Default to ascending order
            sortOrd = "asc";
        }

        setSortBy(sortByCol);
        await startAgain();
        const stateParams = await getSearchParams();
        setTimeout(() => {
            fetchConflictedNotifications({ q: stateParams.q, page: 1, sortby: sortByCol, sortOrder: sortOrd })
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

    function addSuffix(number) {
        if (number === undefined || number === null) {
            return "N/A";
        }

        const suffixes = ["th", "st", "nd", "rd"];
        const remainderTen = number % 10;
        const remainderHundred = number % 100;

        return number + suffixes[remainderTen <= 3 && remainderHundred !== 11 ? remainderTen : 0];
    }

    const openModal = () => {
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = "auto";
    };

    const showNotificationLogs = (vin, notificationId, createdAt, createdBy) => {
        setVinId(vin);
        setShowLogs(true);
        setNotificationId(notificationId);
        setRequestedUser(createdBy);
        setRequestedTime(createdAt._nanoseconds ? formatTimestamp(createdAt) : convertDateToLocalTime(createdAt));
    };
    const editNotificationResponse = (notificationId) => {
        setEditNotification(true);
        setNotificationId(notificationId);
    };

    const convertToTitleCase = (inputString) => {
        if (inputString === "24hourhold") {
            return "24hr hold";
        }
        return inputString?.charAt(0)?.toUpperCase() + inputString?.slice(1)?.toLowerCase();
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
            fetchConflictedNotifications({ q }).then((res) => {
                setTotalNotifications(res.found);
                const notifications = res?.hits.map((item) => item.document);
                const updatedNotifications = formatThisCarNotificationDate(notifications);
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
                            console.log("no");

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

    const findSearchResults = async (q) => {
        setHasSearchResults(true);
        setSortBy("dateOfAttempt._seconds");
        await startAgain();
        setSortOrder("desc");
        const params = new URLSearchParams(searchParams);
        const sortby = params.get("sortBy");
        const sortOrder = params.get("sortOrder");
        const getQuery = params.get("q") || q;
        fetchConflictedNotifications({ q: getQuery, sortby, sortOrder }).then((res) => {
            setTotalNotifications(res.found);
            const notifications = res?.hits.map((item) => item.document);
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

                    const res = await fetchConflictedNotifications({
                        type,
                        status,
                        page: page + 1,
                        q,
                        sortby,
                        sortOrder
                    });
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
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    return (
        <>
            <Toolbar
                pageName="ThisCar Notifications Queue"
                addNew={{ path1: "notifications-queue" }}
            />
            <div className="notifications-styles">
                {showLogs && (
                    <NotificationLogs
                        vinId={vinId}
                        setShowLogs={setShowLogs}
                        requestedUser={requestedUser}
                        requestedTime={requestedTime}
                    />
                )}
                {editNotification && (
                    <EditNotification
                        setShowEdit={setEditNotification}
                        updateResponse={updateResponse}
                    />
                )}
                <ToastContainer />

                <div
                    className={`modal fade ${modalOpen ? "show" : ""}`}
                    id="notification-response-message-modal"
                    tabIndex="-1"
                    aria-labelledby="notification-response-message-modal"
                    style={{ display: modalOpen ? "block" : "none" }}
                    aria-hidden={!modalOpen}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Response Details</h5>
                                <button
                                    type="button"
                                    className="btn-close closeModal"
                                    aria-label="Close"
                                    onClick={() => {
                                        closeModal();
                                    }}></button>
                            </div>
                            <div
                                className="modal-body"
                                style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                                <p>{selectedDescription}</p>
                            </div>
                            <div
                                className="modal-footer"
                                style={{ justifyContent: "center" }}>
                                <button
                                    type="button"
                                    className="btn btn-primary custom_btn"
                                    onClick={() => {
                                        closeModal();
                                    }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*begin::Post*/}
                <div
                    className="post fs-6 d-flex flex-column-fluid"
                    id="kt_post">
                    {/*begin::Container*/}
                    <div className="container-xxl">
                        <div className="text-start mb-2 notifications-found-label">
                            {totalNotifications == "N/A" || !totalNotifications ? 0 : totalNotifications} Notifications
                            found
                        </div>
                        {/*begin::Products*/}
                        <div className="card card-flush">
                            {/*begin::Card header*/}
                            <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                                {/*begin::Card title*/}
                                <div className="card-title">
                                    {/*begin::Search*/}
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
                                        <button
                                            onClick={() => {
                                                findSearchResults(query);
                                            }}
                                            className="btn btn-primary">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body ps-3 pe-0 pt-0">
                                {/*begin::Table*/}
                                <div
                                    id="kt_ecommerce_products_table_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer notifications">
                                    <div
                                        className="table-responsive"
                                        style={{ overflow: "hidden" }}>
                                        <table
                                            className="table dataTable align-middle table-row-dashed fs-6 gy-1"
                                            id="kt_ecommerce_products_table">
                                            <thead>
                                                <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                                    <th
                                                        className={`cursor-pointer text-start min-w-90px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("dealerName", sortOrder)}`}
                                                        onClick={() => sortColumn("dealerName")}>
                                                        Dealer
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-60px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("contactName", sortOrder)}`}
                                                        onClick={() => sortColumn("contactName")}>
                                                        User
                                                    </th>

                                                    <th
                                                        className={`cursor-pointer text-start min-w-60px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("vin", sortOrder)}`}
                                                        onClick={() => sortColumn("vin")}>
                                                        VIN
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-70px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("stockId", sortOrder)}`}
                                                        onClick={() => sortColumn("stockId")}>
                                                        Dealer stock#
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-90px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("type", sortOrder)}`}
                                                        onClick={() => sortColumn("type")}>
                                                        Type
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-60px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("attempt", sortOrder)}`}
                                                        onClick={() => sortColumn("attempt")}>
                                                        Attempt
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-100px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("status", sortOrder)}`}
                                                        onClick={() => sortColumn("status")}>
                                                        Status
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-60px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("answerVia", sortOrder)}`}
                                                        onClick={() => sortColumn("answerVia")}>
                                                        Answer via
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("dateOfAttempt._seconds", sortOrder)}`}
                                                        onClick={() => sortColumn("dateOfAttempt._seconds")}>
                                                        Sent Date
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("responseDate._seconds", sortOrder)}`}
                                                        onClick={() => sortColumn("responseDate._seconds")}>
                                                        Date of response
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        } ${sortingClasses("responseMessage", sortOrder)}`}
                                                        onClick={() => sortColumn("responseMessage")}>
                                                        Notes
                                                    </th>
                                                    <th
                                                        className={`cursor-pointer text-start min-w-80px ${
                                                            loading ? "cursor-pointer-none" : ""
                                                        }`}>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="fw-semibold text-gray-600 fs-6">
                                                {!loading && notificationsData.length === 0 && (
                                                    <tr>
                                                        <td colSpan="12">No records found...</td>
                                                    </tr>
                                                )}

                                                {liveNotifications.map((flattenedNotifications, index) => (
                                                    <tr key={index}>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.dealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.contactName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <span
                                                                onClick={() =>
                                                                    showNotificationLogs(
                                                                        flattenedNotifications?.vin,
                                                                        flattenedNotifications?.id,
                                                                        flattenedNotifications.createdAt,
                                                                        flattenedNotifications.createdBy
                                                                    )
                                                                }
                                                                className={`cursor-pointer fw-bold ${
                                                                    flattenedNotifications.vin != null
                                                                        ? "purple-text"
                                                                        : ""
                                                                }`}>
                                                                {flattenedNotifications.vin || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            <span className="fw-bold me-3">
                                                                {flattenedNotifications.stockId || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0 notification-type">
                                                            <span
                                                                className={`fw-bold oval ${getNotificationColorForType(
                                                                    flattenedNotifications.type
                                                                )}`}>
                                                                {convertToTitleCase(flattenedNotifications.type) ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {addSuffix(flattenedNotifications.attempt) || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0 notification-status">
                                                            <span
                                                                className={`status-circle ${getNotificationColorForStatus(
                                                                    flattenedNotifications.status,
                                                                    flattenedNotifications?.isResponseConflicted
                                                                )} `}
                                                            />
                                                            <span>
                                                                {" "}
                                                                {convertToTitleCase(flattenedNotifications.status) ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.answerVia || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications?.createdAt
                                                                ? flattenedNotifications?.createdAt._nanoseconds
                                                                    ? formatTimestamp(flattenedNotifications?.createdAt)
                                                                    : convertDateToLocalTime(
                                                                          flattenedNotifications?.createdAt
                                                                      )
                                                                : "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications?.responseDate &&
                                                            flattenedNotifications.status.toLowerCase() != "submitted"
                                                                ? flattenedNotifications?.responseDate?._nanoseconds
                                                                    ? formatTimestamp(
                                                                          flattenedNotifications?.responseDate
                                                                      )
                                                                    : convertDateToLocalTime(
                                                                          flattenedNotifications?.responseDate
                                                                      )
                                                                : "N/A"}
                                                        </td>

                                                        <td
                                                            className="text-start pe-0"
                                                            style={{ wordBreak: "break-all" }}>
                                                            {flattenedNotifications?.responseMessage && (
                                                                <>
                                                                    {flattenedNotifications?.responseMessage.length >
                                                                    24 ? (
                                                                        <>
                                                                            {flattenedNotifications?.responseMessage.substring(
                                                                                0,
                                                                                24
                                                                            )}
                                                                            <span
                                                                                title={
                                                                                    flattenedNotifications?.responseMessage ||
                                                                                    "see details!"
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedDescription(
                                                                                        flattenedNotifications.responseMessage ||
                                                                                            "N/A"
                                                                                    );
                                                                                    openModal();
                                                                                }}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    color: "blue",
                                                                                    textDecoration: "underline"
                                                                                    // wordBreak: "break-all"
                                                                                }}>
                                                                                (...)
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        flattenedNotifications.responseMessage
                                                                    )}
                                                                </>
                                                            )}
                                                            {!flattenedNotifications?.responseMessage && "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <i
                                                                onClick={() =>
                                                                    editNotificationResponse(flattenedNotifications?.id)
                                                                }
                                                                className="ki-duotone ki-pencil text-info fs-2"
                                                                style={{ cursor: "pointer" }}>
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {notificationsData.map((flattenedNotifications, index) => (
                                                    <tr key={index}>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.dealerName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.contactName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <span
                                                                onClick={() =>
                                                                    showNotificationLogs(
                                                                        flattenedNotifications?.vin,
                                                                        flattenedNotifications?.id,
                                                                        flattenedNotifications.createdAt,
                                                                        flattenedNotifications.createdBy
                                                                    )
                                                                }
                                                                className={`cursor-pointer fw-bold ${
                                                                    flattenedNotifications.vin != null
                                                                        ? "purple-text"
                                                                        : ""
                                                                }`}>
                                                                {flattenedNotifications.vin || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="text-start pe-0"
                                                            data-order="45">
                                                            <span className="fw-bold me-3">
                                                                {flattenedNotifications.stockId || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0 notification-type">
                                                            <span
                                                                className={`fw-bold oval ${getNotificationColorForType(
                                                                    flattenedNotifications.type
                                                                )}`}>
                                                                {convertToTitleCase(flattenedNotifications.type) ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {addSuffix(flattenedNotifications.attempt) || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0 notification-status">
                                                            <span
                                                                className={`status-circle ${getNotificationColorForStatus(
                                                                    flattenedNotifications.status,
                                                                    flattenedNotifications?.isResponseConflicted
                                                                )} `}
                                                            />
                                                            <span>
                                                                {" "}
                                                                {convertToTitleCase(flattenedNotifications.status) ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications.answerVia || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications?.dateOfAttempt}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            {flattenedNotifications?.responseDate}
                                                        </td>

                                                        <td
                                                            className="text-start pe-0"
                                                            style={{ wordBreak: "break-all" }}>
                                                            {flattenedNotifications?.responseMessage && (
                                                                <>
                                                                    {flattenedNotifications?.responseMessage.length >
                                                                    24 ? (
                                                                        <>
                                                                            {flattenedNotifications?.responseMessage.substring(
                                                                                0,
                                                                                24
                                                                            )}
                                                                            <span
                                                                                title={
                                                                                    flattenedNotifications?.responseMessage ||
                                                                                    "see details!"
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedDescription(
                                                                                        flattenedNotifications.responseMessage ||
                                                                                            "N/A"
                                                                                    );
                                                                                    openModal();
                                                                                }}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    color: "blue",
                                                                                    textDecoration: "underline"
                                                                                    // wordBreak: "break-all"
                                                                                }}>
                                                                                (...)
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        flattenedNotifications.responseMessage
                                                                    )}
                                                                </>
                                                            )}
                                                            {!flattenedNotifications?.responseMessage && "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <i
                                                                onClick={() =>
                                                                    editNotificationResponse(flattenedNotifications?.id)
                                                                }
                                                                className="ki-duotone ki-pencil text-info fs-2"
                                                                style={{ cursor: "pointer" }}>
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {loading && (
                                            <div className="admin-loading">
                                                <LoadingSpinner />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/*end::Table*/}
                            </div>
                            {/*end::Card body*/}
                        </div>
                        {/*end::Products*/}
                    </div>
                    {/*end::Container*/}
                </div>
            </div>
            {/*end::Post*/}
        </>
    );
}

export default ThisCarNotifications;
