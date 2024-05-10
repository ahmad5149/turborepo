import { appConfig } from "../../appConfig";
import "../../contents/scss/home.scss";
import Signin from "@/components/signin/Signin";
export const revalidate = appConfig.SANITY_REVALIDATION_TIME;

export default async function Home() {
    return <div className="text-center">{<Signin />}</div>;
}
