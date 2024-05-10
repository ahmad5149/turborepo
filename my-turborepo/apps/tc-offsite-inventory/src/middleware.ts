import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
    matcher: [
        // match all paths except for api routes /_next and /_static
    ]
};

export default async function middleware(req) {
    const url = req.nextUrl;

    // get hostname of request
    const hostname = req.headers.get("host").replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

    const searchParams = req.nextUrl.searchParams.toString();
    // get pathname of the request (.e.g, /, /cars)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // rewrite root application to `/home` folder
    // if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    //     return NextResponse.rewrite(new URL(`${path === "/" ? "" : path}`, req.url));
    // }

    // rewrite everything now on the naked domain to dealers folder
    //return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));

    const response = NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));

    const dealerSubDomain = url.pathname.split("/")[1];
    // const dealerSubDomain = hostname.substring(1, hostname.indexOf("/"));

    response.cookies.set("offsiteDomain", dealerSubDomain, { secure: false });
    return response;
}
