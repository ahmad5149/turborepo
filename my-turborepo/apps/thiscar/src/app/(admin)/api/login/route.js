"use server";
import { auth } from "firebase-admin";
import { customInitApp } from "../../../lib/firebase-admin-config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request, response) {
    const authorization = headers().get("Authorization");

    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];

        const decodedToken = await auth()
            .verifyIdToken(idToken)
            .then((res) => {
                return res;

                //return res
            })
            .catch((error) => {
                console.log("verify-err", error.message);
                return NextResponse.json({ message: error.message }, { status: 204 });
            });

        if (decodedToken) {
            //Generate session cookie
            const expiresIn = 60 * 60 * 24 * 2 * 1000;
            const sessionCookie = await auth().createSessionCookie(idToken, {
                expiresIn
            });
            const options = {
                name: "session",
                value: sessionCookie,
                maxAge: expiresIn,
                httpOnly: true,
                secure: true
            };

            //Add the cookie to the browser
            cookies().set(options);
        }
    }

    return NextResponse.json({}, { status: 200 });
}

export async function GET(request) {
    const session = cookies().get("session")?.value || "";

    //Validate if the cookie exist in the request
    if (!session) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    //Use Firebase Admin to validate the session cookie
    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (!decodedClaims) {
        return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    return NextResponse.json({ isLogged: true }, { status: 200 });
}
