"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Toolbar } from "../common/toolbar/Toolbar";
import "../../../contents/scss/admin/inventory.scss";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import { UploadSVG } from "../../../contents/svgs/admin";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { v4 } from "uuid";

const DnDImage = ({ image, index, moveImage, deleteImage, setHeroImage }) => {
    const [isHovered, setIsHovered] = useState(false);

    const [, ref] = useDrag({
        type: "IMAGE",
        item: { index }
    });

    const [, drop] = useDrop({
        accept: "IMAGE",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveImage(draggedItem.index, index);
                draggedItem.index = index;
            }
        }
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            className={`dnd-image-container ${isHovered ? "hovered" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img
                src={image}
                alt={`Image ${index + 1}`}
                className="image"
            />

            <div className={`footer-bar px-2 ${isHovered ? "visible" : ""}`}>
                {/* <i className="ki-duotone ki-arrow-two-diagonals fs-2 text-info drag-icon">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                </i> */}
                <div
                    className="set-hero-image"
                    onClick={() => setHeroImage(index)}>
                    {/* {index !== 0 && (
                        <i className="ki-duotone ki-picture text-info fs-2 mb-0">
                            <span className="path1"></span>
                            <span className="path2"></span>
                        </i>
                    )} */}
                    {index === 0 ? "Hero Image" : "Make Hero"}
                </div>
                <i
                    className="ki-duotone ki-tablet-delete text-info fs-2 delete-icon"
                    onClick={() => deleteImage(index)}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                </i>
            </div>

            {index === 0 && (
                <div className="purple-bar">
                    <p>Hero photo</p>
                </div>
            )}

            <div
                className="hover-overlay"
                style={{ opacity: isHovered ? 1 : 0 }}
            />
        </div>
    );
};

const ImageList = ({ images, onOrderChange, deleteImage, setHeroImage }) => {
    const [imageList, setImageList] = useState(images);

    useEffect(() => {
        setImageList(images);
    }, [images]);

    const moveImage = (fromIndex, toIndex) => {
        const updatedList = [...imageList];
        const [movedImage] = updatedList.splice(fromIndex, 1);
        updatedList.splice(toIndex, 0, movedImage);
        setImageList(updatedList);
        onOrderChange(updatedList);
    };

    return (
        <div className="image-list-container">
            {imageList?.map((image, index) => (
                <DnDImage
                    deleteImage={deleteImage}
                    key={index}
                    image={image}
                    index={index}
                    moveImage={moveImage}
                    setHeroImage={setHeroImage}
                />
            ))}
        </div>
    );
};

const statusOptions = ["Processed", "Unprocessed", "Unbranded"];
const carStatusOptions = ["visible", "pending", "hidden"];
function EditInventory({ carData, updateInventory, deletePhoto, uploadUnprocessedImages }) {
    const router = useRouter();
    const [processedImages, setProcessedImages] = useState(carData?.photoUrls ?? []);
    const [unprocessedImages, setUnprocessedImages] = useState(carData?.unprocessedPhotoUrls ?? []);
    const [unbrandedImages, setUnbrandedImages] = useState(carData?.offsitePhotoUrls ?? []);
    const [images, setImages] = useState(carData.photoUrls);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setUploadedImages((prevImages) => {
                const newImages = acceptedFiles
                    .filter((upFile) => !prevImages.some((prevImage) => prevImage.name === upFile.name))
                    .map((upFile) => Object.assign(upFile, { preview: URL.createObjectURL(upFile) }));

                return [...prevImages, ...newImages];
            });
        }
    });
    const [price, setPrice] = useState(carData.price);
    const [mileage, setMileage] = useState(carData.odometer);
    const [isVisible, setIsVisible] = useState(true);
    const [notes, setNotes] = useState(carData.notes);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [carStatus, setCarStatus] = useState(carStatusOptions[0]);

    useEffect(() => {
        if (carData.status) {
            if (carData.status == "hidden" || carData.status == "kicked") {
                setIsVisible(false);
            }

            setCarStatus(carData.status);
            if (carData.status == "active") {
                setCarStatus("visible");
            }
        }
    }, []);

    function updateStatusState(e) {
        setSelectedStatus(e.target.value);
        if (e.target.value === statusOptions[0]) {
            setProcessedImages(carData?.photoUrls);
            setImages(carData?.photoUrls);
        } else if (e.target.value === statusOptions[1]) {
            setUnprocessedImages(carData?.unprocessedPhotoUrls);
            setImages(carData?.unprocessedPhotoUrls);
        } else if (e.target.value === statusOptions[2]) {
            setUnbrandedImages(carData?.offsitePhotoUrls);
            setImages(carData?.offsitePhotoUrls);
        }
        setNewImages([]);
    }

    function changeCarStatus(e) {
        setCarStatus(e.target.value);
        if (e.target.value === carStatusOptions[2]) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }

    function deleteImage(index) {
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    const handleOrderChange = useCallback((newOrder) => {
        // You can do something with the updated order, such as sending it to a server or updating local state.
        setImages(newOrder);
    }, []);
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const handleAddImage = () => {
        if (selectedStatus == statusOptions[1]) {
            const newImgArray = [...images, ...uploadedImages.map((img) => img.preview)];
            setImages(newImgArray);
            setNewImages((prevImages) => [...prevImages, ...uploadedImages]);
            setUploadedImages([]);
        } else {
            Swal.fire({
                title: "Only unprocessed photos are accepted",
                icon: "error",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Close"
            });
        }
    };

    const handleNumericChange = (event, stateHandler) => {
        const rawValue = event.target.value;
        // Remove non-numeric characters from the input
        const numericValue = Number(rawValue.replace(/[^0-9.]/g, ""));

        stateHandler(numericValue);
    };
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currency: "USD"
    }).format(price);
    async function onSubmit() {
        try {
            if (mileage < 0) {
                toast.error("Mileage should not be less than 0");
            }
            if (price < 9000) {
                toast.error("Price should be greater than 9000");
            }
            if (!isVisible && !notes) {
                toast.error("Notes must be entered for hiding a car");
            } else {
                carData.odometer = mileage;
                carData.price = price;
                if (selectedStatus == statusOptions[0]) {
                    carData.photoUrls = images.filter((image) =>
                        newImages.every((newImage) => newImage.preview !== image)
                    );
                } else if (selectedStatus == statusOptions[1]) {
                    carData.unprocessedPhotoUrls = images.filter((image) =>
                        newImages.every((newImage) => newImage.preview !== image)
                    );
                } else if (selectedStatus == statusOptions[2]) {
                    carData.offsitePhotoUrls = images.filter((image) =>
                        newImages.every((newImage) => newImage.preview !== image)
                    );
                }

                switch (carData?.status?.toLowerCase()) {
                    case "hidden":
                    case "kicked":
                        carData.status = isVisible ? "active" : "hidden";
                        break;
                    case "deposit":
                    case "active":
                    default:
                        carData.status = isVisible ? "active" : "hidden";
                        break;
                }
                if (carStatus == "pending") {
                    carData.status = "pending";
                }
                if (carStatus == "visible") {
                    carData.status = "active";
                }

                carData.notes = notes;
                if (isVisible) {
                    carData.notes = "";
                }
                Swal.fire({
                    title: "Are you sure you want to update this car?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes!"
                }).then(async (result) => {
                    if (result.value) {
                        Swal.fire({
                            allowOutsideClick: false,
                            html: `
                                <div style="text-align: center;">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <div style="margin-top: 10px;">Updating...</div>
                                </div>`,
                            showConfirmButton: false,
                            showCancelButton: false
                        });

                        setIsUpdating(true);

                        try {
                            const uploadedUrls = [];
                            await Promise.all(
                                newImages.map(async (img) => {
                                    const formData = new FormData();

                                    formData.append("file", img);

                                    const id = v4();
                                    const parts = img.type?.split("/");
                                    const extension = parts[parts.length - 1];
                                    const uploadFileName = `${carData.vin}/unprocessedPhotos/${id}.${extension}`;
                                    formData.append("fileName", uploadFileName);

                                    const response = await fetch("/api/uploadImage", {
                                        method: "POST",
                                        body: formData
                                    });

                                    const res = await response.json();
                                    if (res.status === 201) {
                                        const uploadedUrl = res.publicUrl;
                                        uploadedUrls.push(uploadedUrl);
                                    }
                                })
                            );
                            if (uploadedUrls.length > 0) {
                                await uploadUnprocessedImages(carData.vin, uploadedUrls);
                            }
                            delete carData.updatedAt;
                            delete carData.createdAt;
                            delete carData.deleteTime;
                            delete carData.photosUpdatedAt;
                            delete carData.priceUpdateAt;
                            delete carData.feedAt;

                            // we cannot pass all of the data form client to server as the timestamps lose their actual value
                            // we delete/omit the timestamps so the system does not get into a weird state.

                            if (carData.status == "hidden") {
                                delete carData.activeAt;
                                carData.hiddenAt = new Date();
                            } else if (carData.status == "active") {
                                delete carData.hiddenAt;
                                carData.activeAt = new Date();
                            }

                            await updateInventory(carData);

                            Swal.fire({
                                title: "Record updated successfully",
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Okay"
                            }).then(async (result) => {
                                router.push("/admin/inventory");
                            });
                        } catch (error) {
                            setIsUpdating(false);
                            console.log(error);
                            Swal.fire({
                                title: "Record update failed",
                                icon: "error",
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Close"
                            });
                        }
                    }
                });
            }
        } catch (error) {
            // Handle errors here
            console.error("Error in onSubmit:", error);
            toast.error("Record updation failed", {
                autoClose: 1500,
                onClose: () => {
                    setIsUpdating(false);
                }
            });
        }
    }

    async function deleteImageFromArrays(index) {
        const url = images[index];

        const urlExistsInNewImages = newImages.some((image) => image.preview === url);

        if (urlExistsInNewImages) {
            setNewImages((prevNewImages) => prevNewImages.filter((image) => image.preview !== url));
        } else {
            await deletePhoto(url);
        }
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    function deleteMainImage(index) {
        if (images.length <= 9) {
            Swal.fire({
                title: "A car must have more than 8 images",
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Okay"
            });
        } else {
            deleteImageFromArrays(index);
        }
    }

    function setHeroImage(index) {
        const updatedImages = [...images];
        const elementToMove = updatedImages.splice(index, 1)[0];
        updatedImages.unshift(elementToMove);
        setImages(updatedImages);
    }

    function areInputsValid() {
        return !(mileage >= 0 && images?.length > 9 && price >= 9000 && ((!isVisible && notes) || isVisible));
    }

    return (
        <>
            <Toolbar pageName="Inventory" />
            {/*begin::Post*/}
            <div
                className="post fs-6 d-flex flex-column-fluid"
                id="kt_post">
                {/*begin::Container*/}
                <div className="container-xxl">
                    {/*begin::Products*/}
                    <div className="card card-flush">
                        {/*begin::Card header*/}
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5"></div>
                        {/*end::Card header*/}
                        {/*begin::Card body*/}
                        <div className="card-body pt-0">
                            <div className="bg-gray-200 col-12 row pt-2 pb-2 ps-2">
                                <div className="col-md-3 form-floating">
                                    <input
                                        type="text"
                                        value={carData.year}
                                        className="form-control w-100"
                                        id="year"
                                        disabled
                                    />
                                    <label htmlFor="year">Year</label>
                                </div>
                                <div className="col-md-9 form-floating">
                                    {" "}
                                    <input
                                        type="text"
                                        value={`${carData.make} ${carData.model} ${carData.trim}`}
                                        className="form-control w-100"
                                        id="name"
                                        disabled
                                    />
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className="col-md-3 mt-2 form-floating">
                                    {" "}
                                    <input
                                        type="text"
                                        value={carData.vin}
                                        className="form-control w-100 "
                                        id="vin"
                                        disabled
                                    />
                                    <label htmlFor="vin">VIN</label>
                                </div>
                                <div className="col-md-3 mt-2 form-floating">
                                    {" "}
                                    <input
                                        type="text"
                                        value={carData.dealerStockId}
                                        className="form-control w-100 "
                                        id="dealerStockId"
                                        disabled
                                    />
                                    <label htmlFor="dealerStock">Dealer Stock #</label>
                                </div>
                                <div className="col-md-3 mt-2 form-floating">
                                    {" "}
                                    <input
                                        type="text"
                                        onChange={(e) => handleNumericChange(e, setMileage)}
                                        value={mileage?.toLocaleString()}
                                        className={`form-control w-100 ${mileage >= 0 ? "" : "is-invalid"}`}
                                        id="mileage"
                                    />
                                    <label htmlFor="mileage">Mileage</label>
                                </div>
                                <div className="col-md-3 mt-2 form-floating">
                                    {" "}
                                    <input
                                        type="text"
                                        value={formattedPrice}
                                        onChange={(e) => handleNumericChange(e, setPrice)}
                                        className={`form-control w-100 ${price >= 9000 ? "" : "is-invalid"}`}
                                        id="mileage"
                                    />
                                    <label htmlFor="price">Price</label>
                                </div>
                                <div className="col-md-3 mt-2 form-floating">
                                    <select
                                        id="statusSelect"
                                        className="form-select"
                                        data-control="select2"
                                        data-hide-search="true"
                                        data-placeholder="Status"
                                        value={carStatus}
                                        onChange={changeCarStatus}>
                                        {" "}
                                        {carStatusOptions.map((value, index) => (
                                            <option
                                                key={index}
                                                value={value}>
                                                {capitalizeFirstLetter(value)}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="mileage">Vehicle Status</label>
                                </div>
                                {/* <div className="form-check mt-2 col-md-1 d-flex align-items-center justify-content-around">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isSalePending}
                                        onChange={() => {
                                            setIsSalePending(!isSalePending);
                                            setIsVisible(true);
                                        }}
                                        id="flexCheckDefault"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault">
                                        Pending
                                    </label>
                                </div>
                                <div className="form-check mt-2 col-md-1 d-flex align-items-center justify-content-around">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isVisible}
                                        onChange={() => {
                                            setIsVisible(!isVisible);
                                            setIsSalePending(false);
                                        }}
                                        id="flexCheckDefault"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault">
                                        Visible
                                    </label>
                                </div> */}
                                {!isVisible && (
                                    <div className="col-md-11 mt-2 form-floating">
                                        {" "}
                                        <input
                                            type="text"
                                            value={notes}
                                            className={`form-control w-100 ${
                                                notes && notes?.length > 0 ? "" : "is-invalid"
                                            }`}
                                            id="notes"
                                            placeholder="Add notes for hiding inventory"
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                        <label htmlFor="notes">Notes</label>
                                        {(!notes || notes?.length === 0) && (
                                            <div className="invalid-feedback text-start">
                                                Please add an explanation for hiding the car from the listing.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                <div className="card-header ps-2 py-5 gap-2 gap-md-5 d-flex justify-content-between text-start history-container">
                                    <div>
                                        <h3>Car History</h3>
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <ul>
                                            {carData.history?.length > 0
                                                ? carData.history?.map((h, index) => (
                                                      <li key={index}>
                                                          <div>
                                                              Dealer Price: {h.dealerPrice} &middot; THIScar Online
                                                              Price: {h.price} &middot; Date: {h.createdAt}
                                                          </div>
                                                      </li>
                                                  ))
                                                : null}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="card-header ps-2 align-items-center py-5 gap-2 gap-md-5 d-flex justify-content-between text-start">
                                    <div>
                                        <h3>Photos</h3>
                                        <p>Drag and drop to reorder photos</p>
                                    </div>
                                    <div className="form-floating">
                                        <select
                                            id="statusSelect"
                                            className="form-select"
                                            data-control="select2"
                                            data-hide-search="true"
                                            data-placeholder="Status"
                                            value={selectedStatus}
                                            onChange={updateStatusState}>
                                            {" "}
                                            {statusOptions.map((value, index) => (
                                                <option
                                                    key={index}
                                                    value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="statusSelect">Photos</label>
                                    </div>
                                </div>
                                <DndProvider
                                    backend={HTML5Backend}
                                    key={images?.length}>
                                    <ImageList
                                        images={images}
                                        onOrderChange={handleOrderChange}
                                        deleteImage={deleteMainImage}
                                        setHeroImage={setHeroImage}
                                    />
                                </DndProvider>

                                <h2 className="text-start mt-5 mb-2">Upload photo</h2>
                                <div
                                    {...getRootProps()}
                                    className="img-drop-container d-flex">
                                    <input {...getInputProps()}></input>
                                    <UploadSVG></UploadSVG>
                                    {isDragActive ? (
                                        <p className="ms-3">Drop the image here</p>
                                    ) : (
                                        <div className="ms-3">
                                            <p className="drop-title mb-1">
                                                Drag & Drop here or{" "}
                                                <span className="browse-text">
                                                    {" "}
                                                    <strong>Browse</strong>
                                                </span>
                                            </p>
                                            <p className="drop-text mb-1">Supported image formats: jpeg, png, gif</p>
                                        </div>
                                    )}
                                </div>
                                <div className="container img-container">
                                    {uploadedImages?.map((image, index) => (
                                        <div
                                            key={index}
                                            className="image">
                                            <span
                                                className="delete"
                                                onClick={() => deleteImage(index)}>
                                                &times;
                                            </span>
                                            <Image
                                                src={image.preview}
                                                width={100}
                                                height={100}
                                                style={{
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                                alt=""></Image>
                                        </div>
                                    ))}
                                </div>
                                {uploadedImages?.length > 0 && (
                                    <button
                                        className="btn btn-custom upload-btn"
                                        type="button"
                                        onClick={handleAddImage}>
                                        Upload
                                    </button>
                                )}
                            </div>
                            <div className="button-div text-start mt-2">
                                <button
                                    onClick={() => router.push("/admin/inventory")}
                                    className="btn btn-custom back-btn"
                                    type="button">
                                    <i className="ki-duotone ki-black-left fs-2x text-info"></i>Go Back
                                </button>
                                <button
                                    className="btn btn-custom upload-btn ms-2"
                                    type="button"
                                    disabled={isUpdating || areInputsValid()}
                                    onClick={onSubmit}>
                                    {" "}
                                    <i className="ki-duotone ki-check fs-2x text-secondary"></i>
                                    Save
                                </button>
                                <ToastContainer />
                            </div>
                        </div>
                        {/*end::Card body*/}
                    </div>
                    {/*end::Products*/}
                </div>
                {/*end::Container*/}
            </div>
            {/*end::Post*/}
        </>
    );
}

export default EditInventory;
