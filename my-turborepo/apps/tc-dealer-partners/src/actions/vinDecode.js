"use server";

const baseURL = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/";

export async function DecodeVIN(prevState, formData) {
    const vins = formData.getAll("vin");

    const errorVins = [];
    const decodedVins = [];

    for (const v of vins) {
        if (v.length === 0) {
            continue;
        }
        if (v.length < 17) {
            errorVins.push({ error: "Invalid VIN", vin: v });
            continue;
        }
        const url = new URL(`${baseURL}${v}`);
        url.searchParams.set("format", "json");

        const res = await fetch(url.href).then(async (res) => await res.json());
        decodedVins.push({ vin: v, ...res.Results[0] });
    }

    return { decodedVins, errorVins };
}
