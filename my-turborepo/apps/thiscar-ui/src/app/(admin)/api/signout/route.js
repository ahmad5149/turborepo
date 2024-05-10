"use server";
import { auth } from "firebase-admin";
import { customInitApp } from "../../../lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request, response) {
    const session = request.cookies.get("session");
    //Generate session cookie
    const expiresIn = -1;

    const options = {
        name: "session",
        value: session.value,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true
    };

    //Add the cookie to the browser
    cookies().set(options);

    return NextResponse.json({}, { status: 200 });
}
