import "../../contents/scss/getAGuranteedOffer.scss";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { MobPath } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";
import Link from "next/link";
import { HowItWorksArrowSVG } from "../../contents/svgs/howItWorks";

function GetAGuaranteedOffer(props) {
    return (
        <div className="bg-light-grey">
            <div className="row container-fluid m-0">
                <div className="col-lg-4 col-sm-12 left">
                    <div className="image-container">
                        <SanityImage
                            src={props.offer.getAGuranteedOfferImg}
                            className="get-gurranteed-offer"
                            defaultImage={GetDefaultImagePath(MobPath)}
                            alt=""
                            width={360}
                            height={330}
                        />
                    </div>
                </div>
                <div className="col-lg-8 col-sm-12 right">
                    <h2>
                        {props.offer.gettingAGuranteedOffer} <br /> {props.offer.offer}
                    </h2>
                    <div className="border_bottom"></div>
                    <p>{props.offer.bestOfferText}</p>
                    <p>{props.offer.noMoreDrivingAround}</p>
                    <Link
                        href={"/sell-trade"}
                        passHref>
                        <button className="btn btn-sm custom_btn float-start">
                            {props.offer.getCashOffer}
                            <HowItWorksArrowSVG />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GetAGuaranteedOffer;
