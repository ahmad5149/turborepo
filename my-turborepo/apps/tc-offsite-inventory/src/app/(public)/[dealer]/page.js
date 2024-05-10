import SRP from "../../../components/cars/AccessingSRPData";
import { findYourRidePageContent, offsiteFindYourRidePageContent } from "@/sanity/Sanity";
import { GetAllFacets, GetAllCars, FilterListing, SearchCars } from "@/services/carService";
import { appConfig } from "../../../appConfig";
import React from "react";
// import { seoAttributes } from "./[vin]/seo-schema";
// import { sortMapping } from "@/utils/SortingUtil";
import { GetDealerData } from "@/utils/helpers/dealerHelper";
import CarWithInvalidVIN from "@/components/cars/cardetails/CarWithInvalidVIN";
// import { LoadTradePending } from "@/components/trade-pending/trade-pending-hook";
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;
// export async function generateMetadata({ searchParams }) {
//     const findYourRideData = await offsiteFindYourRidePageContent();
//     let oneVehicleData = null;
//     let query = {
//         page: 1,
//         perPage: 1,
//         orderBy: "year",
//         orderAsc: false
//     };
//     let queryString = "";
//     const creatingFilterTypesString = (filterArray, terminator) => {
//         return filterArray.map((element) => terminator + "=" + element).join("&");
//     };
//     const createParams = (filterArray, terminator) => {
//         if (queryString !== "") {
//             queryString += "&";
//         }
//         queryString +=
//             typeof filterArray === "object"
//                 ? creatingFilterTypesString(filterArray, terminator)
//                 : terminator + "=" + filterArray;
//     };
//     function removeParams(paramsObject, paramName) {
//         if (paramsObject && paramName && paramsObject.hasOwnProperty(paramName)) {
//             delete paramsObject[paramName];
//         }
//     }
//     let showComingSoonCars = true;
//     if (
//         searchParams.bodystyle ||
//         searchParams.doors ||
//         searchParams.cylinder ||
//         searchParams.fuel ||
//         searchParams.engine ||
//         searchParams.train ||
//         searchParams.transmission ||
//         searchParams.incolor ||
//         searchParams.excolor ||
//         searchParams.price ||
//         searchParams.year ||
//         searchParams.mileage ||
//         searchParams.make ||
//         searchParams.model ||
//         searchParams.q ||
//         searchParams.sort ||
//         searchParams.showComingSoonCars
//     ) {
//         if (searchParams.sort) {
//             const sortProperties = sortMapping[searchParams.sort];
//             if (sortProperties) {
//                 query.orderAsc = sortProperties.orderAsc;
//                 query.orderBy = sortProperties.orderBy;
//             }
//         }
//         if (searchParams.showComingSoonCars) {
//             showComingSoonCars = searchParams.showComingSoonCars;
//         }
//         if (searchParams.q) {
//             query.q = searchParams.q;
//             oneVehicleData = await SearchCars(query, showComingSoonCars);
//             oneVehicleData = oneVehicleData.items;
//         } else {
//             if (searchParams.make) {
//                 createParams(searchParams.make, "make");
//             }
//             if (searchParams.model) {
//                 createParams(searchParams.model, "model");
//             }
//             if (searchParams.bodystyle) {
//                 createParams(searchParams.bodystyle, "bodystyle");
//             }
//             if (searchParams.doors) {
//                 createParams(searchParams.doors, "doors");
//             }
//             if (searchParams.transmission) {
//                 createParams(searchParams.transmission, "transmission");
//             }
//             if (searchParams.fuel) {
//                 createParams(searchParams.fuel, "fuel");
//             }
//             if (searchParams.excolor) {
//                 createParams(searchParams.excolor, "excolor");
//             }
//             if (searchParams.incolor) {
//                 createParams(searchParams.incolor, "incolor");
//             }
//             if (searchParams.cylinder) {
//                 createParams(searchParams.cylinder, "cylinder");
//             }
//             if (searchParams.engine) {
//                 createParams(searchParams.engine, "engine");
//             }
//             if (searchParams.train) {
//                 createParams(searchParams.train, "train");
//             }
//             if (searchParams.year && Array.isArray(searchParams.year) && searchParams.year.length === 2) {
//                 const [minYear, maxYear] = searchParams.year.map(Number);
//                 if (minYear > maxYear) {
//                     removeParams(searchParams, "year");
//                 } else {
//                     if (!isNaN(minYear) && !isNaN(maxYear)) {
//                         createParams([minYear, maxYear], "year");
//                     } else {
//                         removeParams(searchParams, "year");
//                     }
//                 }
//             }
//             if (searchParams.mileage && Array.isArray(searchParams.mileage) && searchParams.mileage.length === 2) {
//                 const [lowMileage, highMileage] = searchParams.mileage.map(Number);
//                 if (lowMileage > highMileage) {
//                     removeParams(searchParams, "mileage");
//                 } else {
//                     if (!isNaN(lowMileage) && !isNaN(highMileage)) {
//                         createParams([lowMileage, highMileage], "mileage");
//                     } else {
//                         removeParams(searchParams, "mileage");
//                     }
//                 }
//             }
//             if (searchParams.price && Array.isArray(searchParams.price) && searchParams.price.length === 2) {
//                 const [minPrice, maxPrice] = searchParams.price.map(Number);
//                 if (minPrice > maxPrice) {
//                     removeParams(searchParams, "price");
//                 } else {
//                     if (!isNaN(minPrice) && !isNaN(maxPrice)) {
//                         createParams([minPrice, maxPrice], "price");
//                     } else {
//                         removeParams(searchParams, "price");
//                     }
//                 }
//             }
//             if (queryString) {
//                 queryString += "&";
//             } else {
//                 removeParams(searchParams);
//             }
//             queryString += "orderBy=" + query.orderBy + "&" + "orderAsc=" + query.orderAsc + "&page=1&perPage=1";
//             oneVehicleData = await FilterListing(queryString, 1, false);
//             oneVehicleData = oneVehicleData.items;
//         }
//     } else {
//         oneVehicleData = await GetAllCars(query, showComingSoonCars);
//         oneVehicleData = oneVehicleData.items;
//     }
//     const vehicle = oneVehicleData?.length ? oneVehicleData[0].document : undefined;
//     if (vehicle != undefined) {
//         const metaData = findYourRideData.metaData;
//         vehicle["images"] = vehicle?.photoUrls;
//         // will return vehicle data
//         return seoAttributes({ vehicle, metaData });
//     }
// }
const CarsPage = async ({ params, searchParams }) => {
    debugger;
    const findYourRideData = await offsiteFindYourRidePageContent();
    console.log("🚀 ~ CarsPage ~ findYourRideData:", findYourRideData);
    const dealerData = await GetDealerData(params.dealer);
    const dealerName = params.dealer;
    if (!dealerData) {
        return (
            <>
                <CarWithInvalidVIN message={"Dealer not found"} />
                {/* <CarsNotFound ErrorMessage="Oops! We could not find any results against the selected criteria" /> */}
            </>
        );
    }
    const allFacets = await GetAllFacets(dealerData.chromeDealerId);
    let dealerPackAmount = dealerData.packAmount ?? 500;
    return (
        <div className="text-center">
            {allFacets && findYourRideData && (
                <SRP
                    allFacets={allFacets}
                    queryParams={searchParams}
                    marketingDetails={findYourRideData.marketingDetails}
                    carTileContactInfo={findYourRideData.contactDetailsText}
                    dealerConfig={dealerData}
                    packAmount={dealerPackAmount}
                    dealerName={dealerName}
                />
            )}
            {!findYourRideData && <CarWithInvalidVIN message={"No sanity data found!"}></CarWithInvalidVIN>}
            {!allFacets && <CarWithInvalidVIN message={"Sorry, no cars found!"}></CarWithInvalidVIN>}
            {/* <LoadTradePending /> */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
          .aa-apv-card-row.aa-apv-row-container {
            background: #f4f6f8 !important;
          }
        `
                }}
            />
        </div>
    );
};
export default CarsPage;
