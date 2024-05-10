import { GetTabName } from "@/utils/WebPageUtil";

export const metadata = {
    title: GetTabName("Personal Shopper"),
    description: "Personal shopper page"
};

const PersonalShopper = async () => {

    return (
        <>
            <div className="text-center">
                <h4 style={{ color: "grey" }}>Personal Shopper</h4>
                <img src="under-construction.png" />
            </div>
        </>
    );
};

export default PersonalShopper;
