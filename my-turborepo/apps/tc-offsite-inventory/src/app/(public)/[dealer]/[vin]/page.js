import CarInformation from "@/components/cars/cardetails/CarInformation";
import CarSummary from "@/components/cars/cardetails/CarSummary";
import DeliveryEstimates from "@/components/cars/cardetails/DeliveryEstimates";
import FeatureItems from "@/components/cars/cardetails/FeatureItems";
import OtherVehicles from "@/components/cars/cardetails/OtherVehicles";
import "@/contents/scss/CarDetails.scss";
import Faqs from "@/components/cars/cardetails/Faqs";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import { appConfig } from "../../../../appConfig";
import {
    GetCarDetails,
    fetchAutoCheckData,
    GetLikeVehicles,
    GetWindowStickerUrl
} from "../../../../services/carService";
import { useCarDetailsPageContent, useFaqPageContent } from "@/sanity/Sanity";
import { jsonLD } from "./seo-schema";
import CarWithInvalidVIN from "@/components/cars/cardetails/CarWithInvalidVIN";
import { GetDealerData } from "@/utils/helpers/dealerHelper";
import { notFound } from "next/navigation";
import { saveNotification } from "../../../../app/api/saveNotification";
import { useOffsiteCarDetailsContent } from "@/sanity/Sanity";
import { fetchDealersById } from "../../../../services/dealerService";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

/**
 * Generate Metadata and OG Tags
 * @param {{params: {vin: string}}} p
 *
 * @returns {Promise<import("next").Metadata>}
 */
// export async function generateMetadata({ params }) {
//     const vehicle = await GetCarDetails(params.vin);

// export async function generateMetadata({ params }) {
//     const vehicle = await GetCarDetails(params.vin);

//     if (vehicle != null && (!vehicle.status || vehicle.status != "hidden")) {
//         // will return vehicle data
//         vehicle.images = vehicle.photoUrls ?? [];
//         return seoAttributes({ vehicle });
//     }
// }

const CarDetailsPage = async ({ params, searchParams }) => {
    let carData = null;
    let otherCarDetails = null;
    let origWindowDetails = null;
    let vehicleAccident = null;
    let user = false; // we will create a server action to check authentication cookie & firebase to suppress certain data.
    const dealerData = await GetDealerData(params.dealer);
    const sellerData = await GetDealerData("thiscar");

    if (!dealerData || dealerData?.isActive == false || dealerData?.isDeleted == true) {
        return (
            <>
                <CarWithInvalidVIN message={"Dealer not found"} />
                {/* <CarsNotFound ErrorMessage="Oops! We could not find any results against the selected criteria" /> */}
            </>
        );
    }

    const dealerPackAmount = dealerData?.packAmount ?? 500;
    let jsonLDData;
    let similarCarsFilters = null;
    let carDealer;

    const offsitePageData = await useOffsiteCarDetailsContent();
    const baseUrl = appConfig.OFFSITE_API_BASE_URL;
    if (!baseUrl) {
        return notFound();
    }

    if (params.vin) {
        carData = await GetCarDetails(params.vin);
        if (carData != null && carData != undefined) {
            carDealer = await fetchDealersById(carData.dealerId);
            carData.images = carData.offsitePhotoUrls ?? [];
            if (!dealerPackAmount.error) {
                carData.price += dealerPackAmount;
            }

            similarCarsFilters = {
                make: carData.make,
                bodyType: carData.bodyType,
                price: carData.price,
                year: carData.year,
                model: carData.model
            };

            //otherCarDetails = await GetSiFconmilarCars(params.vin, similarCarsFilters, );

            otherCarDetails = await GetLikeVehicles(
                carData.bodyType,
                carData.price,
                dealerData ? dealerData.chromeDealerId : 0,
                carData.vin
            );
        }
        origWindowDetails = searchParams.windowSticker ? await GetWindowStickerUrl(params.vin) : null;
        vehicleAccident = await fetchAutoCheckData(params.vin);
        jsonLDData = jsonLD({ vehicle: carData });
    }
    const twentyFourHoursAgoTimestamp = Date.now() - 24 * 60 * 60 * 1000;
    const status =
        carData?.updatedAt < twentyFourHoursAgoTimestamp || carData?.status == "deposit" || carData?.status == "pending"
            ? "pending"
            : null;
    const faqPageData = await useFaqPageContent();
    const pageData = await useCarDetailsPageContent();

    if (!carData || (carData.status && carData.status == "hidden")) {
        return (
            <>
                <CarWithInvalidVIN />
                {/* <CarsNotFound ErrorMessage="Oops! We could not find any results against the selected criteria" /> */}
            </>
        );
    }
    const dealerName = params.dealer;

    return (
        <React.Fragment>
            {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLDData) }}
            /> */}
            {/* <script src={`https://www.google.com/recaptcha/api.js?render=${appConfig.RECAPTCHA_SITE_KEY}`} /> */}
            <div className="car-details-overflow">
                <div className="detail-page">
                    <div className="row pt-0 pt-lg-3">
                        {carData && (
                            <CarInformation
                                carData={carData}
                                status={status}
                                carPopUp={offsitePageData?.ourCarsPopUp}
                                images={carData.images}
                                stockNo={carData.stockId}
                                price={carData.price}
                                engine={carData.engine}
                                fuelType={carData.fuel}
                                transmission={carData.transmission}
                                driveType={carData.drivetrain}
                                mileage={carData.odometer}
                                numberOfPhotos={carData.numberOfPhotos}
                                name={`${carData.year || ""} ${carData.make || ""} ${carData.model || ""} ${
                                    carData.trim || ""
                                }`}
                                confirmAvailability={offsitePageData?.confirmAvailabilityPopUp}
                                phoneNumber={dealerData ? dealerData.phone : ""}
                                origWindowDetails={origWindowDetails}
                                vehicleAccident={vehicleAccident}
                                vin={params.vin}
                                dealerName={dealerName}
                                saveNotification={saveNotification}
                                offsitePageData={offsitePageData}
                                dealerData={dealerData}
                                sellerData={sellerData}
                            />
                        )}
                        {/* {carData && (
                            <CarDetailsOptions
                                origWindowDetails={origWindowDetails}
                                vehicleAccident={vehicleAccident}
                                vin={params.vin}
                                name={`${carData.year || ""} ${carData.make || ""} ${carData.model || ""} ${
                                    carData.trim || ""
                                }`}
                                images={carData.images[0]}
                            />
                        )} */}

                        {carData && (
                            <CarSummary
                                interiorColor={carData.interiorColor}
                                extColor={carData.extColor}
                                hwyMPG={carData.hwyMPG}
                                cityMPG={carData.cityMPG}
                                bodyStyle={carData.bodyStyle}
                                vin={carData.vin}
                                phoneNumber={dealerData ? dealerData.phone : ""}
                                year={carData.year}
                                trim={carData.trim}
                                model={carData.model}
                                make={carData.make}
                            />
                        )}
                        {/* {pageData && <NotesSection notesSection={pageData.notesSection} />} */}

                        {offsitePageData?.deliveryEstimates && (
                            <DeliveryEstimates
                                popupData={offsitePageData.deliveryEstimates}
                                vin={params.vin}
                                dealerConfig={dealerData}
                                dealerZipCode={carDealer?.dealerZipCode}
                            />
                        )}

                        {carData?.standardOptions && <FeatureItems featureItems={carData.standardOptions} />}
                        {otherCarDetails && offsitePageData && offsitePageData.legalPopUp && (
                            <OtherVehicles
                                similarCars={otherCarDetails}
                                legalPopupData={offsitePageData.legalPopUp}
                                dealerConfig={dealerData}
                            />
                        )}
                        {false && faqPageData && <Faqs faq={faqPageData} />}
                    </div>
                </div>
            </div>
            {/* <LoadTradePending /> */}
        </React.Fragment>
    );
};

export default CarDetailsPage;
