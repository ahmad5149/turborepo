import { GetTabName } from "@/utils/WebPageUtil";

/**
 * Generate Metadata and OG Tags
 * @param {{vehicle: {vin: string; images: string[]; year: number; make: string; model: string; price: number;exColor:string;inColor: string;bodyStyle:string;}}}
 * @returns {{
 * image: string|undefined;
 * url: string|undefined;
 * title: string;
 * description: string;
 * keywords: string[];
 * openGraph: Record<string, string|undefined>
 * }}
 */
export const seoAttributes = ({ vehicle, metaData = null }) => ({
    image: vehicle?.images?.length ? vehicle.images[0] : undefined,
    url: vehicle?.vin ? `https://thiscar.com/cars/${vehicle?.vin}` : undefined,
    title:
        metaData != null
            ? GetTabName(metaData.title)
            : `Buy ${vehicle?.year} ${vehicle?.make} ${vehicle?.model} | THIScar.com`,
    description:
        metaData != null
            ? metaData.description
            : `${vehicle?.year?.toString()} ${vehicle?.make} ${
                  vehicle?.model
              } for sale for $${vehicle?.price?.toLocaleString()} and can be shipped to your home on THIScar.com`,
    keywords: [
        vehicle?.make,
        vehicle?.model,
        vehicle?.year?.toString(),
        "THIScar",
        "Texas",
        "77375",
        vehicle?.exColor,
        vehicle?.inColor,
        "Used Car",
        "Used Vehicle",
        vehicle?.bodyStyle,
        vehicle?.description
    ],
    openGraph: {
        siteName: "THIScar.com",
        title: `${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`,
        description: `${vehicle?.year?.toString()} ${vehicle?.make} ${
            vehicle?.model
        } for sale for $${vehicle?.price?.toLocaleString()} and can be shipped to your home on THIScar.com`,
        images: vehicle.images?.length ? [vehicle.images[0]] : undefined,
        locale: "en_US",
        type: "website",
        url: `https://thiscar.com/cars/${vehicle.vin}`
    }
});

/**
 * Generate JSON+LD
 * @param {{vehicle: {vin: string; images: string[]; year: number; make: string; model: string; price: number;exColor:string;inColor: string;bodyStyle:string;driveType:string,mileage:number;transmission:string;}}}
 * @returns {Record<string,string>}
 */
export function jsonLD({ vehicle }) {
    if (vehicle === null || vehicle === undefined) {
        return {}; // Return an empty object when null or undefined
    }
    return {
        "@context": "https://schema.org",
        "@type": "Car",
        name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
        brand: { name: `${vehicle.make}` },
        model: {
            "@type": "ProductModel",
            name: `${vehicle.model}`
        },
        fuelType: vehicle.fuelType,
        bodyType: vehicle.bodyStyle,
        vehicleInteriorColor: vehicle.inColor,
        driveWheelConfiguration: vehicle.driveType,
        color: vehicle.exColor,
        mileageFromOdometer: `${vehicle.mileage}`,
        vehicleTransmission: `${vehicle.transmission}`,
        offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: vehicle?.price?.toString() || "Call for Price",
            offeredBy: {
                "@type": "AutoDealer",
                name: "THIScar",
                image: vehicle?.images?.length ? vehicle.images[0] : undefined
            },
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: vehicle.price.toString() || "Call for Price",
                priceCurrency: "USD"
            }
        }
    };
}
