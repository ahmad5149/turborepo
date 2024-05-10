import "../../contents/scss/yourPerfectCar.scss";
import { PerfectCarPath } from "../common/defaultImage/DefaultPaths";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { SanityImage } from "@/sanity/SanityImage";
import Link from "next/link";
import { YourPerfectCarSVG } from "../../contents/svgs/home";

const YourPerfectCar = ({ perfectCar }) => {
    return (
        <div className="row justify-content-center my-lg-5 my-sm-0  py-3 perfect_cars">
            <div className="col-lg-6 pe-lg-5 mt-lg-5">
                <h2>{perfectCar.heading1}</h2>
                <h2>{perfectCar.heading2}</h2>
                <h2>{perfectCar.heading3}</h2>
                <hr />
                <p>{perfectCar.subtext}</p>
                <Link
                    href={"/cars"}
                    passHref>
                    <button className="btn custom_btn">
                        {perfectCar.buttonLabel}
                        <YourPerfectCarSVG />
                    </button>
                </Link>
            </div>
            <div className="col-lg-5 col-md-12">
                <SanityImage
                    src={perfectCar.image}
                    defaultImage={GetDefaultImagePath(PerfectCarPath)}
                    alt=""
                    width={520}
                    height={400}
                    className="image"></SanityImage>
            </div>
        </div>
    );
};

export default YourPerfectCar;
