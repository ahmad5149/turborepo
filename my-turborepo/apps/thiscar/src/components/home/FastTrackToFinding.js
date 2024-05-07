import "../../contents/scss/fastTrackToFinding.scss";
import { FastTrackPath } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import Link from "next/link";
import { FastTrackToFindingSVG } from "../../contents/svgs/home";

const FastTrackToFinding = ({ fastTrackToFinding }) => {
    return (
        <div className="row justify-content-center my-lg-5 my-sm-0 py-3 fast_track">
            <div className="col-lg-5 col-md-12">
                <SanityImage
                    src={fastTrackToFinding.image}
                    defaultImage={GetDefaultImagePath(FastTrackPath)}
                    alt=""
                    width={520}
                    height={430}
                    className="image"></SanityImage>
            </div>
            <div className="col-lg-6 ps-lg-5 mt-lg-5">
                <h2>A fast track to finding what gets your heart revving.</h2>
                <hr className="mt-4" />
                <div className="row points">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        {fastTrackToFinding.line1 && <ul><li>{fastTrackToFinding.line1}</li></ul>}
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        {fastTrackToFinding.line2 && <ul><li>{fastTrackToFinding.line2}</li></ul>}
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                    {fastTrackToFinding.line3 && <ul><li>{fastTrackToFinding.line3}</li></ul>}
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                    {fastTrackToFinding.line4 && <ul><li>{fastTrackToFinding.line4}</li></ul>}
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                    {fastTrackToFinding.line5 &&<ul><li>{fastTrackToFinding.line5}</li></ul>}
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                    {fastTrackToFinding.line6 && <ul><li>{fastTrackToFinding.line6}</li></ul>}
                    </div>
                </div>
                {/* <div className="row mt-4 points">
                    <div className="col-lg-6">
                        <ul className="mb-0 ">
                            {fastTrackToFinding.line1 && <li className="mt-1">{fastTrackToFinding.line1}</li>}
                            {fastTrackToFinding.line2 && <li className="mt-1">{fastTrackToFinding.line2}</li>}
                            {fastTrackToFinding.line3 && <li className="mt-1">{fastTrackToFinding.line3}</li>}
                        </ul>
                    </div>
                    <div className="col-lg-6">
                        <ul className="mb-0">
                            {fastTrackToFinding.line4 && <li className="mt-1">{fastTrackToFinding.line4}</li>}
                            {fastTrackToFinding.line5 && <li className="mt-1">{fastTrackToFinding.line5}</li>}
                            {fastTrackToFinding.line6 && <li className="mt-1">{fastTrackToFinding.line6}</li>}
                        </ul>
                    </div>
                </div> */}
                <Link
                    href={"/how-it-works"}
                    passHref>
                    <button className="btn custom_btn mt-3">
                        {fastTrackToFinding.buttonLabel}

                        <FastTrackToFindingSVG />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default FastTrackToFinding;
