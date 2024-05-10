import React from "react";
import ReactSwitch from "react-switch";

function ToggleSwitch({ state, handleChange, label }) {
    return (
        <div className="d-flex toggle align-items-center">
            <p className="mb-0 me-1">{label}</p>
            <ReactSwitch
                className="me-1"
                checked={state}
                onChange={handleChange}
                height={15}
                width={30}
                handleDiameter={15}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            />
        </div>
    );
}

export default ToggleSwitch;
