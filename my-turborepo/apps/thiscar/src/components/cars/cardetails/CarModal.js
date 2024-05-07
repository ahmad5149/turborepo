"use client";
import React, { useEffect, useState } from "react";
import "../../../contents/scss/carModal.scss";
import Image from "next/image";

function CarModal(props) {
    const images = props.images;
    const [currentIndex, setCurrentIndex] = useState(props.selectedIndex);
    const [selectedImage, setSelectedImage] = useState(images[props.selectedIndex]);
    const [isFullscreen, setFullScreen] = useState(false);

    useEffect(() => {
        setSelectedImage(images[props.selectedIndex]);
    }, [props.selectedIndex]);

    const handleImageClick = (imageUrl, index) => {
        setCurrentIndex(index);
        setSelectedImage(imageUrl);
    };

    const handleArrowClick = (direction) => {
        const currentIndex = images.indexOf(selectedImage);
        let newIndex;

        if (direction === "left") {
            newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        }
        setCurrentIndex(newIndex);

        setSelectedImage(images[newIndex]);
    };

    return (
        <div
            className={`modal d-flex`}
            id="myModal">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content  gallery-images-modal">
                    <div className="modal-body modal-style-body">
                        <div className="slider-container row">
                            {isFullscreen && (
                                <div className="fullscreen">
                                    <div className="position-relative">
                                        <Image
                                            src={selectedImage}
                                            onClick={() => setFullScreen(false)}
                                            sizes="100vw"
                                            style={{
                                                width: "100%",
                                                height: "auto"
                                            }}
                                            quality={50}
                                            width={800}
                                            height={800}
                                        />
                                        {(props.status == "pending" || props.status == "cancelled" || props.status == "deposit") && (
                                            <img
                                                src={"../media/sale-pending-banner@2x.png"}
                                                className="position-absolute top-0 start-0 img-fluid banner"></img>
                                        )}
                                    </div>
                                </div>
                            )}
                            {!isFullscreen && (
                                <>
                                    <div className="col-lg-3">
                                        <div className="d-flex flex-column gallery-container">
                                            <h4 className="text-white text-left">
                                                {props.name}
                                                <p className="">${props.price ? props.price.toLocaleString() : 0}</p>
                                            </h4>
                                            <div className="gallery grid-container container row">
                                                {images.map((imageUrl, index) => (
                                                    <div
                                                        key={index}
                                                        className={`col-6 position-relative pe-0 ps-0 ${
                                                            index === currentIndex ? "active" : ""
                                                        }`}
                                                        onClick={() => handleImageClick(imageUrl, index)}>
                                                        <Image
                                                            src={imageUrl}
                                                            width={800}
                                                            height={800}
                                                            alt=""
                                                            quality={50}
                                                            className="main-img"
                                                        />
                                                        {(props.status === "pending" ||
                                                            props.status === "cancelled" || props.status == "deposit") && (
                                                            <Image
                                                                src={"/media/sale-pending-banner@2x.png"}
                                                                width={250}
                                                                height={250}
                                                                style={{
                                                                    width: "30%",
                                                                    height: "50%"
                                                                }}
                                                                className="position-absolute w-50 h-75  top-0 start-0 img-fluid banner"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-9">
                                        {" "}
                                        <span className="border-box-shadow"></span>
                                        <div className="d-flex flex-column zoom-veiw-container">
                                            <button
                                                type="button"
                                                className="btn-close bg-white text-white btn-modal-cls mb-2 pb-3"
                                                data-bs-dismiss="modal"
                                                onClick={() => props.setIsModalOpen(false)}></button>
                                            <div className="zoom-view">
                                                <div className="position-relative">
                                                    <Image
                                                        src={selectedImage}
                                                        onClick={() => setFullScreen(true)}
                                                        // width={800}
                                                        // height={600}
                                                        alt=""
                                                        className="fullImage"
                                                        sizes="100vw"
                                                        style={{
                                                            width: "100%",
                                                            height: "auto"
                                                        }}
                                                        quality={50}
                                                        width={800}
                                                        height={600}
                                                    />
                                                    {(props.status === "pending" || props.status === "cancelled" || props.status == "deposit") && (
                                                        <Image
                                                            src={"/media/sale-pending-banner@2x.png"}
                                                            width={250}
                                                            height={250}
                                                            style={{
                                                                width: "30%",
                                                                height: "50%"
                                                            }}
                                                            className=
                                                            "position-absolute top-0 start-0 img-fluid banner"
                                                        />
                                                    )}
                                                </div>
                                                <div
                                                    className="arrow-contain"
                                                    onClick={() => handleArrowClick("left")}>
                                                    <div className="arrow left">&lt;</div>
                                                </div>
                                                <div
                                                    className="arrow-contain-right"
                                                    onClick={() => handleArrowClick("right")}>
                                                    <div className="arrow right">&gt;</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarModal;
