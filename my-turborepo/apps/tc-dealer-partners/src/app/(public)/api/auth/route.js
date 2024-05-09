import { cookies } from "next/headers";

export async function POST(request) {
    const { token, dealerURI } = await request.json();
    if (dealerURI) {
        cookies().set("_dealer", dealerURI, { maxAge: 60 * 60 * 24 * 14, secure: true, httpOnly: true });
    }

    if (token) {
        cookies().set("_uToken", token, { maxAge: 60 * 60 * 24 * 14, secure: true, httpOnly: true });
    }

    return Response.json({});
}

export async function DELETE() {
    cookies().delete("_uToken");
    cookies().delete("_dealer");
    return Response.json({});
}
