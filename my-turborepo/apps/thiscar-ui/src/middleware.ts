import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
    const session = request.cookies.get("session");

    //Return to /login if don't have a session
    if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    //Call the authentication endpoint
    const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
        method: "GET",
        headers: {
            Cookie: `session=${session?.value}`
        }
    });
    
    //Return to /login if token is not authorized
    if (responseAPI.status !== 200) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

//Add your protected routes
export const config = {
    matcher: [
        "/admin",
        "/admin/dealers",
        "/admin/users",
        "/admin/inventory",
        "/admin/inventory/:path*",
        "/admin/dealers/add-dealer",
        "/admin/notifications",
        "/admin/users/add-user",
        "/admin/thiscar-notifications",
        "/admin/notifications-queue",
        "/admin/offsite-notifications"
    ]
};
