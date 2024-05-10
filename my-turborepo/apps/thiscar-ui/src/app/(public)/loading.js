import React from "react";
import LoadingSpinner from "../../components/common/loader/LoadingSpinner";
import "../../contents/scss/spinner.scss";

const loading = () => {
    return (
        <div className="loading-spinner-center-align">
            <LoadingSpinner />
        </div>
    );
};

export default loading;
