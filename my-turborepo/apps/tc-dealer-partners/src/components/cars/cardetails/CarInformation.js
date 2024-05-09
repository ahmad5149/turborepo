"use client";
import React, { useState, useEffect, useContext, useCallback, useRef, useLayoutEffect } from "react";
import { useFormState } from "react-dom";
import CarModal from "./CarModal";
import CarModalMobile from "./CarModalMobile";
import { Carousel } from "react-responsive-carousel";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CopyToClipboard from "../../../components/common/clipboard/CopyToClipboard";
import ConfirmAvailability from "./ConfirmCarAvailability";
import { NotifyDealerModal } from "./NotifyDealerModal";
import { useAuth } from "@/components/auth";
import { fetchUsersByEmail } from "../../../services/userService";
import { CopyToClipboardSVG } from "../../../contents/svgs/common";
import verifyRecaptchaWithEmail from "../../../app/api/verifyRecaptchaWithEmail";
import { sendSMS } from "../../../app/api/sendSMS";
import { appConfig } from "@/appConfig";
import Swal from "sweetalert2";
import "../../../contents/scss/admin/notifyDealer.scss";
import "../../../contents/scss/admin/inventory.scss";

import {
    OrigWindowSVG,
    ConfirmAvailabiltySVG,
    CalculatePaymentSVG,
    ValueMyTradeSVG
} from "../../../contents/svgs/carDetails";

import {
    CarInformationEngineSVG,
    CarInformationModalSVG,
    CarInformationMilesSVG,
    CarInformationDriveTypeSVG,
    CarInformationTransmissionSVG,
    CarInformationFuelTypeSVG,
    VehicleHistoryReportSVG
} from "../../../contents/svgs/carDetails";
import { buyNow } from "@/actions/buyNow";

function CarInformation({
    carData,
    images,
    mileage,
    transmission,
    fuelType,
    name,
    price,
    engine,
    stockNo,
    driveType,
    status,
    confirmAvailability,
    origWindowDetails,
    vehicleAccident,
    saveNotification,
    offsitePageData,
    dealerData,
    sellerData,
    partnerSalesData
}) {
    const user = useAuth();
    let purchaseAgreement;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchaseAgreementData, setPurchaseAgreementData] = useState({});
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    // const phoneNumber = "800-844-7227";
    const [isConfirmAvailabilityModalOpen, setIsConfirmAvailabilityModalOpen] = useState(false);
    const btnRef = useRef(null);
    const [showWindowSticker, setShowWindowSticker] = useState(false);
    const [tradeToolURL, setTradeToolURL] = useState(
        dealerData && dealerData.tradeToolURL ? dealerData.tradeToolURL : ""
    );
    const [prequelURL, setPrequelURL] = useState(dealerData && dealerData.prequelURL ? dealerData.prequelURL : "");
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const [isNotifyDealerModalOpen, setIsNotifyDealerModalOpen] = useState(false);
    const [carVIN, setcarVIN] = useState("");
    const [carYear, setcarYear] = useState("");
    const [carMake, setcarMake] = useState("");
    const [carModel, setcarModel] = useState("");
    const [dealerStockId, setDealerStockId] = useState("");
    const [userName, setUserName] = useState("");
    const [requestingDealerName, setRequestingDealerName] = useState("");
    const [requestingDealerId, setRequestingDealerId] = useState("");
    const [userDealerData, setUserDealerData] = useState(null);
    const [userValidDealership, setUserValidDealership] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user && isLoaded) {
            router.push("/");
        }
    }, [user]);
    const userHasDealership = (userDealersData) => {
        /// check for primary dealership
        if (userDealersData) {
            if (userDealersData.chromeDealerId === dealerData.chromeDealerId) {
                setUserValidDealership(true);
            } else {
                /// check for secondary dealerships
                setUserValidDealership(
                    userDealersData?.userSecondaryDealership?.some((user) => user.value === dealerData.chromeDealerId)
                );
            }
        }
    };

    const getUserDealersData = async () => {
        if (user && user?.email) {
            const response = await fetch(`/api/dealer-login/${user?.email}`);
            const userDealerData = await response.json();
            //console.log("userDealerData", userDealerData);
            setUserDealerData(userDealerData);
            userHasDealership(userDealerData);

            var userData = await fetchUsersByEmail(user?.email);
            if (userData) {
                setUserName(`${userData.firstName} ${userData.lastName}`);
            }
        }
    };

    useEffect(() => {
        setIsLoaded(true);
        getUserDealersData();
        GenerateURL();
    }, []);

    useEffect(() => {
        getUserDealersData();
        GenerateURL();
    }, [user]);

    const openNotifyDealerModal = async (vin, dealerstockid, year, make, model, email, userName) => {
        if (email && email != "") {
            setRequestingDealerName(dealerData.name);
            setRequestingDealerId(dealerData.chromeDealerId);
        }
        setcarVIN(vin);
        setcarYear(year);
        setcarMake(make);
        setcarModel(model);
        setDealerStockId(dealerstockid != null ? dealerstockid : vin);
        setIsNotifyDealerModalOpen(true);
        setPurchaseAgreementInfo();
    };

    const setPurchaseAgreementInfo = () => {
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
            userName: userName,
            sellerData: sellerData
        };
        setPurchaseAgreementData(purchaseAgreement);
    };
    const closeNotifyDealerModal = () => {
        setIsNotifyDealerModalOpen(false);
    };

    const closeConfirmAvailabilityModal = () => {
        setIsConfirmAvailabilityModalOpen(false);
    };

    const [innerDimensions, setDimensions] = useState({
        screenWidth: undefined,
        screenHeight: undefined
    });

    const [index, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (searchParams.get("windowSticker") && !showWindowSticker) {
            router.replace(`${pathName}`);
        }

        if (!searchParams.get("windowSticker") && showWindowSticker) {
            router.replace(`${pathName}?windowSticker=true`);
        }
    }, [searchParams, showWindowSticker]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            function handleResize() {
                setDimensions({
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight
                });
            }
            window.addEventListener("resize", handleResize);

            handleResize();

            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    const GenerateURL = () => {
        if (user && user?.email) {
            const url = `https://myoffsiteinventory.com/${dealerData.dealerURI}/${
                carData.vin
            }?share=${encodeURIComponent(user?.email)}`;
            setShareUrl(url);
        }
    };

    const renderThumbs = (children) => {
        return children.map((item, index) => (
            <div
                key={index}
                className="image-container-wrap position-relative">
                <Image
                    src={item.props.children[0].props.src}
                    className="img-fluid main-img position-relative"
                    fill
                    priority={true}
                    sizes="100vw"
                    quality={50}
                    alt="Vehicle Lead Image"
                />

                {/* {(status == "pending" || status == "cancelled" || item.status == "deposit" || status == "hidden") && (
                    <Image
                        src={"/media/sale-pending-banner@2x.png"}
                        width={250}
                        height={250}
                        style={imgStyle}
                        className="position-absolute top-0 start-0 img-fluid banner"></Image>
                )} */}
            </div>
        ));
    };

    const imgStyle = {
        width: "48%",
        height: "61%"
    };

    const removeModalClasses = () => {
        // Logic to remove classes from the body
        document.body.classList.remove("modal-open");
    };

    const removeModalBackdrop = () => {
        // Logic to remove modal backdrop
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();
        }
    };
    useEffect(() => {
        // Component mount logics

        // Cleanup logic to be executed when component is unmounted
        return () => {
            // Perform cleanup actions here
            document.body.style.overflow = "auto";
            removeModalClasses();
            removeModalBackdrop();
        };
    }, []); // Empty dependency array means this effect only runs once on mount and unmount

    const goBack = () => {
        router.back();
        // router.push(`/${dealerName}`);
    };

    const calculatePaymentAction = useCallback(() => {
        if (document) {
            const tpButton = document.getElementsByClassName("tp-cta-button-btn");
            return tpButton.length > 0 ? tpButton[0].click() : null;
        }
    }, []);

    useEffect(() => {
        // Function to hide the button with a specific class
        const hideButton = () => {
            const buttonsToHide = document.querySelector(".reveal_cta_button"); // Replace with the actual class name
            if (buttonsToHide) {
                buttonsToHide.style.setProperty("display", "none", "important");
            }
        };

        // Check for the button periodically
        const intervalId = setInterval(() => {
            const dynamicButton = document.querySelector(".reveal_cta_button"); // Replace with the actual class name

            if (dynamicButton) {
                // Button is found, hide it and clear the interval
                hideButton();
                clearInterval(intervalId);
            }
        }, 1); // Check every 1000 milliseconds (1 second)

        // Clear the interval after 10 seconds to avoid indefinite checking
        setTimeout(() => {
            clearInterval(intervalId);
        }, 10000); // Stop checking after 10 seconds
    }, []);

    useEffect(() => {
        const hideChildElement = () => {
            const tradePendingBtn = btnRef.current;
            if (tradePendingBtn) {
                const childElement = tradePendingBtn.querySelector(".reveal_cta_button"); // Replace with the actual class name
                if (childElement) {
                    childElement.style.setProperty("display", "none", "important");
                }
            }
        };

        const handleMutation = (mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    hideChildElement();
                }
            });
        };

        const observer = new MutationObserver(handleMutation);

        const targetNode = btnRef.current; // Use the ref directly
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                div.reveal_cta_button {
                    display: none!important
                }
            `
                }}
            />
            <div>
                <div className="white-bg back-search-btn">
                    <div className="col-lg-12 d-flex justify-content-start px-0 white-bg">
                        <button
                            className="btn btn-sm custom_btn detail-btn-back mt-3"
                            onClick={goBack}>
                            Back to Search
                        </button>
                    </div>
                    {/* <div className="col-lg-6 d-flex white-bg share-btn">
                        <ToastContainer
                            toastClassName="custom-toast"
                            bodyClassName="custom-toast-body"
                            progressClassName="custom-toast-progress"
                        />
                    </div> */}
                </div>

                <section>
                    <div className="px-0 row white-bg">
                        <div className="d-flex flex-column align-items-start mt-5 heading-div col-xl-8 col-lg-8 col-md-6 col-sm-6 ">
                            <h2>
                                <b>{name}</b>
                            </h2>
                            {/* <p><span>Subtitle</span></p> */}
                            {carData && carData.stockId != null && carData.stockId != "" && (
                                <h4 className="d-flex align-items-center">
                                    Stock: {carData.stockId}
                                    <CarInformationModalSVG />
                                    {carData && carData.offsitePhotoUrls && carData.offsitePhotoUrls?.length > 9 ? (
                                        <div
                                            className=""
                                            data-bs-toggle="modal"
                                            data-bs-target="#copyUrlModal">
                                            <CopyToClipboardSVG />
                                        </div>
                                    ) : (
                                        "Share Coming Soon"
                                    )}
                                </h4>
                            )}
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6  row price-desktop-div">
                            <div className="d-flex flex-column  mb-2 price-div col-xl-12 col-lg-12 ">
                                <h2>${price ? Number(price).toLocaleString() : "Coming Soon"}</h2>
                                <h6 style={{ textAlign: "right", textDecoration: "underline" }}>
                                    {carData?.distance?.toLocaleString()} miles to you
                                </h6>
                            </div>

                            {isConfirmAvailabilityModalOpen && (
                                <ConfirmAvailability
                                    closeModal={closeConfirmAvailabilityModal}
                                    vehicleName={name}
                                    stockNo={stockNo}
                                    confirmAvailability={confirmAvailability}
                                    crmEmail={dealerData && dealerData.crmEmail != "" ? dealerData.crmEmail : ""}
                                />
                            )}
                        </div>
                    </div>
                </section>
                <section>
                    <div className="row vehicle-image ">
                        <div className="col-xl-9 col-lg-12 col-md-12 left-side-image">
                            <div className="image-wrapper-detail d-flex">
                                <div className="position-relative">
                                    {images.length >= 10 && (
                                        <>
                                            {isModalOpen && (
                                                <CarModal
                                                    status={status}
                                                    setIsModalOpen={setIsModalOpen}
                                                    images={images}
                                                    selectedIndex={index}
                                                    name={name}
                                                    price={Number(price) - 400}></CarModal>
                                            )}
                                            {isMobileModalOpen && (
                                                <CarModalMobile
                                                    status={status}
                                                    setIsModalOpen={setIsMobileModalOpen}
                                                    images={images}
                                                    selectedIndex={index}
                                                    name={name}
                                                    price={Number(price) - 400}></CarModalMobile>
                                            )}
                                            <Carousel
                                                onClickItem={() =>
                                                    innerDimensions.screenWidth > 991
                                                        ? setIsModalOpen(true)
                                                        : setIsMobileModalOpen(true)
                                                }
                                                onChange={(index, item) => setSelectedIndex(index)}
                                                centerMode={false}
                                                renderThumbs={renderThumbs}
                                                centerSlidePercentage="100"
                                                thumbWidth="22%"
                                                preventMovementUntilSwipeScrollTolerance={true}
                                                swipeScrollTolerance={50}
                                                showThumbs={innerDimensions.screenWidth > 591}
                                                dynamicHeight={true}>
                                                {images.slice(0, 4).map(
                                                    (imageUrl, index) =>
                                                        imageUrl && (
                                                            <div
                                                                key={index}
                                                                className="image-container-wrap position-relative">
                                                                <Image
                                                                    src={imageUrl}
                                                                    className="img-fluid position-relative"
                                                                    fill
                                                                    sizes="100vw"
                                                                    quality={50}
                                                                    priority={true}
                                                                    alt={`Vehicle image ${index + 1}`}
                                                                />
                                                                {/* {(status == "pending" || status == "cancelled") && ( */}
                                                                {(status == "" || status == "") && (
                                                                    <Image
                                                                        src={"/media/sale-pending-banner@2x.png"}
                                                                        width={250}
                                                                        height={250}
                                                                        style={imgStyle}
                                                                        className="position-absolute top-0 start-0 img-fluid banner"></Image>
                                                                )}
                                                            </div>
                                                        )
                                                )}
                                            </Carousel>

                                            <div
                                                className="my-2 d-flex align-items-center p-3 counter-container"
                                                onClick={() =>
                                                    innerDimensions.screenWidth > 991
                                                        ? setIsModalOpen(true)
                                                        : setIsMobileModalOpen(true)
                                                }>
                                                <p className="text-white">+{images.length - 4}</p>
                                            </div>
                                        </>
                                    )}

                                    {images.length < 10 && (
                                        <div className="position-relative">
                                            <Image
                                                src={`/media/coming-soon.png`}
                                                alt=""
                                                width={924}
                                                height={693}
                                                className="coming-soon-img"
                                            />
                                            {(status == "pending" || status == "cancelled" || status == "deposit") && (
                                                <Image
                                                    src={"/media/sale-pending-banner@2x.png"}
                                                    width={250}
                                                    height={250}
                                                    style={imgStyle}
                                                    className="position-absolute top-0 start-0 img-fluid banner"></Image>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-12 right-side-content me-0">
                            <div className="card py-3 px-4">
                                <div className="col-md-12 items-row">
                                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-12 d-flex align-items-center mb-xl-1">
                                        <CarInformationMilesSVG />
                                        <div className="d-flex flex-column ms-3">
                                            <p className="mt-3">Mileage</p>
                                            <p>{mileage ? mileage.toLocaleString() : 0} miles</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-12 d-flex align-items-center  mb-xl-1">
                                        <CarInformationDriveTypeSVG />

                                        <div className="d-flex flex-column ms-3">
                                            <p className="mt-3">Drive Type</p>
                                            <p>{driveType}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 items-row">
                                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-12 d-flex align-items-center mb-xl-1">
                                        <CarInformationTransmissionSVG />

                                        <div className="d-flex flex-column ms-3">
                                            <p className="mt-3">Transmission</p>
                                            <p>{transmission}</p>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-12 d-flex align-items-center  mb-xl-1">
                                        <CarInformationFuelTypeSVG />

                                        <div className="d-flex flex-column ms-3">
                                            <p className="mt-3">Fuel Type</p>
                                            <p>{fuelType}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 items-row">
                                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-12 d-flex align-items-center  mb-xl-1">
                                        <CarInformationEngineSVG />
                                        <div className="d-flex flex-column ms-3">
                                            <p className="mt-3">Engine</p>
                                            <p>{engine}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* && dealerData.crmEmail && dealerData.crmEmail != "" */}
                                    {dealerData && userValidDealership && (
                                        <div className="col-lg-12 col-xl-12 col-md-6 col-sm-12 mb-2 d-flex align-items-center mb-xl-2">
                                            <div className="d-flex flex-column border-radius-25 mobile-dir-list">
                                                <div className="bg-tab-detail">
                                                    <div
                                                        className="tab-deatil"
                                                        // onClick={openConfirmAvailabilityModal}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#buyNowModal">
                                                        <ConfirmAvailabiltySVG />
                                                        <p className="text-white mt-2">
                                                            {/* {offsitePageData?.configurableButtons?.confirmAvailability} */}
                                                            Buy Now
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-lg-12 col-xl-12 col-md-6 col-sm-12 mb-2 d-flex align-items-center mb-xl-3">
                                        <div className="d-flex border-radius-25 mobile-dir-list">
                                            <div className="bg-tab-detail">
                                                <div
                                                    className="tab-deatil sample-class"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#vehicleHistoryModal">
                                                    <VehicleHistoryReportSVG />
                                                    <p className="text-white">Vehicle History</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-xl-12 col-md-6 col-sm-12 mb-2 d-flex align-items-center mb-xl-2">
                                        <div
                                            className="d-flex border-radius-25 mobile-dir-list"
                                            onClick={() => setShowWindowSticker(true)}>
                                            <div className="bg-tab-detail">
                                                <div
                                                    className="tab-deatil"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#origWindowModal">
                                                    <OrigWindowSVG />
                                                    <p className="text-white mt-2">
                                                        Window Sticker
                                                        {/* {offsitePageData?.configurableButtons?.origWindowsSticker} */}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div
                    className="modal car-page-modal"
                    id="carModal"
                    role="dialog">
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">{offsitePageData?.ourCarsPopUp?.popUpHeading}</h3>
                                <button
                                    type="button"
                                    className="close closeModal"
                                    data-bs-dismiss="modal">
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        size="lg"
                                    />
                                </button>
                            </div>
                            <div className="modal-body modal-style-body">
                                <div className="modal-text">
                                    {offsitePageData?.ourCarsPopUp?.upperText && (
                                        <p>{offsitePageData?.ourCarsPopUp?.upperText}</p>
                                    )}
                                    {offsitePageData?.ourCarsPopUp?.list1 && (
                                        <ul>
                                            {offsitePageData?.ourCarsPopUp?.list1?.map((item, index) => (
                                                <li key={index}>{item?.point}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {offsitePageData?.ourCarsPopUp?.mainText && (
                                        <p>{offsitePageData?.ourCarsPopUp?.mainText}</p>
                                    )}
                                    {offsitePageData?.ourCarsPopUp?.lowerText && (
                                        <p>{offsitePageData?.ourCarsPopUp?.lowerText}</p>
                                    )}
                                    {offsitePageData?.ourCarsPopUp?.list2 && (
                                        <ul>
                                            {offsitePageData?.ourCarsPopUp?.list2?.map((item, index) => (
                                                <li key={index}>{item?.point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    data-bs-dismiss="modal"
                                    className="btn btn-lg mt-2 custom_btn detail-btn">
                                    {offsitePageData?.ourCarsPopUp?.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <BuyNowModal
                    vin={carData.vin}
                    vehicle={name}
                    stockNo={stockNo}
                    price={Number(carData.price)}
                    userName={userName}
                    email={user?.email}
                    dealer={dealerData.name}
                    partnerSalesData={partnerSalesData}
                    dealerstockNo={carData.dealerStockId}
                    requestingDealerName={dealerData.name}
                    requestingDealerId={dealerData.chromeDealerId}
                />

                <OriginalWindowDetails origWindowDetails={origWindowDetails} />
                <TradeTool tradeToolURL={tradeToolURL} />
                <PrequelTool prequelURL={prequelURL} />
                <CopyURLModal url={shareUrl} />

                <div
                    className="modal customModal"
                    id="vehicleHistoryModal"
                    role="dialog">
                    <div className="modal-dialog modal-dialog-responsive">
                        <div className="modal-content">
                            <div className="modal-header buttonContainer">
                                <button
                                    type="button"
                                    className="btn-close  btn-modal-cls closeButton mb-2"
                                    data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body modal-style-body">
                                <iframe
                                    srcDoc={vehicleAccident}
                                    frameBorder="0"
                                    height="100%"
                                    width="100%"
                                    allowFullScreen=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {isNotifyDealerModalOpen && (
                    <NotifyDealerModal
                        closeModal={closeNotifyDealerModal}
                        vin={carVIN}
                        carYear={carYear}
                        carMake={carMake}
                        carModel={carModel}
                        saveNotification={saveNotification}
                        dealerStockNumber={dealerStockId}
                        popupData={offsitePageData}
                        userName={userName}
                        requestingDealerName={requestingDealerName}
                        requestingDealerId={requestingDealerId}
                        purchaseAgreement={purchaseAgreementData}
                    />
                )}
            </div>
        </>
    );
}

export default CarInformation;
export function KbbModal() {
    return (
        <div
            className="modal customModal"
            id="kbbModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton mb-2"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src="https://mobile.tradeinvalet.com/TradeInValet/LandingPage?DealerId=3063&SalesStaffId=0&IsFirsTime=True"
                            height="100%"
                            width="100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function OriginalWindowDetails({ origWindowDetails }) {
    return (
        <div
            className="modal customModal"
            id="origWindowModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src={origWindowDetails}
                            frameBorder="0"
                            height="100%"
                            width="100%"
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TradeTool({ tradeToolURL }) {
    return (
        <div
            className="modal customModal"
            id="tradeToolModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src={tradeToolURL}
                            frameBorder="0"
                            height="100%"
                            width="100%"
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BuyNowModal({
    vin,
    dealer,
    price,
    stockNo,
    userName,
    vehicle,
    email,
    partnerSalesData,
    dealerstockNo,
    requestingDealerName,
    requestingDealerId
}) {
    const [buyNowMessage, create] = useFormState(buyNow);
    return (
        <div
            className="modal customModal"
            id="buyNowModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-header">
                        <div className="heading">
                            {buyNowMessage?.status == 200 ? (
                                <h4>{partnerSalesData.buyNowPopup.confirmationTitle}</h4>
                            ) : typeof buyNowMessage == "undefined" ? (
                                <h4>{partnerSalesData.buyNowPopup.title} </h4>
                            ) : (
                                <h4>{partnerSalesData.buyNowPopup.errorTitle}</h4>
                            )}
                        </div>
                    </div>
                    <div className="modal-body modal-style-body">
                        {typeof buyNowMessage === "undefined" ? (
                            <>
                                <p>{partnerSalesData.buyNowPopup.description}</p>
                                <br />
                                <form action={create}>
                                    <input
                                        type="hidden"
                                        name="vin"
                                        value={vin}
                                    />
                                    <input
                                        type="hidden"
                                        name="vehicle"
                                        value={vehicle}
                                    />
                                    <input
                                        type="hidden"
                                        name="price"
                                        value={price}
                                    />
                                    <input
                                        type="hidden"
                                        name="dealer"
                                        value={dealer}
                                    />
                                    <input
                                        type="hidden"
                                        name="stockNo"
                                        value={stockNo}
                                    />
                                    <input
                                        type="hidden"
                                        name="userName"
                                        value={userName}
                                    />
                                    <input
                                        type="hidden"
                                        name="email"
                                        value={email}
                                    />
                                    <input
                                        type="hidden"
                                        name="dealerstockNo"
                                        value={dealerstockNo}
                                    />
                                    <input
                                        type="hidden"
                                        name="requestingDealerId"
                                        value={requestingDealerId}
                                    />
                                    <input
                                        type="hidden"
                                        name="requestingDealerName"
                                        value={requestingDealerName}
                                    />
                                    <button className="btn  back-btn w-100 notify-btn">Confirm Purchase</button>
                                </form>
                            </>
                        ) : buyNowMessage.status == 200 ? (
                            <p> {partnerSalesData.buyNowPopup.confirmationDescription}</p>
                        ) : buyNowMessage.status == 500 && buyNowMessage.message == "" ? (
                            <p>{partnerSalesData.buyNowPopup.errorDescription}</p>
                        ) : (
                            <p>{buyNowMessage.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PrequelTool({ prequelURL }) {
    return (
        <div
            className="modal customModal"
            id="prequelModal"
            role="dialog">
            <div className="modal-dialog modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <button
                            type="button"
                            className="btn-close  btn-modal-cls closeButton"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body modal-style-body">
                        <iframe
                            src={prequelURL}
                            frameBorder="0"
                            height="100%"
                            width="100%"
                            allowFullScreen=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CopyURLModal({ url }) {
    const [type, setType] = useState([]);
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isShareBtnEnabled, setIsShareBtnEnabled] = useState(false);
    const hiddenButtonRef = useRef(null);

    const handleCheckboxChange = (option) => {
        if (type.includes(option)) {
            // If the option is already in the type array, remove it
            setType(type.filter((item) => item !== option));
        } else {
            // If the option is not in the type array, add it
            setType([...type, option]);
        }
    };
    const closeModal = () => {
        hiddenButtonRef.current.click();
        setType([]);
        setEmail("");
        setPhoneNumber("");
        setIsShareBtnEnabled(false);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        setIsShareBtnEnabled(true);
        const isValidNumber = phoneNumber ? isValidPhone(phoneNumber) : true;
        const isValidMail = email ? isValidEmail(email) : true;
        let errorMessage = "";

        if (!isValidNumber && !isValidMail && type.includes("phone") && type.includes("email")) {
            errorMessage = "Please enter a valid Phone Number and Email";
        } else if (!isValidNumber && type.includes("phone")) {
            errorMessage = "Please enter a valid Phone Number";
        } else if (!isValidMail && type.includes("email")) {
            errorMessage = "Please enter a valid Email";
        }

        if (errorMessage) {
            Swal.fire({
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Close"
            }).then((result) => {
                // Check if the user clicked the "Close" button
                if (result.isConfirmed) {
                    setIsShareBtnEnabled(false);
                }
            });
        } else {
            Swal.fire({
                text: "Are you sure you want to share the URL?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!"
            }).then(async (result) => {
                if (result.value) {
                    if (isValidNumber && type.includes("phone")) {
                        // const url = `${basePath}${path}`;
                        await sendSMS({ to: phoneNumber, body: url }).then((response) => {
                            if (response.status == 200) {
                                Swal.fire({
                                    text: "URL has been shared via SMS successfully!",
                                    icon: "success",
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Okay",
                                    showConfirmButton: false, // hide the confirm button
                                    showCloseButton: false,
                                    timer: 3000
                                }).then(async (result) => {
                                    setIsShareBtnEnabled(false);
                                    closeModal();
                                });
                            } else {
                                Swal.fire({
                                    text: response.message ?? "Failed to share URL via SMS",
                                    icon: "error",
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Close",
                                    showConfirmButton: false, // hide the confirm button
                                    showCloseButton: false,
                                    timer: 3000
                                }).then(async (result) => {
                                    setIsShareBtnEnabled(false);
                                    closeModal();
                                });
                            }
                        });
                    }

                    if (isValidMail && type.includes("email")) {
                        const emailData = {
                            to: email,
                            subject: "Vehicle Details Page URL",
                            text: url
                        };
                        try {
                            window.grecaptcha.ready(() => {
                                window.grecaptcha
                                    .execute(appConfig.RECAPTCHA_SITE_KEY, { action: "submit" })
                                    .then(async (token) => {
                                        /* send data to the server */

                                        await verifyRecaptchaWithEmail(token, emailData).then((response) => {
                                            if (response.status == 200) {
                                                Swal.fire({
                                                    text: "URL has been shared via email successfully!",
                                                    icon: "success",
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Okay",
                                                    showConfirmButton: false, // hide the confirm button
                                                    showCloseButton: false,
                                                    timer: 3000
                                                }).then(async (result) => {
                                                    setIsShareBtnEnabled(false);
                                                    closeModal();
                                                });
                                            } else {
                                                Swal.fire({
                                                    text: response.message ?? "Failed to share URL via email",
                                                    icon: "error",
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Close",
                                                    showConfirmButton: false, // hide the confirm button
                                                    showCloseButton: false,
                                                    timer: 3000
                                                }).then(async (result) => {
                                                    setIsShareBtnEnabled(false);
                                                    closeModal();
                                                });
                                            }
                                        });
                                    })
                                    .catch((error) => {});
                            });

                            // Continue with your logic here
                        } catch (err) {
                            return { status: 500, message: err.message };
                            // Handle the error here
                        }
                    }
                } else {
                    setIsShareBtnEnabled(false);
                }
            });
        }
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const isValidEmail = (value) => {
        const emailRegex = /\S+@\S+\.\S+\S/; //   /\S+@\S+\.com/;
        return emailRegex.test(value);
    };

    const handlePhoneNumberChange = (e) => {
        const rawPhoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);

        setPhoneNumber(formattedPhoneNumber);
    };

    const formatPhoneNumber = (value) => {
        const phoneNumberRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})$/; //Regular Expression
        const groups = value.match(phoneNumberRegex);

        if (groups) {
            let formattedPhoneNumber = "";
            if (groups[1]) {
                formattedPhoneNumber += groups[1];
            }
            if (groups[2]) {
                formattedPhoneNumber += `-${groups[2]}`;
            }
            if (groups[3]) {
                formattedPhoneNumber += `-${groups[3]}`;
            }
            if (groups[4]) {
                formattedPhoneNumber += `-${groups[4]}`;
            }
            return formattedPhoneNumber;
        } else {
            return value;
        }
    };

    const isValidPhone = (value) => {
        const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneNumberRegex.test(value);
    };
    return (
        <div
            className="modal copyURLModal "
            id="copyUrlModal"
            role="dialog">
            <div className="modal-dialog copy-url-modal-dialog-responsive">
                <div className="modal-content">
                    <div className="modal-header buttonContainer">
                        <div className="heading col-lg-12 col-md-12 col-sm-12 col-12 sub_heading bottom_border">
                            <h4>Share URL</h4>
                            <button
                                ref={hiddenButtonRef}
                                style={{ display: "none" }}
                                type="button"
                                className="btn-close  btn-modal-cls closeButton mb-2"
                                data-bs-dismiss="modal"></button>
                        </div>
                    </div>

                    <div className="modal-body modal-style-body ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-12 mt-1 mb-3">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-12 pb-2">
                                    <h6 className="word-break">URL: {url}</h6>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-1 pb-3">
                                    <label className="customcheck mt-2">
                                        <input
                                            type="checkbox"
                                            checked={type.includes("phone")}
                                            onChange={() => handleCheckboxChange("phone")}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6 pb-3">
                                    <input
                                        style={{ borderRadius: "20px" }}
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        placeholder="Phone Number"
                                        name="phoneNumber"
                                        maxLength="12"
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-12  pb-3 ">
                                <div className="row">
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-1 pb-3">
                                        <label className="customcheck mt-2">
                                            <input
                                                type="checkbox"
                                                checked={type.includes("email")}
                                                onChange={() => handleCheckboxChange("email")}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6 pb-3">
                                        <input
                                            style={{ borderRadius: "20px" }}
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            placeholder="Email"
                                            name="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="col-lg-4 col-md-4 col-sm-4 col-4 pb-5 sub_heading button-div-share ">
                                    <button
                                        className="btn btn-custom back-btn-share w-100 notify-btn-share"
                                        type="button"
                                        onClick={handleButtonClick}
                                        disabled={type.length == 0 || isShareBtnEnabled}>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
