"use client";
import { useEffect, useState, useRef } from "react";
import { Toolbar } from "../common/toolbar/Toolbar";
import "../../../contents/scss/admin/inventory.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchInvData } from "../../../services/inventoryService";
import "../../../contents/scss/admin/notifyDealer.scss";
import Swal from "sweetalert2";
import { useAuth } from "@/components/auth";
import { debounce } from "lodash";
import InventoryListing from "./InventoryListing";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import { getDealerByName, getDealersById } from "../../../services/dealerService";
import { pdf } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument"; // Import from pdf-lib

const statusOptions = ["All", "Active", "Hidden", "Deposit", "24 Hours Hold", "Sold"];

export default function Inventory({ inventory, saveNotification, notification, setCurrentPage, query, dealerName }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const routerNav = useRouter();
    const [inventoryData, setInventoryData] = useState(inventory.items);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;
    const [totalRecords, setTotalRecords] = useState(inventory.pagination.total);
    const [isNotifyDealerModalOpen, setIsNotifyDealerModalOpen] = useState(false);
    const [carVIN, setCarVin] = useState("");
    const [carYear, setCarYear] = useState("");
    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");
    const [dealerStockId, setDealerStockId] = useState("");
    const [showUnprocessed, setShowUnprocessed] = useState(false);
    const [purchaseAgreementData, setPurchaseAgreementData] = useState({});
    const user = useAuth();

    let purchaseAgreement;
    const lastPage = useRef(inventory.items === inventory.pagination.total);
    const searchText = useRef(dealerName);
    const status = useRef(statusOptions[0]);

    const openNotifyDealerModal = async (vin, dealerStockId, year, make, model, sellerName, carData) => {
        const sellerInfo = await getDealersById(carData?.dealerId);
        const buyerInfo = await getDealerInformation("THIScar.com");
        setCarVin(vin);
        setCarYear(year);
        setCarMake(make);
        setCarModel(model);
        setDealerStockId(dealerStockId != null && dealerStockId != "" ? dealerStockId : vin);
        setIsNotifyDealerModalOpen(true);
        setPurchaseAgreementInfo(buyerInfo, sellerInfo, carData);
    };

    const getDealerInformation = async (dealerName) => {
        const dealerInfo = await getDealerByName(dealerName);
        return dealerInfo;
    };
    const closeNotifyDealerModal = () => {
        setIsNotifyDealerModalOpen(false);
    };
    const setPurchaseAgreementInfo = (dealerData, sellerData, carData) => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        purchaseAgreement = {
            dealerData: dealerData,
            carData: carData,
            currentDate: formattedDate,
            userName: user.displayName,
            sellerData: sellerData
        };
        setPurchaseAgreementData(purchaseAgreement);
    };
    // const [searchText, setSearchText] = useState(dealerName);
    const [searchQuery, setSearchQuery] = useState(dealerName);
    const [dealerId, setDealerId] = useState(query);

    const [selectedState, setSelectedState] = useState(statusOptions[0]);
    // Update the displayed data whenever currentPage or itemsPerPage changes

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        lastPage.current = false;
        currentPageRef.current = 1;
        setCurrentPage(1);
        fetchData(1);
    }, [dateRange, selectedState]);

    const fetchData = async (pageNumber) => {
        setIsLoading(true);
        lastPage.current = false;
        const data = await fetchInvData(
            itemsPerPage,
            pageNumber,
            searchText.current,
            dateRange,
            status.current,
            dealerId
        );
        setInventoryData(data.items);
        setTotalRecords(data.pagination.total);
        if (data.items?.length == data.pagination.total) {
            lastPage.current = true;
        }
        setIsLoading(false);
    };

    const currentPageRef = useRef(1);
    const handleInfiniteScroll = async () => {
        if (isLoading || lastPage.current) return;
        setIsLoading(true);

        const { scrollTop, clientHeight, scrollHeight } = document?.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 500) {
            try {
                currentPageRef.current += 1;
                const res = await fetchInvData(
                    itemsPerPage,
                    currentPageRef.current,
                    searchText.current,
                    dateRange,
                    status.current,
                    dealerId
                );

                const carsData = res?.items;

                if (carsData?.length > 0) {
                    setInventoryData((prevData) => {
                        const uniqueInv = carsData.filter(
                            (newInv) =>
                                !prevData.some(
                                    (existingInventory) => existingInventory.document.id === newInv.document.id
                                )
                        );

                        if ([...prevData, ...uniqueInv].length === res?.pagination?.total) {
                            lastPage.current = true;
                        } else {
                            lastPage.current = false;
                        }

                        return [...prevData, ...uniqueInv];
                    });
                }
            } catch (error) {
                console.error("Error in inventory fetch:", error.message);
            }
        }
        setIsLoading(false);
    };

    const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 1000);

    const windowRef = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            debouncedHandleInfiniteScroll();
        };

        if (typeof window !== "undefined") {
            windowRef.current = window;
            windowRef.current.addEventListener("scroll", handleScroll);
            windowRef.current.addEventListener("wheel", handleScroll);

            return () => {
                windowRef.current.removeEventListener("scroll", handleScroll);
                windowRef.current.removeEventListener("wheel", handleScroll);
            };
        }
    }, []);
    const updateUrl = (q) => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        if (q != "") {
            params.set("name", q);
        } else {
            params.delete("name");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            setDealerId(null);
            currentPageRef.current = 1;
            lastPage.current = false;
            updateUrl(searchQuery);
            searchText.current = searchQuery;
            fetchData(1);
        }
    };

    return (
        <>
            <Toolbar pageName="Inventory" />
            {/*begin::Post*/}
            <div
                className="post fs-6 d-flex flex-column-fluid inv-page"
                id="kt_post">
                {/*begin::Container*/}
                <div className="container-xxl">
                    {/*begin::Products*/}
                    <div className="card card-flush">
                        {/*begin::Card header*/}
                        <div className="card-header d-flex flex-wrap align-items-center py-5 gap-2 gap-md-5">
                            {/*begin::Card title*/}
                            <h2 className="mt-2">Filters</h2>
                            <div className="w-100">
                                <div className="card-title flex-wrap">
                                    {/*begin::Search*/}
                                    <div className="d-flex align-items-center position-relative my-1 search-container">
                                        <div className="d-flex align-items-center position-relative">
                                            <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                            </i>
                                            <input
                                                id="vin"
                                                type="text"
                                                data-kt-ecommerce-product-filter="search"
                                                className="form-control form-control-solid w-300px ps-12"
                                                placeholder="VIN/Dealer/Dealer StockId"
                                                onChange={(e) => {
                                                    setSearchQuery(e.currentTarget.value);
                                                }}
                                                onKeyDown={handleKeyPress}
                                                value={searchQuery}
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setDealerId(null);
                                                currentPageRef.current = 1;
                                                lastPage.current = false;
                                                updateUrl(searchQuery);
                                                searchText.current = searchQuery;
                                                fetchData(1);
                                            }}
                                            className="btn btn-primary">
                                            Search
                                        </button>
                                    </div>
                                    {/*end::Search*/}

                                    <div className="status-dropdown me-md-4 me-sm-0 mt-1">
                                        {/*begin::Select2*/}
                                        <div className="form-floating status-dropdown">
                                            <select
                                                id="statusSelect"
                                                className="form-select form-select-solid"
                                                data-control="select2"
                                                data-hide-search="true"
                                                data-placeholder="Status"
                                                onChange={(event) => {
                                                    setSelectedState(event.target.value);
                                                    status.current = event.target.value;
                                                }}
                                                value={selectedState}
                                                data-kt-ecommerce-product-filter="status">
                                                {statusOptions.map((value, index) => (
                                                    <option
                                                        key={index}
                                                        value={value}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="statusSelect">Status</label>
                                        </div>
                                        {/*end::Select2*/}
                                    </div>
                                    {/*begin::Add product*/}
                                    {/* <a
                                    href="/admin/add-dealer"
                                    className="btn btn-primary">
                                    Add Dealer
                                </a> */}
                                    {/*end::Add product*/}

                                    <div className="d-flex me-md-4 me-sm-0 mt-1 datepicker-container">
                                        <DatePicker
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            isClearable={true}
                                            className="form-control form-control-solid"
                                            placeholderText="Select date range"
                                            icon="bi bi-calendar-check"
                                        />
                                    </div>
                                    <div className="form-check mt-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value=""
                                            checked={showUnprocessed}
                                            onChange={() => setShowUnprocessed(!showUnprocessed)}
                                            id="flexCheckDefault"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="flexCheckDefault">
                                            Unprocessed Photos
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <h6 className="mb-0">Total: {totalRecords} cars</h6>

                            {/*end::Card toolbar*/}
                        </div>
                        {/*end::Card header*/}
                        {/*begin::Card body*/}
                        <div className="card-body pt-0 pe-0">
                            {/*begin::Table*/}

                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer">
                                <div className="table-responsive">
                                    <InventoryListing
                                        inventoryData={inventoryData}
                                        openNotifyDealerModal={openNotifyDealerModal}
                                        showUnprocessed={showUnprocessed}></InventoryListing>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="admin-loading">
                                    <LoadingSpinner />
                                </div>
                            )}
                            {/*end::Table*/}
                        </div>
                        {/*end::Card body*/}
                    </div>
                    {/*end::Products*/}
                </div>
                {/*end::Container*/}
                {isNotifyDealerModalOpen && (
                    <NotifyDealerModal
                        closeModal={closeNotifyDealerModal}
                        vin={carVIN}
                        carYear={carYear}
                        carMake={carMake}
                        carModel={carModel}
                        saveNotification={saveNotification}
                        dealerStockNumber={dealerStockId}
                        popupData={notification}
                        user={user}
                        purchaseAgreementData={purchaseAgreementData}
                    />
                    //  <PDFPage purchaseAgreement={purchaseAgreementData} />
                )}
            </div>
        </>
    );
}
export function NotifyDealerModal({
    closeModal,
    vin,
    dealerStockNumber,
    popupData,
    saveNotification,
    carYear,
    carMake,
    carModel,
    user,
    purchaseAgreementData
}) {
    const [type, setType] = useState(null);
    const [description, setDescription] = useState("");
    const [isNotifyBtnEnabled, setIsNotifyBtnEnabled] = useState(false);

    useEffect(() => {
        if (type == "available") {
            if (
                popupData &&
                popupData.notificationContent &&
                popupData.notificationContent.emailContent &&
                popupData.notificationContent.emailContent.firstAttempt &&
                popupData.notificationContent.emailContent.firstAttempt.available &&
                popupData.notificationContent.emailContent.firstAttempt.available != ""
            ) {
                var modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available;
                if (modifiedMessage.includes("[YMM Dealer Stock #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /\[YMM Dealer Stock #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM & DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /\[YMM & DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /\[YMM DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM Dealer Stock #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /YMM Dealer Stock #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM & DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /YMM & DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.available.replace(
                        /YMM DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                }
                setDescription(modifiedMessage);
            }
        } else if (type == "24hourhold") {
            if (
                popupData &&
                popupData.notificationContent &&
                popupData.notificationContent.emailContent &&
                popupData.notificationContent.emailContent.firstAttempt &&
                popupData.notificationContent.emailContent.firstAttempt.hourhold &&
                popupData.notificationContent.emailContent.firstAttempt.hourhold != ""
            ) {
                var modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold;
                if (modifiedMessage.includes("[YMM Dealer Stock #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /\[YMM Dealer Stock #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM & DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /\[YMM & DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /\[YMM DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM Dealer Stock #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /YMM Dealer Stock #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM & DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /YMM & DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.hourhold.replace(
                        /YMM DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                }
                setDescription(modifiedMessage);
            }
        } else if (type == "purchase") {
            if (
                popupData &&
                popupData.notificationContent &&
                popupData.notificationContent.emailContent &&
                popupData.notificationContent.emailContent.firstAttempt &&
                popupData.notificationContent.emailContent.firstAttempt.purchase &&
                popupData.notificationContent.emailContent.firstAttempt.purchase != ""
            ) {
                var modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase;
                if (modifiedMessage.includes("[YMM Dealer Stock #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /\[YMM Dealer Stock #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM & DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /\[YMM & DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("[YMM DEALER STOCK #]")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /\[YMM DEALER STOCK #\]/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM Dealer Stock #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /YMM Dealer Stock #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM & DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /YMM & DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                } else if (modifiedMessage.includes("YMM DEALER STOCK #")) {
                    modifiedMessage = popupData.notificationContent.emailContent.firstAttempt.purchase.replace(
                        /YMM DEALER STOCK #/g,
                        `${carYear} ${carMake} ${carModel} & Stock ${dealerStockNumber}`
                    );
                }
                setDescription(modifiedMessage);
            }
        }
    }, [type]);
    const handleCheckboxChange = (option) => {
        setType(option);
    };

    const generatePDF = () => {
        return <PDFDocument purchaseAgreement={purchaseAgreementData} />;
    };

    const handleDealerMessageChange = (event) => {
        setDescription(event.target.value);
    };
    const handleSubmit = async () => {
        setIsNotifyBtnEnabled(true);
        //Start
        const pdfBlob = await pdf(generatePDF(purchaseAgreementData)).toBlob();

        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
        const base64Pdf = pdfBuffer.toString("base64");
        //End
        const data = {
            createdBy: user.email ?? user?.providerData[0]?.email,
            vin: vin,
            type: type,
            description: description,
            contactName: user.displayName,
            pdfBuffer: base64Pdf
        };

        await saveNotification(data).then((response) => {
            if (response.status == 200) {
                setType(null);
                setDescription(null);
                closeModal();
                Swal.fire({
                    title: "Notification has been sent successfully!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Okay",
                    showConfirmButton: false, // hide the confirm button
                    showCloseButton: false,
                    timer: 3000
                }).then(async (result) => {
                    setIsNotifyBtnEnabled(false);
                });
            } else {
                setType(null);
                setDescription(null);
                closeModal();
                Swal.fire({
                    title: response.message ?? "Failed to send notification",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Close",
                    showConfirmButton: false, // hide the confirm button
                    showCloseButton: false,
                    timer: 3000
                }).then(async (result) => {
                    setIsNotifyBtnEnabled(false);
                });
            }
        });
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div
            className="modal-dialog-md"
            style={{ display: "flex", zIndex: "1000" }}
            id="notifyDealer-modal">
            {/* <div className="modal-dialog modal-dialog-responsive"> */}
            <div className="notify-modal">
                <div className="notify-modal-content col-lg-12 col-md-12 col-sm-12 col-12">
                    <>
                        <div
                            className="notify-modal-header col-lg-12 col-md-12 col-sm-12 col-12 mt-1 mb-3"
                            style={{ display: "flex" }}>
                            <div className="heading col-lg-9 col-md-9 col-sm-9 col-9 ">
                                <h2>Notify Dealer</h2>
                            </div>
                            <div className="close col-lg-3 col-md-3 col-sm-3 col-3 mt-0">
                                <span
                                    onClick={() => {
                                        closeModal();
                                    }}>
                                    {/* <span className="close" onClick={closeModal}> */}
                                    &times;
                                </span>
                            </div>
                        </div>
                        <div className="notify-modal-body col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-0 sub_heading">
                                <h4>Notification Type</h4>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-5 pb-5 sub_heading bottom_border">
                                <label className="customcheck">
                                    Available
                                    <input
                                        type="checkbox"
                                        checked={type === "available"}
                                        onChange={() => handleCheckboxChange("available")}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-5 pb-5 sub_heading bottom_border">
                                <label className="customcheck">
                                    24 hour hold
                                    <input
                                        type="checkbox"
                                        checked={type === "24hourhold"}
                                        onChange={() => handleCheckboxChange("24hourhold")}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-5 pb-5 sub_heading ">
                                <label className="customcheck">
                                    Purchase
                                    <input
                                        type="checkbox"
                                        checked={type === "purchase"}
                                        onChange={() => handleCheckboxChange("purchase")}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-5 pb-5 sub_heading ">
                                <textarea
                                    className="form-control text_area"
                                    rows="3"
                                    value={description}
                                    onChange={(event) => handleDealerMessageChange(event)}
                                    placeholder="Type your message for the dealer here"
                                />
                            </div>

                            <div className="col-lg-4 col-md-4 col-sm-4 col-4 pb-5 sub_heading button-div ">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        description == null || description == "" || type == null || isNotifyBtnEnabled
                                    }
                                    className="btn btn-custom back-btn w-100 notify-btn"
                                    type="button">
                                    Notify
                                </button>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}
