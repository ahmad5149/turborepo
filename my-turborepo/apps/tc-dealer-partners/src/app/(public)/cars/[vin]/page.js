import CarInformation from "@/components/cars/cardetails/CarInformation";
import CarSummary from "@/components/cars/cardetails/CarSummary";

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
import { useFaqPageContent, useOffsiteCarDetailsContent, usePartnerSalesCarDetailsContent } from "@/sanity/Sanity";
import { jsonLD } from "./seo-schema";
import CarWithInvalidVIN from "@/components/cars/cardetails/CarWithInvalidVIN";
import { GetDealerData } from "@/utils/helpers/dealerHelper";
import { notFound, redirect } from "next/navigation";
import { saveNotification } from "../../../../app/api/saveNotification";
import { CheckAuth } from "../../page";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

/**
 * Generate Metadata and OG Tags
 * @param {{params: {vin: string}}}
 *
 * @returns {Promise<import("next").Metadata>}
 */

async function GetDistance(vehicleZip, myZip) {
    const url = new URL("https://us-central1-tc-production-390801.cloudfunctions.net/distanceCalculator");
    url.searchParams.set("origin", vehicleZip);
    url.searchParams.set("destination", myZip);

    const resp = await fetch(url.href).then((res) => res.json());

    return resp;
}

const CarDetailsPage = async ({ params, searchParams }) => {
    const user = await CheckAuth();

    if (!user) {
        redirect("/");
    }

    let carData = null;
    let otherCarDetails = null;
    let origWindowDetails = null;
    let vehicleAccident = null;

    const dealerData = await GetDealerData(user.dealer);

    const sellerData = await GetDealerData("thiscar");

    let jsonLDData;
    let similarCarsFilters = null;

    const offsitePageData = await useOffsiteCarDetailsContent();
    const partnerSalesData = await usePartnerSalesCarDetailsContent();
    const baseUrl = appConfig.OFFSITE_API_BASE_URL;
    if (!baseUrl) {
        return notFound();
    }

    if (params.vin) {
        carData = await GetCarDetails(params.vin);
        if (carData != null && carData != undefined) {
            carData.images = carData.photoUrls ?? [];
            carData.price = carData.dealerPrice;

            similarCarsFilters = {
                make: carData.make,
                bodyType: carData.bodyType,
                price: carData.price,
                year: carData.year,
                model: carData.model
            };

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

    if (!carData || (carData.status && carData.status == "hidden")) {
        return (
            <>
                <CarWithInvalidVIN />
                {/* <CarsNotFound ErrorMessage="Oops! We could not find any results against the selected criteria" /> */}
            </>
        );
    }
    if (!dealerData || dealerData?.isActive == false || dealerData?.isDeleted == true) {
        return (
            <>
                <CarWithInvalidVIN message={"Dealer not found"} />
                {/* <CarsNotFound ErrorMessage="Oops! We could not find any results against the selected criteria" /> */}
            </>
        );
    }

    const distance = await GetDistance(carData.postalCode, dealerData.dealerZipCode);

    if (distance.length > 0) {
        carData.distance = Math.ceil(
            Number(distance[0]?.distance?.miles?.replace(",", "")?.replace("mi", "").trim()) + 75
        );
    }

    const dealerName = params.dealer ?? "THIScar";

    return (
        <React.Fragment>
            <div className="car-details-overflow">
                <div className="detail-page">
                    <div className="row pt-0 pt-lg-3">
                        {carData && (
                            <CarInformation
                                carData={carData}
                                status={status}
                                carPopUp={offsitePageData?.ourCarsPopUp ?? ""}
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
                                partnerSalesData={partnerSalesData}
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
                                phoneNumber={dealerData ? dealerData.phone : ""}
                                year={carData.year}
                                trim={carData.trim}
                                model={carData.model}
                                make={carData.make}
                            />
                        )}
                        {/* {pageData && <NotesSection notesSection={pageData.notesSection} />} */}

                        {/* {offsitePageData?.deliveryEstimates && (
                            <DeliveryEstimates
                                popupData={offsitePageData.deliveryEstimates}
                                vin={params.vin}
                                dealerConfig={dealerData}
                            />
                        )} */}

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
