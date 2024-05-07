import { TIV } from "@/services/tradeInValetService";

export async function POST(request) {
    const tiv = new TIV();
    const payload = await request.json();

    if (payload.customerCondition) {
        payload.conditionType = payload.customerCondition;
        delete payload.customerCondition;
    }

    if (payload.customerFirstOwner === true) {
        payload.conditionOwners = "Single Owner";
    } else {
        payload.conditionOwners = "Multi-Owner";
    }
    delete payload.customerFirstOwner;

    payload.options = [];

    try {
        const response = await tiv.bidRequest(payload);
        return new Response(JSON.stringify(response));
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 422 });
    }
}
