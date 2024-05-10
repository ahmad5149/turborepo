import React from "react";
import "../../contents/scss/nextStepAfter.scss";
import { NextStepAfterTile1SVG, NextStepAfterTile2SVG } from "../../contents/svgs/howItWorks";

const NextStepAfter = (props) => {
    return (
        <div className="next-step">
            <div className="row container-fluid m-0">
                <div className="col-lg-4 col-sm-12 left">
                    <div>
                        <h2>{props.nextSteps.Heading}</h2>
                    </div>
                </div>
                <div className="col-lg-8 col-sm-12 right">
                    <div className="bg_slider">
                        <h2>{props.nextSteps.tile1.tileHeading}</h2>
                        <p>{props.nextSteps.tile1.tileDescription}</p>
                        <div className="tablet-width">
                            <span className="mt-3 svg-class">
                                <NextStepAfterTile1SVG />
                            </span>
                        </div>
                    </div>
                    <div className="bg_slider-1">
                        <h2>{props.nextSteps.tile2.tileHeading}</h2>
                        <p>{props.nextSteps.tile2.tileDescription}</p>
                        <div className="tablet-width">
                            <span className="mt-3 svg-class">
                                <NextStepAfterTile2SVG />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NextStepAfter;
