import { GetDealerData } from "@/utils/helpers/dealerHelper";
import { CheckAuth } from "../../page";
import InspectionForm from "./inspection-form";
import { redirect } from "next/navigation";

export default async function WholesaleInspectionRequest() {
    const user = await CheckAuth();

    if (!user) {
        redirect("/");
    }

    const dealer = await GetDealerData(user.dealer);

    return (
        <div className="card m-4">
            <div className="card-body">
                <h3 className="card-title">Inspection Request</h3>
                <InspectionForm dealer={dealer} />
            </div>
        </div>
    );
}
