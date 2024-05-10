import * as Api from "../utils/HttpVerbs";
import querystring from "querystring";
import { appConfig } from "../appConfig";
import { search } from "./search";
import axios from "axios";
import { dealerNameColumns } from "../utils/excludedColumns";
import { getDealersById } from "./dealerService";

const excludeFields = [
    "bodyStyle",
    "bodyType",
    "chromeStyleId",
    "cityMPG",
    "createdAt",
    "dealerId",
    "deleteTime",
    "doors",
    "drivetrain",
    "engine",
    "engineDisplacement",
    "dealerId",
    "extColor",
    "extColorGeneric",
    "fuel",
    "hwyMPG",
    "id",
    "interiorColor",
    "interiorMaterial",
    "make",
    "model",
    "modelCode",
    "numberOfOffsitePhotos",
    "numberOfPhotos",
    "odometer",
    "photosUpdatedAt",
    "postalCode",
    "price",
    "processedPhotos",
    "stockId",
    "transmission",
    "trim",
    "updatedAt",
    "vehicleStyle",
    "vin",
    "year",
    "photoUrls",
    "processedPhotos",
    "standardOptions",
    "yearString",
    "unprocessedPhotoUrls",
    "photoUrls"
];

const excludeDataFields = [
    "bodyStyle",
    "bodyType",
    "chromeStyleId",
    "cityMPG",
    "dealerId",
    "deleteTime",
    "doors",
    "drivetrain",
    "engine",
    "engineDisplacement",
    "dealerId",
    "extColor",
    "extColorGeneric",
    "fuel",
    "hwyMPG",
    "id",
    "interiorColor",
    "interiorMaterial",
    "modelCode",
    "photosUpdatedAt",
    "postalCode",
    "processedPhotos",
    "stockId",
    "transmission",
    "vehicleStyle",
    "standardOptions",
    "yearString",
    "photoUrls",
    "unprocessedPhotoUrls"
];

const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
let statusFilter = `status:!=[hidden,pending,deposit]&&updatedAt:>${twoDaysAgo}`;

async function GetCarDetails(id) {
    try {
        if (id.toString().length === 17) {
            // const response = await Api.GetByID(`${appConfig.API_URL}/v2/listings`, id);
            const response = await search.collections("vehicles").documents(id).retrieve();
            // Check if response is undefined or null or has an error property
            if (response === undefined || response === null || (response.hasOwnProperty("error") && response.error)) {
                //    console.error("Error in GetCarDetails:", response.error);
                return null;
            }
            if (
                response &&
                response?.status != "hidden" &&
                response?.status != "pending" &&
                response?.status != "deposit" &&
                response?.updatedAt > twoDaysAgo
            ) {
                const dealerData = await getDealersById(response?.dealerId);
                if (dealerData && dealerData?.isActive) {
                    return response;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null; // return null in case invalid VIN
        }
    } catch (error) {
        //  console.error("Error in GetCarDetails:", error);
        throw error;
    }
}

function getSortBy(query) {
    let sort_by;

    switch (query.orderBy) {
        case "mileage":
            sort_by = "odometer:asc";
            break;

        case "price":
            sort_by = query.orderAsc && query.orderAsc != "false" ? "price:asc" : "price:desc";
            break;

        case "createdAt":
            sort_by = "createdAt(missing_values: last):desc";
            //  sort_by = "updatedAt:asc";
            break;

        case "year":
            sort_by = "year:desc";
            break;

        default:
            sort_by = "odometer:asc";
            break;
    }

    return sort_by;
}

async function getActiveDealerIds(dealerId) {
    const onlyDealerNames = dealerNameColumns();
    const getDealers = await search.collections("dealers").documents().search({
        q: "*",
        filter_by: "isDeleted:false&&isActive:true",
        sort_by: "name:asc",
        exclude_fields: onlyDealerNames,
        per_page: 250
    });
    const dealerIds = getDealers.hits.map(({ document }) => document.chromeDealerId);
    const filteredDealerIds = dealerIds.filter((id) => id !== dealerId);
    return filteredDealerIds;
}

async function GetAllCars(query, showComingSoonCars = true, dealerID) {
    try {
        const sort_by = getSortBy(query);
        const dealerIds = await getActiveDealerIds(dealerID);

        const searchParameters = {
            q: "*",
            sort_by,
            filter_by: `${statusFilter}&&dealerId:[${dealerIds}]`,
            exclude_fields: excludeDataFields,
            per_page: query.perPage ?? 20,
            page: query.page ?? 1
        };
        if (showComingSoonCars == "false" || !showComingSoonCars) {
            searchParameters.filter_by += `&&numberOfOffsitePhotos:>9`;
        }
        const response = await search.collections("vehicles").documents().search(searchParameters);

        const pagination = {
            page: response.page,
            perPage: response.request_params.per_page,
            total: response.found,
            out_of: response.out_of,
            maxPage: Math.ceil(response.found / response.request_params.per_page)
        };
        return { pagination, items: response.hits };
    } catch (error) {
        throw error;
    }
}

async function SearchCars(query, showComingSoonCars = true, dealerID) {
    const sort_by = getSortBy(query);
    const dealerIds = await getActiveDealerIds(dealerID);
    const searchParameters = {
        q: query.q ?? "*",
        page: query.page ?? 1,
        exclude_fields: excludeDataFields,
        per_page: query.perPage ?? 20,
        query_by: ["vin", "stockId", "make", "model", "trim", "bodyStyle", "bodyType", "yearString"],
        filter_by: `${statusFilter}&&dealerId:[${dealerIds}]`,
        sort_by
    };

    if (showComingSoonCars == "false" || !showComingSoonCars) {
        searchParameters.filter_by += `&&numberOfOffsitePhotos:>9`;
    }
    const response = await search.collections("vehicles").documents().search(searchParameters);
    const pagination = {
        page: response.page,
        perPage: response.request_params.per_page,
        total: response.found,
        out_of: response.out_of,
        maxPage: Math.ceil(response.found / response.request_params.per_page)
    };

    return { pagination, items: response.hits };
}
async function GetCarsByStockId(query) {
    const sort_by = getSortBy(query);
    const response = await search
        .collections("vehicles")
        .documents()
        .search({
            q: query.q ?? "*",
            page: query.page ?? 1,
            per_page: query.perPage ?? 20,
            query_by: ["stockId"],
            sort_by
        });
    const pagination = {
        page: response.page,
        perPage: response.request_params.per_page,
        total: response.found,
        out_of: response.out_of,
        maxPage: Math.ceil(response.found / response.request_params.per_page)
    };
    return { pagination, items: response.hits };
}
function formatVariableArray(variableName, array) {
    return `${variableName}:=${JSON.stringify(array)}`;
}

async function FilterListing(queryParams, perPage = 20, showComingSoonCars = true, dealerId = 0) {
    const searchParams = new URLSearchParams(queryParams);
    const sort_by = getSortBy({
        orderBy: searchParams.get("orderBy"),
        orderAsc: searchParams.get("orderAsc")
    });
    const bodyStyles = searchParams.getAll("bodystyle");
    const makes = searchParams.getAll("make");
    const models = searchParams.getAll("model");
    const years = searchParams.getAll("year");
    const mileage = searchParams.getAll("mileage");
    const prices = searchParams.getAll("price");
    const driveType = searchParams.getAll("train");
    const cylinders = searchParams.getAll("cylinder");
    const transmission = searchParams.getAll("transmission");
    const extColor = searchParams.getAll("excolor");
    const fuel = searchParams.getAll("fuel");
    const doors = searchParams.getAll("doors");
    const interiorColor = searchParams.getAll("incolor");
    const engineDisplacement = searchParams.getAll("engine");

    const searchFilters = [];

    if (bodyStyles.length > 0) {
        const electric = bodyStyles.indexOf("Electric");

        if (electric > -1) {
            bodyStyles.splice(electric, 1);
            // this is important, electric is not a bodyType it is a fuel type.
            searchFilters.push(formatVariableArray("fuel", ["Electric"]));
        }
        if (bodyStyles.length > 0) {
            // we need to recheck to see if we have an array with any elements
            searchFilters.push(formatVariableArray("bodyType", bodyStyles));
        }
    }

    if (makes.length > 0) {
        searchFilters.push(formatVariableArray("make", makes));
    }

    if (models.length > 0) {
        searchFilters.push(formatVariableArray("model", models));
    }

    if (years.length > 1) {
        searchFilters.push(`year:[${years[0]}..${years[1]}]`);
    }

    if (mileage.length > 1) {
        searchFilters.push(`odometer:[${mileage[0]}..${mileage[1]}]`);
    }

    if (prices.length > 1) {
        searchFilters.push(`price:[${prices[0]}..${prices[1]}]`);
    }

    if (driveType.length > 0) {
        searchFilters.push(formatVariableArray("drivetrain", driveType));
    }

    if (cylinders.length > 0) {
        searchFilters.push(formatVariableArray("engine", cylinders));
    }

    if (transmission.length > 0) {
        searchFilters.push(formatVariableArray("transmission", transmission));
    }

    if (fuel.length > 0) {
        searchFilters.push(formatVariableArray("fuel", fuel));
    }

    if (extColor.length > 0) {
        searchFilters.push(formatVariableArray("extColorGeneric", extColor));
    }

    if (doors.length > 0) {
        searchFilters.push(`doors:[${doors}]`);
    }

    if (interiorColor.length > 0) {
        searchFilters.push(formatVariableArray("interiorColor", interiorColor));
    }

    if (engineDisplacement.length > 0) {
        searchFilters.push(formatVariableArray("engineDisplacement", engineDisplacement));
    }
    if (showComingSoonCars == "false" || !showComingSoonCars) {
        searchFilters.push(`numberOfOffsitePhotos:>9`);
    }
    searchFilters.push(statusFilter);

    const dealerIds = await getActiveDealerIds(dealerId);

    searchFilters.push(`dealerId:[${dealerIds}]`);

    const filter_by = searchFilters.join("&&");

    try {
        const response = await search
            .collections("vehicles")
            .documents()
            .search({
                q: "*",
                query_by: ["model", "make", "bodyType", "fuel"],
                filter_by,
                exclude_fields: excludeDataFields,
                sort_by,
                page: searchParams.get("page") ?? 1,
                per_page: searchParams.get("perPage") ?? perPage
            });

        const pagination = {
            page: response.page,
            perPage: response.request_params.per_page,
            total: response.found,
            out_of: response.out_of,
            maxPage: Math.ceil(response.found / response.request_params.per_page)
        };

        return { pagination, items: response.hits };
    } catch (e) {
        return null;
    }
}

async function GetWindowStickerUrl(vin) {
    try {
        const response = await fetch("https://app.velocityautomotive.com/api/recon/windowsticker/v1/integration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.VELOCITY_AUTOMOTIVE_TOKEN}`
            },
            body: JSON.stringify({
                vin: vin,
                source: "thiscar",
                displayPrice: true
            }),
            next: {
                revalidate: 7 * 24 * 60 * 60
            }
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const url = await response.text();

        return url;
    } catch (error) {
        console.log("err", error);
        return "";
    }
}

async function fetchAutoCheckData(vin) {
    const url = "https://www.autocheck.com/DealerWebLink.jsp";
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const formData = {
        VIN: vin,
        CID: appConfig.AUTOCHECK_CID,
        PWD: appConfig.AUTOCHECK_PWD,
        SID: appConfig.AUTOCHECK_SID
    };
    const body = querystring.stringify(formData);

    const requestOptions = {
        method: "POST",
        body: body,
        headers: headers
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch AutoCheck data");
    }
}

async function GetAllFacets(dealerId = 0) {
    try {
        const dealerIds = await getActiveDealerIds(dealerId);
        const filterBy = `${statusFilter}&&numberOfOffsitePhotos:>9&&dealerId:[${dealerIds}]`;
        const documentsCount = await search.collections("vehicles").documents().search({
            q: "*",
            filter_by: filterBy,
            per_page: 0 // Setting per_page to 0 to only retrieve the total count
        });
        //   console.log(documentsCount);
        //     console.log(documentsCount.found);
        if (documentsCount && documentsCount?.found > 0) {
            try {
                const getMaxPrice = await search
                    .collections("vehicles")
                    .documents()
                    .search({
                        q: "*",
                        filter_by: filterBy,
                        sort_by: "price(missing_values: last):desc",
                        exclude_fields: excludeFields.filter((item) => item !== "price"),
                        per_page: 1
                    });
                let maxPrice = getMaxPrice.hits[0].document.price;
                const getMinPrice = await search
                    .collections("vehicles")
                    .documents()
                    .search({
                        q: "*",
                        filter_by: filterBy,
                        sort_by: "price(missing_values: last):asc",
                        exclude_fields: excludeFields.filter((item) => item !== "price"),
                        per_page: 1
                    });
                let minPrice = getMinPrice.hits[0].document.price;
                const price = [minPrice, maxPrice];
                const getMaxMilage = await search
                    .collections("vehicles")
                    .documents()
                    .search({
                        q: "*",
                        filter_by: filterBy,
                        sort_by: "odometer(missing_values: last):desc",
                        exclude_fields: excludeFields.filter((item) => item !== "odometer"),
                        per_page: 1
                    });
                let maxMilage = getMaxMilage.hits[0].document.odometer;
                const getMinMilage = await search
                    .collections("vehicles")
                    .documents()
                    .search({
                        q: "*",
                        filter_by: filterBy,
                        sort_by: "odometer(missing_values: last):asc",
                        exclude_fields: excludeFields.filter((item) => item !== "odometer"),
                        per_page: 1
                    });
                let minMilage = getMinMilage.hits[0].document.odometer;
                const mileage = [minMilage, maxMilage];
                const getFacets = await search.collections("vehicles").documents().search({
                    q: "*",
                    facet_by:
                        "make,year,drivetrain,transmission,extColorGeneric,interiorColor,fuel,doors,engine,engineDisplacement",
                    max_facet_values: 50,
                    filter_by: filterBy,
                    exclude_fields: excludeFields,
                    per_page: 1
                });
                const makeRow = getFacets.facet_counts.find((row) => row.field_name == "make");
                const make = makeRow.counts;
                make.sort((a, b) => a.value.localeCompare(b.value));
                const YearRow = getFacets.facet_counts.find((row) => row.field_name == "year");
                const year = [YearRow.stats.min, YearRow.stats.max];
                const driveTypeRow = getFacets.facet_counts.find((row) => row.field_name == "drivetrain");
                const driveType = driveTypeRow.counts.map((item) => item.value);
                driveType.sort((a, b) => {
                    if (a.toLowerCase() === "other") return 1; // 'Other' comes after all other strings
                    if (b.toLowerCase() === "other") return -1; // 'Other' comes after all other strings
                    return a.localeCompare(b); // Sort the other strings alphabetically
                });
                const exColorRow = getFacets.facet_counts.find((row) => row.field_name == "extColorGeneric");
                const exColor = exColorRow.counts.map((item) => item.value);
                exColor.sort((a, b) => {
                    if (a.toLowerCase() === "other") return 1;
                    if (b.toLowerCase() === "other") return -1;
                    return a.localeCompare(b);
                });
                const inColorRow = getFacets.facet_counts.find((row) => row.field_name == "interiorColor");
                const inColor = inColorRow.counts.map((item) => item.value);
                //inColor.sort();
                inColor.sort((a, b) => {
                    if (a.toLowerCase() === "other") return 1;
                    if (b.toLowerCase() === "other") return -1;
                    return a.localeCompare(b);
                });
                const transmissionRow = getFacets.facet_counts.find((row) => row.field_name == "transmission");
                const transmission = transmissionRow.counts.map((item) => item.value);
                const enginenRow = getFacets.facet_counts.find((row) => row.field_name == "engineDisplacement");
                const engines = enginenRow.counts.map((item) => item.value);
                engines.sort();
                const fuelRow = getFacets.facet_counts.find((row) => row.field_name == "fuel");
                const fuelType = fuelRow.counts.map((item) => item.value);
                fuelType.sort((a, b) => {
                    if (a.toLowerCase() === "other") return 1;
                    if (b.toLowerCase() === "other") return -1;
                    return a.localeCompare(b);
                });
                const doorsRow = getFacets.facet_counts.find((row) => row.field_name == "doors");
                const doors = doorsRow.counts.map((item) => item.value);
                doors.sort();
                doors.reverse();
                const cylindersRow = getFacets.facet_counts.find((row) => row.field_name == "engine");
                const cylinders = cylindersRow.counts.map((item) => item.value);
                cylinders.sort();
                const result = {
                    make,
                    year,
                    driveType,
                    exColor,
                    inColor,
                    transmission,
                    engines,
                    fuelType,
                    doors,
                    cylinders,
                    price,
                    mileage
                };
                //   console.log(result);
                return result;
            } catch (ex) {
                console.log("Failed to get facets", ex);
                return null;
            }
        } else {
            console.log("return from getFacets due to no cars-documents found");
            return null;
        }
    } catch (ex) {
        console.log("Failed to get facets", ex);
        return null;
    }
}

async function GetModels(dealerId = 0) {
    try {
        const dealerIds = await getActiveDealerIds(dealerId);
        const filterBy = `${statusFilter}&&numberOfOffsitePhotos:>9&&dealerId:[${dealerIds}]`;
        const models = [];
        let maxCalls = 2;
        for (let i = 1; i < maxCalls + 1; i++) {
            const modelsData = await search
                .collections("vehicles")
                .documents()
                .search({
                    q: "*",
                    // Querying by the 'make' column
                    query_by: "model", // Query by the 'make' column
                    group_limit: 1,
                    exclude_fields: excludeFields,
                    filter_by: filterBy,
                    group_by: ["make,model"], // Group first by 'make' and then by 'model'
                    per_page: 200,
                    page: i
                });

            maxCalls = Math.ceil(modelsData.found / 200);
            models.push(...modelsData.grouped_hits);
        }

        //Convert typesense response to dropdown format
        const newArray = models.reduce((acc, curr) => {
            const foundObject = {
                label: `${curr.group_key[1]} (${curr.found})`, // Model name
                value: curr.group_key[1] // Count of the model
            };

            // Check if the 'Make' already exists in the accumulator
            const existingMake = acc.find((item) => item.label === curr.group_key[0]);

            if (existingMake) {
                existingMake.options.push(foundObject);
                existingMake.options.sort((a, b) => a.label.localeCompare(b.label));
            } else {
                acc.push({
                    label: curr.group_key[0], // Make name
                    options: [foundObject]
                });
            }

            return acc;
        }, []);
        return newArray;
    } catch (error) {
        // Handle any errors that might occur during the search
        console.error("Error fetching models:", error);
        return []; // Return an empty array or handle the error as needed
    }
}
async function getDistanceInfo(origin, destination) {
    try {
        const projectId = appConfig.GOOGLE_PROJECT_ID; // Replace with your Google Cloud project ID
        const region = "us-central1"; // Replace with the region where your function is deployed
        const functionName = "getShippingInfo"; // Replace with the name of your function
        const queryParams = new URLSearchParams({
            origin: origin?.toString(),
            destination: destination.toString()
        });

        const cloudFunctionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}?${queryParams}`;

        const response = await fetch(cloudFunctionUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

async function GetDeliveryEstimates(vin, zip = "") {
    let url = `${appConfig.API_URL}/v2/listings/${vin}/shipping-info`;
    if (zip) {
        url = url + `?destinationZipCode=${zip}`;
    }
    const response = await Api.Get(url);
    return response;
}

async function GetUserLocations(zip) {
    if (!zip) return;
    const stateCodeRegex = /([A-Z]{2})\s\d{5}/;

    async function processResults(results) {
        const filteredResults = results.filter((result) => {
            // Check if the result belongs to the USA or Canada
            const country = result.address_components.find((component) => component.types.includes("country"));

            return country && (country.short_name === "US" || country.short_name === "CA");
        });

        const resultsArray = filteredResults.map((result) => {
            let state = "";
            const match = result.formatted_address.match(stateCodeRegex);

            if (match) {
                state = match[1];
            }

            if (result.postcode_localities) {
                const combinedArray = result.postcode_localities.map((postcodeLocality) => ({
                    city: postcodeLocality,
                    zip,
                    state
                }));
                return combinedArray;
            }

            return [{ city: result.formatted_address.split(",")[0], zip, state }];
        });

        // Flatten the array of arrays to a single array
        const finalResultArray = resultsArray.flat();

        return finalResultArray;
    }

    if (!isNaN(zip)) {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${appConfig.MAPS_KEY}`
        );

        if (response.data && response.data?.results.length >= 1) {
            const finalResultArray = await processResults(response.data.results);
            return finalResultArray;
        }
        return;
    } else {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${appConfig.MAPS_KEY}`
            );

            if (response.data && response.data?.results.length >= 1) {
                const finalResultArray = await processResults(response.data.results);
                return finalResultArray;
            }
        } catch (error) {
            console.error("Error fetching data from Google Maps API:", error);
            return;
        }
    }
}

async function GetLikeVehicles(bodyType, price, dealerID, vin) {
    try {
        const minPrice = price - 5000;
        const maxPrice = price + 5000;
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const dealerIds = await getActiveDealerIds(dealerID);
        const response = await search
            .collections("vehicles")
            .documents()
            .search({
                q: "*",
                //sort_by,
                filter_by: `updatedAt: > ${twentyFourHoursAgo} && bodyType: == ${bodyType} && price:[${minPrice}..${maxPrice}] && vin: != ${vin} && price:> 9000 && numberOfOffsitePhotos:>9&&dealerId:[${dealerIds}]`,
                per_page: 25,
                page: 1
            });

        const pagination = {
            page: response.page,
            perPage: response.request_params.per_page,
            total: response.found,
            out_of: response.out_of,
            maxPage: Math.ceil(response.found / response.request_params.per_page)
        };
        return { pagination, items: response.hits };
    } catch (error) {
        throw error;
    }
}

export {
    GetAllCars,
    GetCarDetails,
    GetWindowStickerUrl,
    fetchAutoCheckData,
    SearchCars,
    GetAllFacets,
    GetModels,
    FilterListing,
    GetDeliveryEstimates,
    GetUserLocations,
    GetCarsByStockId,
    GetLikeVehicles,
    getDistanceInfo
};