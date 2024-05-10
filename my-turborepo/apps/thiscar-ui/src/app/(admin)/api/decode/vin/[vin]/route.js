import { TIV } from "@/services/tradeInValetService";

export async function GET(request, { params }) {
    const { vin } = params;

    if (!vin || vin.length !== 17) {
        return new Response(JSON.stringify({ error: "Please enter a valid VIN" }), { status: 422 });
    }

    const tiv = new TIV();
    const data = await tiv.decodeVIN(vin);

    return new Response(JSON.stringify(data));
}
