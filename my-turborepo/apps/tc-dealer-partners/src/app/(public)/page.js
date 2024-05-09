import { cookies } from "next/headers";
import { appConfig } from "../../appConfig";
import "../../contents/scss/home.scss";
import Signin from "@/components/signin/Signin";
import { auth } from "@/services/firebase-admin";

export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export async function CheckAuth() {
    "use server";
    const myToken = cookies().get("_uToken");
    const dealer = cookies().get("_dealer");
    if (myToken) {
        try {
            const user = await auth.verifyIdToken(myToken.value, true);

            return { ...user, dealer: dealer?.value };
        } catch (error) {
            return false;
        }
    }
}

export default async function Home() {
    return (
        <div className="text-center">
            <Signin />
        </div>
    );
}
