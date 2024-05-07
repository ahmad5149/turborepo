import { TIV } from "@/services/tradeInValetService";

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const plate = searchParams.get("plate");
    const state = searchParams.get("state");

    let errors = {};
    if (!plate || plate.length < 3) {
        errors.plate = "Please enter a valid plate";
    }

    if (!state || state.length !== 2) {
        errors.state = "Please enter a valid State .e.g, TX";
    }

    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify(errors), { status: 422 });
    }

    const tiv = new TIV();

    const data = await tiv.decodeLicensePlate(plate, state);

    return new Response(JSON.stringify(data));
}
