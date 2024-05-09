import * as Api from "../utils/HttpVerbs";
import { appConfig } from "../appConfig";

async function submitContactQuestion(submitData) {
    const response = await Api.PostASync(`${appConfig.API_URL}/Listings/submit-hero-lead`, submitData);
    //console.log("response-ss", response);
    const res = response.json();
    return res;
}
export { submitContactQuestion };
