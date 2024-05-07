import "../../contents/scss/moreCarsMoreChoices.scss";
import { MoreCarsPath } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import Link from "next/link";
import { MoreCarsMoreChoicesSVG } from "../../contents/svgs/home";

const MoreCarsMoreChoices = ({ moreCarsMoreChoices }) => {
    return (
        <div className="row justify-content-center my-lg-5 py-3 more_cars">
            <div className="col-lg-6 pe-lg-5 mt-lg-5">
                <h2>{moreCarsMoreChoices.heading1}</h2>
                <h2>{moreCarsMoreChoices.heading2}</h2>
                <h2>{moreCarsMoreChoices.heading3}</h2>
                <hr className="mt-4" />
                <p className="mt-4">{moreCarsMoreChoices.subtext}</p>
                <Link
                    href={"/cars"}
                    passHref>
                    <button className="btn custom_btn mobile_display">
                        {moreCarsMoreChoices.buttonLabel}
                        <MoreCarsMoreChoicesSVG />
                    </button>
                </Link>
            </div>
            <div className="col-lg-5 col-md-12">
                <SanityImage
                    src={moreCarsMoreChoices.image}
                    defaultImage={GetDefaultImagePath(MoreCarsPath)}
                    alt=""
                    className="image"
                    width={530}
                    height={440}
                />
            </div>
        </div>
    );
};

export default MoreCarsMoreChoices;
