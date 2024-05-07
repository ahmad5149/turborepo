import React from "react";
import { CarsNotFoundSVG } from "../../../contents/svgs/carDetails";

function CarsNotFound(props) {
    return (
        <div className="car-not-found">
            <CarsNotFoundSVG />
            <p>{props.ErrorMessage}</p>
        </div>
    );
}

export default CarsNotFound;
