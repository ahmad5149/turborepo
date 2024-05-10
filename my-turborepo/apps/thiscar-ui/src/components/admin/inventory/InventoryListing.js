import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
const InventoryData = {
    photos: ["/media/coming-soon.png", "/media/coming-soon.png", "/media/coming-soon.png", "/media/coming-soon.png"]
};

function InventoryListing({ inventoryData, showUnprocessed, openNotifyDealerModal }) {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [innerDimensions, setDimensions] = useState({
        screenWidth: undefined,
        screenHeight: undefined
    });

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
    const handleRowMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleRowMouseLeave = () => {
        setHoveredRow(null);
    };

    function renderStatusDot(status) {
        const colors = {
            active: "green",
            sold: "blue",
            hidden: "purple",
            pending: "yellow"
        };

        if (colors.hasOwnProperty(status)) {
            const color = colors[status];

            return (
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        display: "inline-block",
                        borderRadius: "50%",
                        backgroundColor: color,
                        marginRight: "5px",
                        marginLeft: "1px"
                    }}></div>
            );
        }

        return null; // Return null for unknown status
    }

    return (
        <>
            {inventoryData?.map((value, index) => (
                <div
                    key={index}
                    onMouseEnter={() => handleRowMouseEnter(index)}
                    onMouseLeave={handleRowMouseLeave}
                    className="col-12 row pe-0 mt-4 me-0"
                    style={{ minWidth: "fit-content" }}>
                    {!showUnprocessed && (
                        <>
                            {value?.document?.photoUrls && (
                                <>
                                    <div className={`${innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"} row`}>
                                        <Image
                                            src={value.document.photoUrls[0]}
                                            width={100}
                                            height={100}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            className="img-fluid mt-2"
                                        />
                                    </div>
                                    <div
                                        className={`${
                                            innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"
                                        } ps-0 row`}>
                                        {value.document?.photoUrls?.slice(1, 4).map((value, index) => (
                                            <div
                                                key={index}
                                                className="col-6 mt-1">
                                                <Image
                                                    src={value}
                                                    width={100}
                                                    height={100}
                                                    alt=""
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    className="img-fluid mt-2"
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="col-6 mt-1"
                                            style={{ position: "relative" }}>
                                            <Image
                                                src={value.document?.photoUrls[4]}
                                                width={100}
                                                height={100}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    filter: "blur(2px)" // Apply the blur effect to the image
                                                }}
                                                className="img-fluid mt-2"
                                            />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "59%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    color: "white",
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                                                }}>
                                                +{value?.document?.photoUrls?.length - 4}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {!value.document.photoUrls && (
                                <>
                                    <div className={`${innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"} row`}>
                                        <Image
                                            src={InventoryData.photos[0]}
                                            width={100}
                                            height={100}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            className="img-fluid mt-2"
                                        />
                                    </div>
                                    <div
                                        className={`${
                                            innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"
                                        } ps-0 row`}>
                                        {InventoryData.photos.slice(1, 4).map((value, index) => (
                                            <div
                                                key={index}
                                                className="col-6 mt-1">
                                                <Image
                                                    src={value}
                                                    width={100}
                                                    height={100}
                                                    alt=""
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    className="img-fluid mt-2"
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="col-6 mt-1"
                                            style={{ position: "relative" }}>
                                            <Image
                                                src={InventoryData.photos[0]}
                                                width={100}
                                                height={100}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    filter: "blur(2px)" // Apply the blur effect to the image
                                                }}
                                                className="img-fluid mt-2"
                                            />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "59%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    color: "white",
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                                                }}>
                                                +23
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {showUnprocessed && (
                        <>
                            {value?.document?.unprocessedPhotoUrls && (
                                <>
                                    <div className={`${innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"} row`}>
                                        <Image
                                            src={value.document.unprocessedPhotoUrls[0]}
                                            width={100}
                                            height={100}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            className="img-fluid mt-2"
                                        />
                                    </div>
                                    <div
                                        className={`${
                                            innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"
                                        } ps-0 row`}>
                                        {value.document?.unprocessedPhotoUrls?.slice(1, 4).map((value, index) => (
                                            <div
                                                key={index}
                                                className="col-6 mt-1">
                                                <Image
                                                    src={value}
                                                    width={100}
                                                    height={100}
                                                    alt=""
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    className="img-fluid mt-2"
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="col-6 mt-1"
                                            style={{ position: "relative" }}>
                                            <Image
                                                src={value.document?.unprocessedPhotoUrls[4]}
                                                width={100}
                                                height={100}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    filter: "blur(2px)" // Apply the blur effect to the image
                                                }}
                                                className="img-fluid mt-2"
                                            />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "59%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    color: "white",
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                                                }}>
                                                +{value?.document?.unprocessedPhotoUrls?.length - 4}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {!value.document.unprocessedPhotoUrls && (
                                <>
                                    <div className={`${innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"} row`}>
                                        <Image
                                            src={InventoryData.photos[0]}
                                            width={100}
                                            height={100}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                            className="img-fluid mt-2"
                                        />
                                    </div>
                                    <div
                                        className={`${
                                            innerDimensions.screenWidth > 1300 ? "col-2" : "col-6"
                                        } ps-0 row`}>
                                        {InventoryData.photos.slice(1, 4).map((value, index) => (
                                            <div
                                                key={index}
                                                className="col-6 mt-1">
                                                <Image
                                                    src={value}
                                                    width={100}
                                                    height={100}
                                                    alt=""
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    className="img-fluid mt-2"
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="col-6 mt-1"
                                            style={{ position: "relative" }}>
                                            <Image
                                                src={InventoryData.photos[0]}
                                                width={100}
                                                height={100}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    filter: "blur(2px)" // Apply the blur effect to the image
                                                }}
                                                className="img-fluid mt-2"
                                            />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "59%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    color: "white",
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                                                }}>
                                                +23
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {innerDimensions.screenWidth > 1301 && (
                        <>
                            <div className={`col-8 row text-start`}>
                                <div className="col-12 mt-2">
                                    <h3 className="text-start">
                                        {value.document.year} {value.document.make} {value.document.model}{" "}
                                        {value.document.trim}
                                    </h3>
                                </div>
                                <div className="col-2 pe-0 text-gray-500">VIN</div>
                                <div className="col-1 pe-0 text-gray-500">Mileage</div>
                                <div className="col-1 pe-0 text-gray-500">Price</div>
                                <div className="col-2 pe-0 text-gray-500">Dealer</div>
                                <div className="col-2 pe-0 text-gray-500">Transmission</div>
                                <div className="col-2 pe-0 text-gray-500">Status</div>
                                <div className="col-1 pe-0 text-gray-500">Notes</div>
                                <div className="col-2 pe-0">{value.document?.vin}</div>
                                <div className="col-1 pe-0 d-flex align-items-center">
                                    {value.document.odometer?.toLocaleString()}
                                </div>
                                <div className="col-1 pe-0 d-flex align-items-center">
                                    {value.document.price?.toLocaleString()}
                                </div>
                                <div className="col-2 pe-0 d-flex align-items-center">
                                    {value.document.dealerName ?? "N/A"}
                                </div>
                                <div className="col-2 pe-0 d-flex align-items-center">
                                    {value.document.transmission}
                                </div>
                                <div className="col-2 pe-0 d-flex align-items-center">
                                    {renderStatusDot(value.document.status?.toLowerCase())}

                                    {value.document.status &&
                                        `${value.document.status
                                            ?.charAt(0)
                                            .toUpperCase()}${value.document.status?.slice(1)}`}
                                </div>
                                <div className="col-1 pe-0 d-flex align-items-center">{value.document.notes}</div>
                                <div className="col-1 pe-0 d-flex align-items-center">
                                    {hoveredRow === index && (
                                        <>
                                            <div className="icon-wrapper pe-2">
                                                <i
                                                    className="ki-duotone ki-notification-on text-info fs-2"
                                                    onClick={() =>
                                                        openNotifyDealerModal(
                                                            value.document?.vin,
                                                            value.document.dealerStockId,
                                                            value.document.year,
                                                            value.document.make,
                                                            value.document.model,
                                                            value.document.dealerName,
                                                            value.document
                                                        )
                                                    }>
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                    <span className="path3"></span>
                                                    <span className="path4"></span>
                                                    <span className="path5"></span>
                                                </i>
                                            </div>

                                            <div className="icon-wrapper">
                                                <Link
                                                    href={`inventory/${value.document.vin}`}
                                                    passHref>
                                                    <i className="ki-duotone ki-pencil text-info fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {innerDimensions.screenWidth <= 1300 && (
                        <div className="col-12 row text-start mt-2">
                            <div className="col-12 mt-2">
                                <h3 className="text-start">
                                    {value.document.year} {value.document.make} {value.document.model}{" "}
                                    {value.document.trim}
                                </h3>
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>VIN:</strong> {value.document?.vin}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Year:</strong> {value.document.year}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Mileage:</strong> {value.document.odometer?.toLocaleString()}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Price:</strong> ${value.document.price?.toLocaleString()}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Dealer:</strong> {value.document.dealerName ?? "N/A"}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Transmission:</strong> {value.document.transmission}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong className="me-1">Status:</strong>
                                {renderStatusDot(value.document.status?.toLowerCase())}
                                {value.document.status &&
                                    `${value.document.status.charAt(0).toUpperCase()}${value.document.status.slice(1)}`}
                            </div>
                            <div className={innerDimensions.screenWidth <= 525 ? "col-12 pe-0" : "col-6 pe-0"}>
                                <strong>Notes:</strong> {value.document.notes}
                            </div>
                            <div className={`col-12 pe-0 d-flex align-items-center justify-content-center mt-2`}>
                                <>
                                    <div className="icon-wrapper pe-2 button-div">
                                        <button
                                            onClick={() =>
                                                openNotifyDealerModal(
                                                    value.document?.vin,
                                                    value.document.dealerStockId,
                                                    value.document.year,
                                                    value.document.make,
                                                    value.document.model,
                                                    value.document.dealerName,
                                                    value.document
                                                )
                                            }
                                            className="btn btn-custom back-btn listing-btn"
                                            type="button">
                                            <i className="ki-duotone ki-notification-on text-info fs-2x">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                                <span className="path4"></span>
                                                <span className="path5"></span>
                                            </i>
                                            Notify
                                        </button>
                                        <Link
                                            href={`inventory/${value.document.vin}`}
                                            passHref>
                                            <button
                                                className="btn btn-custom upload-btn ms-2 listing-btn"
                                                type="button">
                                                {" "}
                                                <i className="ki-duotone ki-pencil text-light fs-2x">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                </i>
                                                Edit
                                            </button>
                                        </Link>
                                    </div>
                                </>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}

export default InventoryListing;
