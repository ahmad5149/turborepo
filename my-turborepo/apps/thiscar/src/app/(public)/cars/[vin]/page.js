import CarInformation from "@/components/cars/cardetails/CarInformation";
import CarDetailsOptions from "@/components/cars/cardetails/CarDetailsOptions";
import CarSummary from "@/components/cars/cardetails/CarSummary";
import DeliveryEstimates from "@/components/cars/cardetails/DeliveryEstimates";
import FeatureItems from "@/components/cars/cardetails/FeatureItems";
import OtherVehicles from "@/components/cars/cardetails/OtherVehicles";
import "@/contents/scss/CarDetails.scss";
import Faqs from "@/components/cars/cardetails/Faqs";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import { appConfig } from "../../../../appConfig";
import { getDealersById } from "../../../../services/dealerService";
import {
    GetCarDetails,
    GetSimilarCars,
    fetchAutoCheckData,
    GetWindowStickerUrl
} from "../../../../services/carService";
import { useCarDetailsPageContent, useFaqPageContent } from "@/sanity/Sanity";
import NotesSection from "@/components/cars/cardetails/NotesSection";
import { jsonLD, seoAttributes } from "./seo-schema";
import CarWithInvalidVIN from "@/components/cars/cardetails/CarWithInvalidVIN";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

/**
 * Generate Metadata and OG Tags
 * @param {{params: {vin: string}}} params
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
    const vehicle = await GetCarDetails(params.vin);

    if (vehicle && vehicle.status && vehicle.status != "hidden") {
        // will return vehicle data
        vehicle.images = vehicle.photoUrls ?? [];
        return seoAttributes({ vehicle });
    }
}

const CarDetailsPage = async ({ params, searchParams }) => {
    let carData = null;
    let otherCarDetails = null;
    let origWindowDetails = null;
    let vehicleAccident = null;
    let jsonLDData;
    let similarCarsFilters = null;
    let carDealer;

    if (params.vin) {
        carData = await GetCarDetails(params.vin);
        if (carData != null || carData != undefined) {
            carDealer = await getDealersById(carData.dealerId);
            carData.images = carData.photoUrls ?? [];

            similarCarsFilters = {
                make: carData.make,
                bodyType: carData.bodyType,
                price: carData.price,
                year: carData.year,
                model: carData.model
            };
        }
        otherCarDetails = await GetSimilarCars(params.vin, similarCarsFilters);
        origWindowDetails = searchParams.windowSticker ? await GetWindowStickerUrl(params.vin) : null;
        vehicleAccident = await fetchAutoCheckData(params.vin);
        jsonLDData = jsonLD({ vehicle: carData });
    }
    const twentyFourHoursAgoTimestamp = Date.now() - 24 * 60 * 60 * 1000;
    let status = carData?.updatedAt < twentyFourHoursAgoTimestamp ? "pending" : null;
    status = status != null && status == "deposit" ? "pending" : carData?.status;

    const faqPageData = await useFaqPageContent();
    const pageData = await useCarDetailsPageContent();
    if (!carData || !carData.status || carData.status == "hidden") {
        return (
            <>
                <CarWithInvalidVIN />
            </>
        );
    }
    if (carDealer?.isActive == false || carDealer?.isDeleted == true) {
        return <CarWithInvalidVIN message="Car not available" />;
    }

    return (
        <React.Fragment>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLDData) }}
            />
            <script src={`https://www.google.com/recaptcha/api.js?render=${appConfig.RECAPTCHA_SITE_KEY}`} />

            <div className="car-details-overflow">
                <div className="detail-page">
                    <div className="row pt-0 pt-lg-3">
                        {carData && (
                            <CarInformation
                                status={status}
                                carPopUp={pageData?.ourCarsPopUp}
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
                                confirmAvailability={pageData?.confirmAvailabilityPopUp}
                                carInformation={pageData?.carInformation}
                                origWindowDetails={origWindowDetails}
                                vehicleAccident={vehicleAccident}
                                vin={params.vin}
                                loc={carDealer?.state}
                            />
                        )}

                        {carData && (
                            <CarSummary
                                interiorColor={carData.interiorColor}
                                extColor={carData.extColor}
                                hwyMPG={carData.hwyMPG}
                                cityMPG={carData.cityMPG}
                                bodyStyle={carData.bodyStyle}
                                vin={carData.vin}
                                year={carData.year}
                                trim={carData.trim}
                                model={carData.model}
                                make={carData.make}
                            />
                        )}
                        {pageData && <NotesSection notesSection={pageData.notesSection} />}
                        {pageData?.deliveryEstimates && (
                            <DeliveryEstimates
                                popupData={pageData.deliveryEstimates}
                                vin={params.vin}
                                dealerZipCode={carDealer?.dealerZipCode}
                            />
                        )}

                        {carData?.standardOptions && <FeatureItems featureItems={carData.standardOptions} />}
                        {otherCarDetails && pageData && pageData.legalPopUp && (
                            <OtherVehicles
                                similarCars={otherCarDetails}
                                legalPopupData={pageData.legalPopUp}
                            />
                        )}
                        {faqPageData && <Faqs faq={faqPageData} />}
                    </div>
                </div>
            </div>
            {/* <LoadTradePending /> */}
        </React.Fragment>
    );
};

export default CarDetailsPage;
