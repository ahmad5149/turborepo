"use client";
import "../../contents/scss/freePersonalShopper.scss";
import { GetDefaultImagePath } from "../common/defaultImage/DefaultImage";
import { ImgLeft3Path, ImgRight1Path, ImgRight2Path } from "../common/defaultImage/DefaultPaths";
import { SanityImage } from "@/sanity/SanityImage";
import { useEffect, useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import { FreePersonalShopperSVG } from "../../contents/svgs/home";

const FreePersonalShopper = ({ personalShopper }) => {
    const { openQoreAI, loadQoreAI, setQoreAIActivated } = useContext(AppContext);

    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);

    return (
        <div className="container-fluid py-5 px-0 fPS">
            <div className="row justify-centent-center g-0 overflow-hidden justify-content-center">
                <div className="col-lg-4 d_none">
                    <div className="row left-row">
                        <div className="col-4">
                            <SanityImage
                                src={personalShopper.image1}
                                defaultImage={GetDefaultImagePath(ImgRight2Path)}
                                alt=""
                                width={140}
                                height={140}
                                className="image"></SanityImage>
                        </div>
                        <div className="col-4">
                            <SanityImage
                                src={personalShopper.image2}
                                defaultImage={GetDefaultImagePath(ImgLeft3Path)}
                                alt=""
                                width={140}
                                height={140}
                                className="image"></SanityImage>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 px-3 d-flex flex-column justify-content-center mb-5 mb-sm-0 tab-veiw">
                    <div className="mob-veiw">
                        <h2>{personalShopper?.freePersonalShopper?.heading}</h2>
                        <p>{personalShopper?.freePersonalShopper?.description}</p>
                        <button
                            onClick={openQoreAI}
                            className="btn custom_btn"
                            id="myButton">
                            {personalShopper?.freePersonalShopper?.buttonText}

                            <FreePersonalShopperSVG />
                        </button>
                    </div>
                </div>
                <div className="col-lg-4 mobile_dis-none">
                    <div className="row right-row">
                        <div className="col-4">
                            <SanityImage
                                src={personalShopper.image3}
                                defaultImage={GetDefaultImagePath(ImgRight1Path)}
                                alt=""
                                width={140}
                                height={140}
                                className="image"></SanityImage>
                        </div>
                        <div className="col-4">
                            <SanityImage
                                src={personalShopper.image4}
                                defaultImage={GetDefaultImagePath(ImgRight2Path)}
                                alt=""
                                width={140}
                                height={140}
                                className="image"></SanityImage>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreePersonalShopper;
