import "../../contents/scss/atTheHeart.scss";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { Car1Path } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";
import Link from "next/link";
import { AtTheHeartSVG } from "../../contents/svgs/about";

// import bannerBg from '../../../public/media/banner-bg.png';

function AtTheHeart({ atTheHeart }) {
    return (
        <div className="min_hght_banner">
            <div className="container-fluid">
                <div className="row bg-color">
                    <div className="col-xl-5 col-lg-6 col-md-7 col-sm-12 offset-xl-1 my-5 my-md-0">
                        <div className="left_banner">
                            <div className="px-sm-0">
                                <h2>{atTheHeart.heading}</h2>
                                <p>{atTheHeart.subText}</p>
                                <Link
                                    href={`/cars`}
                                    className="link">
                                    <button className="btn btn-sm custom_btn">
                                        Get Started
                                        <AtTheHeartSVG />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-5 px-0">
                        <div className="bg_img">
                            {/* Image component used for Server side rendering in NextJS : gets width and height as props*/}
                            <SanityImage
                                src={atTheHeart.image}
                                defaultImage={GetDefaultImagePath(Car1Path)}
                                alt=""
                                className="first"
                                // layout='fill'
                                // objectFit='cover'
                                width={1000}
                                height={800}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AtTheHeart;
