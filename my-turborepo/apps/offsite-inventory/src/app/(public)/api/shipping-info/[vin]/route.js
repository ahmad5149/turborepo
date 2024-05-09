import { appConfig } from "@/appConfig";
import { NextRequest } from "next/server";

export async function GET(request, { params }) {
    const searchParams = request.nextUrl.searchParams;
    const zip = searchParams.get("zipcode");

    const vin = params.vin;
    console.log("find da shipping");
    let url = `${appConfig.API_URL}/v2/listings/${vin}/shipping-info`;
    if (zip) {
        url = url + `?destinationZipCode=${zip}`;
    }
    const response = await fetch(url);
    const newData = await response.json();
    return Response.json(newData);
}
