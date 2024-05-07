"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import Link from "next/link";
import { deleteDealer, fetchDealersListing } from "../../../services/dealerService";
import "../../../contents/admin/scss/dealers.scss";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import "../../../../src/contents/admin/scss/mobileListings.scss";

function Dealers({ dealersListing, totalDealers }) {
    const searchParams = useSearchParams();

    const [dealersData, setDealersData] = useState(dealersListing?.data ?? []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // states for server side pagination
    const params = new URLSearchParams(searchParams);

    const [lastPage, setLastPage] = useState(false);
    const [searchQuery, setSearchQuery] = useState(params.get("q") ? params.get("q") : "");
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState(params.get("sortBy") ? params.get("sortBy") : "name");
    const [sortOrder, setSortOrder] = useState(params.get("sortOrder") ? params.get("sortOrder") : "asc");
    const [activeFilter, setActiveFilter] = useState(params.get("active") ? params.get("active") : -1);
    const [query, setQuery] = useState("*");
    const [totalRecords, setTotalRecords] = useState(totalDealers);

    const pathname = usePathname();

    const routerNav = useRouter();
    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };

    function renderStatusDot(isActive, isDeleted) {
        var status = "";
        if (isActive && !isDeleted) {
            status = "active";
        } else if (!isActive && !isDeleted) {
            status = "inactive";
        } else if (isDeleted) {
            status = "deleted";
        }
        const colors = {
            active: "green",
            inactive: "red",
            deleted: "red"
        };

        if (colors.hasOwnProperty(status)) {
            const color = colors[status];

            return (
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        marginRight: "5px",
                        marginTop: "4px"
                    }}></div>
            );
        }

        return null; // Return null for unknown status
    }

    async function startAgain() {
        setDealersData([]);
        setCurrentPage(1);
        setLoading(true);
        setLastPage(false);
    }
    async function getSearchParams() {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        const active = params.get("active") || activeFilter;
        const sortByCol = params.get("sortBy") || sortBy;
        const sortOrderCol = params.get("sortOrder") || sortOrder;
        return { q, active, sortByCol, sortOrderCol };
    }
    const handleSearch = async (q) => {
        setQuery(q);
        setSortBy("name");
        await startAgain();
        const paramState = await getSearchParams();
        setTimeout(() => {
            fetchData(limit, q, activeFilter, "name", paramState.sortOrderCol);
        }, 1000);

        const params = new URLSearchParams(searchParams);
        if (q) {
            params.set("q", q);
            params.set("sortBy", "name");
        } else {
            params.delete("q");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const handleActiveFilter = async (active) => {
        setActiveFilter(active);
        await startAgain();
        const stateParams = await getSearchParams();

        fetchData(limit, stateParams.q, active, stateParams.sortByCol, stateParams.sortOrderCol, 1);

        const params = new URLSearchParams(searchParams);
        if (active > -1) {
            params.set("active", active);
        } else {
            params.delete("active");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const sortColumn = async (sortByCol) => {
        let sortOrd = sortOrder;
        // console.log(loading);
        if (sortBy == sortByCol) {
            if (sortOrder == "asc") {
                setSortOrder("desc");
                sortOrd = "desc";
            } else {
                setSortOrder("asc");
                sortOrd = "asc";
            }
        } else {
            setSortBy(sortByCol);
            setSortOrder("asc");
            sortOrd = "asc";
        }

        await startAgain();
        const stateParams = await getSearchParams();
        setTimeout(() => {
            fetchData(limit, stateParams.q, activeFilter, sortByCol, sortOrd, 1);
        }, 1000);

        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sortByCol);
        params.set("sortOrder", sortOrd);
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const handleDelete = (uuid, index) => {
        Swal.fire({
            title: "Are you sure you want to delete dealer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.value) {
                deleteDealer(uuid)
                    .then((res) => {
                        const newData = [...dealersData.slice(0, index), ...dealersData.slice(index + 1)];
                        if(totalRecords > 0)
                        {
                          setTotalRecords(totalRecords - 1);
                        }
                        setDealersData(newData);
                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Failed to delete user!".error.message);
                    });
                //console.log(result.value, refId);
                //this.props.submitUser(this.state);
            }
        });
    };

    async function fetchData(limit, q, active, sortBy, sortOrder, page = currentPage) {
        fetchDealersListing(limit, page, q, active, sortBy, sortOrder)
            .then((dealers) => {
                if (dealers?.data?.length > 0) {
                    setDealersData(dealers.data);
                    setTotalRecords(dealers?.found ?? 0);
                    setLoading(false);
                } else {
                    setDealersData([]);
                    setTotalRecords(0);
                    setLoading(false);
                }
            })
            .catch((error) => {
                // Handle the error if needed
                console.error("Error in main code:", error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleInfiniteScroll = async () => {
        const params = new URLSearchParams(searchParams);

        let q = params.get("q") || "*";
        const sortby = sortBy ? sortBy : params.get("sortBy");
        let sortingOrder = sortOrder ? sortOrder : params.get("sortOrder");

        q = q ?? "";

        const { scrollTop, clientHeight, scrollHeight } = document?.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
            try {
                if (!lastPage) {
                    setLoading(true);

                    const res = await fetchDealersListing(10, currentPage + 1, q, activeFilter, sortby, sortingOrder);

                    const dealers = res?.data;

                    if (dealers?.length > 0) {
                        setCurrentPage(res?.page);
                        setDealersData((prevData) => {
                            const uniqueDealers = dealers.filter(
                                (newDealers) => !prevData.some((existingDealer) => existingDealer.id === newDealers.id)
                            );

                            if ([...prevData, ...uniqueDealers].length === res?.found) {
                                setLastPage(true);
                            } else {
                                setLastPage(false);
                            }

                            return [...prevData, ...uniqueDealers];
                        });
                    } else {
                        setLastPage(true);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error in searchDealers:", error.message);
            }
        }
    };

    const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 500);

    useEffect(() => {
        const handleScroll = () => {
            debouncedHandleInfiniteScroll();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);

    function sortingClasses(column, order) {
        let sort = "";
        if (sortBy == column) {
            sort = "sorting";
            if (order == "asc") {
                sort += " sorting_asc";
            } else if (order == "desc") {
                sort += " sorting_desc";
            }
        }

        return sort;
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(searchQuery);
        }
    };

    return (
        <>
            <Toolbar
                pageName="Dealers"
                addNew={{ path1: "dealers", path2: "add" }}
            />

            {/*begin::Post*/}
            <div
                className="post fs-6 d-flex flex-column-fluid"
                id="kt_post">
                {/*begin::Container*/}
                <div className="container-xxl">
                    <div className="text-start mb-2 dealers-found-label">{totalRecords} dealers found</div>
                    {/*begin::Products*/}
                    <div className="card card-flush">
                        {/*begin::Card header*/}
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            {/*begin::Card title*/}
                            <div className="card-title">
                                {/*begin::Search*/}
                                <div className="d-flex align-items-center position-relative my-1">
                                    <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                    <input
                                        type="text"
                                        data-kt-ecommerce-product-filter="search"
                                        className="form-control form-control-solid w-250px ps-12"
                                        placeholder="Filter by dealer name"
                                        onChange={(e) => {
                                            setSearchQuery(e.currentTarget.value);
                                        }}
                                        onKeyDown={handleKeyPress}
                                        value={searchQuery}
                                    />
                                    <div className="position-relative buttonContainer-search right-custom">
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                handleSearch("");
                                            }}
                                            disabled={!!!searchQuery}
                                            type="button"
                                            className="btn-close closeButton-search"></button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            !loading && handleSearch(searchQuery);
                                        }}
                                        className="btn btn-primary">
                                        Search
                                    </button>
                                </div>
                                {/*end::Search*/}
                            </div>
                            {/*end::Card title*/}
                            {/*begin::Card toolbar*/}
                            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                <div className="w-100 mw-150px">
                                    {/*begin::Select2*/}
                                    <select
                                        className="form-select form-select-solid"
                                        data-control="select2"
                                        data-hide-search="true"
                                        data-placeholder="Filter"
                                        onChange={(e) => {
                                            handleActiveFilter(e.target.value);
                                        }}
                                        defaultValue={searchParams.get("active")?.toString()}
                                        data-kt-ecommerce-product-filter="status">
                                        <option
                                            value="-1"
                                            disabled={true}>
                                            Filter
                                        </option>
                                        <option value="-1">All</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                        <option value="2">Deleted</option>
                                    </select>
                                    {/*end::Select2*/}
                                </div>
                                {/*begin::Add product*/}
                                <Link
                                    className="btn btn-primary"
                                    onClick={handleLink}
                                    href="/admin/dealers/add-dealer"
                                    passHref>
                                    Add Dealer
                                </Link>
                                {/*end::Add product*/}
                            </div>
                            {/*end::Card toolbar*/}
                        </div>
                        {/*end::Card header*/}
                        {/*begin::Card body*/}
                        <div className="card-body pt-0">
                            {/*begin::Table*/}

                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer">
                                <div className="table-responsive">
                                    <table
                                        className="table dataTable align-middle table-row-dashed fs-6 gy-0"
                                        id="kt_ecommerce_products_table">
                                        <thead>
                                            <tr className="text-start text-black-400 fw-bold fs-7  gs-0">
                                                {/* <th>UUID</th> */}
                                                <th
                                                    className={`cursor-pointer text-start w-150px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("name", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("name")}>
                                                    Dealer name
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("chromeDealerId", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("chromeDealerId")}>
                                                    Chrome ID
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("isActive", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("isActive")}>
                                                    Status
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("website", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("website")}>
                                                    Website
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("city", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("city")}>
                                                    City
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("state", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("state")}>
                                                    State
                                                </th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("dealerZipCode", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("dealerZipCode")}>
                                                    Zip
                                                </th>

                                                <th className="text-start w-70px">Inv. Count</th>
                                                <th
                                                    className={`text-start w-70px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingClasses("phone", sortOrder)}`}
                                                    onClick={() => !loading && sortColumn("phone")}>
                                                    Phone
                                                </th>

                                                <th className={`text-start w-70px`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fw-semibold text-gray-600">
                                            {!dealersData && <p className="text-center">No record found...</p>}
                                            {dealersData &&
                                                dealersData.map((dealer, index) => (
                                                    <tr key={index}>
                                                        <td className="text-start pe-0">{dealer.name}</td>
                                                        <td className="text-start pe-0">{dealer.chromeDealerId}</td>

                                                        <td
                                                            className="text-start pe-0 d-flex mt-4"
                                                            data-order="active">
                                                            {renderStatusDot(dealer.isActive, dealer.isDeleted)}

                                                            {activeFilter == "1" && dealer.isActive && (
                                                                <div>Active</div>
                                                            )}
                                                            {activeFilter == "0" && !dealer.isActive && (
                                                                <div>Inactive</div>
                                                            )}
                                                            {activeFilter == "2" && dealer.isDeleted && (
                                                                <div>Deleted</div>
                                                            )}

                                                            {activeFilter == "-1" && dealer.isActive && (
                                                                <div>Active</div>
                                                            )}
                                                            {activeFilter == "-1" && !dealer.isActive && (
                                                                <div>Inactive</div>
                                                            )}
                                                            {activeFilter == "-1" && dealer.isDeleted && (
                                                                <div>Deleted</div>
                                                            )}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <a href={dealer.website}>{dealer.website}</a>
                                                        </td>
                                                        <td className="text-start pe-0">{dealer.city}</td>
                                                        <td className="text-start pe-0">{dealer.state}</td>
                                                        <td className="text-start pe-0">{dealer.dealerZipCode}</td>

                                                        <td className="text-center pe-0">
                                                            <Link
                                                                href={`/admin/inventory?q=${dealer.chromeDealerId}&&name=${dealer.name}`}
                                                                passHref>
                                                                {dealer.invCount ?? 0}
                                                            </Link>
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <span className="">{dealer.phone}</span>
                                                        </td>

                                                        <td className="text-center  pe-0">
                                                            {/*begin::Actions*/}

                                                            <div className="d-flex align-items-stretch flex-shrink-0">
                                                                <Link
                                                                    onClick={handleLink}
                                                                    href={`/admin/dealers/add-dealer?id=${
                                                                        dealer.uuid
                                                                    }&key=${Math.random()
                                                                        .toString(36)
                                                                        .substring(2, 7)}`}
                                                                    passHref>
                                                                    <div className="btn btn-icon btn-active-light-primary fs-6">
                                                                        <span className="active">
                                                                            <i className="ki-duotone ki-pencil fs-2">
                                                                                <span className="path1"></span>
                                                                                <span className="path2"></span>
                                                                            </i>
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                                <div className="btn btn-icon btn-active-light-primary fs-6">
                                                                    <span
                                                                        onClick={() => handleDelete(dealer.uuid, index)}
                                                                        className="active">
                                                                        <i className="ki-duotone ki-basket fs-2x">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/*end::Actions*/}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                {loading && (
                                    <div className="admin-loading">
                                        <LoadingSpinner />
                                    </div>
                                )}
                            </div>
                            {/*end::Table*/}
                        </div>
                        {/*end::Card body*/}
                    </div>
                    {/*end::Products*/}
                </div>
                {/*end::Container*/}
            </div>
            {/*end::Post*/}
        </>
    );
}

export default Dealers;
