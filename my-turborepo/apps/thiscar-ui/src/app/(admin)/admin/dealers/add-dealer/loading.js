import React from "react";
import LoadingSpinner from "../../../../../components/admin/common/loader/LoadingSpinner";
import "../../../../../contents/scss/spinner.scss";
const loading = () => {
    return (
        <div className="loading-spinner-center-align">
            <LoadingSpinner loaderForAdmin={1} />
        </div>
    );
};

export default loading;
