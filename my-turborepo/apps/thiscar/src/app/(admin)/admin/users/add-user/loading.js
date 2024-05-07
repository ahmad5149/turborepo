import React from "react";
import LoadingSpinner from "../../../../../components/common/loader/LoadingSpinner";
import "../../../../../contents/scss/spinner.scss";

const loading = () => {
    return (
        <div className="loading-spinner-center-align admin-loading">
            <LoadingSpinner />
        </div>
    );
};

export default loading;