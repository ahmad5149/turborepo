"use client";
import { useState, React, useContext, useEffect } from "react";
import { memo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import { fetchNotifications,fetchNotificationsForExport } from "../../../services/notificationsService";
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
import "../../../../src/contents/admin/scss/mobileListings.scss";
import { downloadXLS } from "../../../utils/downloadXLS";
import Swal from "sweetalert2";



function ThisCarNotifications({ notifications, notificationFound }) {
    const searchParams = useSearchParams();
    const { setNotificationId } = useContext(AppContext);

    const params = new URLSearchParams(searchParams);

    const [notificationsData, setNotificationsData] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(notificationFound);
    const [loading, setLoading] = useState(false);
    var [selectedStatus, setSelectedStatus] = useState("");
    var [selectedType, setSelectedType] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");
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
    const [exportListingPopup, setExportListingPopup] = useState(false);
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

    const handleStatusChange = async (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        const stateParams = await getSearchParams();
        handleStatusAndTypeFilter(selectedStatus, stateParams.type);
    };

    const handleTypeChange = async (selectedType) => {
        setSelectedType(selectedType);
        const stateParams = await getSearchParams();

        handleStatusAndTypeFilter(stateParams.status, selectedType);
    };

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

    const openExportListingModal = () => {
        setExportListingPopup(true);
    };

    const closeExportListingModal = () => {
        setExportListingPopup(false);
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
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    return (
        <>
            <Toolbar
                pageName="ThisCar Notifications"
                addNew={{ path1: "thiscar-notifications" }}
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
                                    {/*end::Search*/}
                                </div>
                                {/*end::Card title*/}
                                {/*begin::Card toolbar*/}
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
                                                    openExportListingModal();
                                                }}
                                                className="btn btn-primary">
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*end::Card header*/}
                            {/*begin::Card body*/}
                            <div className="card-body pt-0">
                                {/*begin::Table*/}
                                <div
                                    id="kt_ecommerce_products_table_wrapper"
                                    className="dataTables_wrapper dt-bootstrap4 no-footer notifications">
                                    <div className="table-responsive">
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
                                                                    flattenedNotifications?.status,
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
            {exportListingPopup && <DownloadNotificationFilters closeExportListingModal={closeExportListingModal} />}
        </>
    );
}

export default ThisCarNotifications;

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
            item.document.answerVia || "N/A",
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

            item.document.responseMessage  || "N/A"
        ]);
        downloadXLS(extractedFields, headers, filename);
    };

    const fetchResults = () => {
        if (!startDate && !endDate) {
            setError("Please select valid dates.");
        }
        else if (startDate && !endDate) {
            setError("Please select valid dates.");
        } 
        else {
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
                                    maxDate={new Date()}
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
