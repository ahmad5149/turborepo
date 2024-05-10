"use client";
import "../../../contents/scss/carModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function CarModalMobile(props) {
    const images = props.images;
    return (
        <div
            className={`modal d-flex`}
            id="myModal">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content  gallery-images-modal">
                    <div className="modal-header">
                        <h3 className="modal-title text-white">
                            {" "}
                            {props.name}
                            <p className="">${props.price ? props.price.toLocaleString() : 0}</p>
                        </h3>
                        <FontAwesomeIcon
                            onClick={() => props.setIsModalOpen(false)}
                            icon={faXmark}
                            size="lg"
                            className="text-white"
                        />
                    </div>
                    <div className="modal-body modal-style-body">
                        <div className="slider-container slider-mob row text-center">
                            {images.map((imageUrl, index) => (
                                <div
                                    className="position-relative ps-0 pe-0 pt-0 mt-2"
                                    key={index}>
                                    <Image
                                        className="grid-item mob-img mt-2"
                                        src={imageUrl}
                                        width={500}
                                        height={350}
                                        alt=""
                                        quality={50}
                                    />
                                    {/* {(props.status === "pending" || props.status === "cancelled") && (
                                        <Image
                                            src={"/media/sale-pending-banner@2x.png"}
                                            width={250}
                                            height={250}
                                            style={{
                                                width: "38%",
                                                height: "50%"
                                            }}
                                            className="position-absolute top-0 start-0 img-fluid banner mt-2"
                                        />
                                    )} */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarModalMobile;
