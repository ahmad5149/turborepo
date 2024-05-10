"use client";
export const Toolbar = ({ pageName, addNew }) => {
    return (
        <>
            {/*begin::Toolbar*/}
            <div
                className="toolbar"
                id="kt_toolbar">
                <div className="container-fluid d-flex flex-stack flex-wrap flex-sm-nowrap">
                    {/*begin::Info*/}
                    <div className="d-flex flex-column align-items-start justify-content-center flex-wrap me-2">
                        {/*begin::Title*/}
                        <h1 className="text-dark fw-bold my-1 fs-2">
                            {pageName}
                            <small className="text-muted fs-6 fw-normal ms-1"></small>
                        </h1>
                        {/*end::Title*/}
                        {/*begin::Breadcrumb*/}
                        <ul className="breadcrumb fw-semibold fs-base my-1">
                            <li className="breadcrumb-item text-muted">
                                <a
                                    href="/index.html"
                                    className="text-muted text-hover-primary">
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item text-muted">{pageName}</li>
                        </ul>
                        {/*end::Breadcrumb*/}
                    </div>
                    {/*end::Info*/}
                    {/*begin::Actions*/}
                </div>
            </div>
            {/*end::Toolbar*/}
        </>
    );
};
