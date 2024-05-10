"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import Link from "next/link";
import { deleteDealer, fetchDealersListing } from "../../../services/dealerService";
import "../../../contents/admin/scss/dealers.scss";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import "../../../../src/contents/scss/spinner.scss";
import { DealerMobileRow } from "./DealerMobileRow";

function DealersMobile({ dealersListing, totalDealers }) {
    const searchParams = useSearchParams();

    const [dealersData, setDealersData] = useState(dealersListing?.data ?? []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const params = new URLSearchParams(searchParams);

    const [lastPage, setLastPage] = useState(false);
    const [searchQuery, setSearchQuery] = useState(params.get("q") ? params.get("q") : "");
    const [totalRecords, setTotalRecords] = useState(totalDealers);
    const [query, setQuery] = useState("*");
    const [sortBy, setSortBy] = useState(params.get("sortBy") ? params.get("sortBy") : "name");
    const [sortOrder, setSortOrder] = useState(params.get("sortOrder") ? params.get("sortOrder") : "asc");
    const [activeFilter, setActiveFilter] = useState(params.get("active") ? params.get("active") : -1);
    const [limit, setLimit] = useState(10);

    const pathname = usePathname();
    const routerNav = useRouter();

    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };

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
                console.log("🚀 ~ fetchData ~ code:", code);
                console.error("Error in main code:", error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
                console.log("🚀 ~ fetchData ~ code:", error);
                console.error("Error in searchDealers:", error.message);
            }
        }
    };
    const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 500);

    useEffect(() => {
        const handleScroll = () => {
            debouncedHandleInfiniteScroll();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [debouncedHandleInfiniteScroll]);
    
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
            <div className="container-xxl">
                <div className="text-start mb-2 dealers-found-label">{totalRecords} dealers found</div>
                <div className="card card-flush">
                    <div className="mobile-dealers text-center m-auto align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
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
                                    //  value={query}
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
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    !loading && handleSearch(searchQuery);
                                }}
                                className="btn btn-primary w-100">
                                Search
                            </button>
                        </div>
                        <div className="text-end pt-3">
                            <Link
                                className=" text-white"
                                href="/admin/dealers/add-dealer"
                                passHref>
                                <i className="fs-4x ki-duotone ki-plus-circle">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                    <span className="path3"></span>
                                </i>
                            </Link>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div className="table-responsive">
                            <div
                                className="accordion"
                                id="accordionExampleDealer">
                                <table className="table align-middle table-row-dashed fs-6 gy-0">
                                    <tbody className="fw-semibold text-gray-600">
                                        {!loading && dealersData.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center">
                                                    No record found...
                                                </td>
                                            </tr>
                                        )}

                                        {dealersData.map((dealer, index) => (
                                            <DealerMobileRow
                                                key={index}
                                                index={index}
                                                dealer={dealer}
                                                parentId={"#accordionExampleDealer"}
                                                handleLink={handleLink}
                                                handleDelete={handleDelete}
                                            />
                                        ))}

                                        {loading && (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center">
                                                    <div className="admin-loading">
                                                        <LoadingSpinner />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DealersMobile;

// "use client";
// import { useState, useEffect } from "react";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { Toolbar } from "../common/toolbar/Toolbar";
// import "../../../contents/admin/scss/dealers.scss";

// // import "../../../contents/admin/scss/notifications.scss";
// // import { GetUsers, deleteUser } from "@/services/userService";
// import Link from "next/link";
// import Swal from "sweetalert2";
// import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
// import "../../../../src/contents/scss/spinner.scss";
// import { toast } from "react-toastify";

// export const UserMobileListing = () => {
//     const [dealersData, setDealersData] = useState(dealersListing?.data ?? []); // []
//     const [loading, setLoading] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);

//     const searchParams = useSearchParams();
//     const params = new URLSearchParams(searchParams);

//     const [query, setQuery] = useState(null);
//     const [queryOnLoad, setQueryOnLoad] = useState(null);
//     const pathname = usePathname();
//     const routerNav = useRouter();

//     async function startAgain() {
//         setUserData([]);
//         setLoading(true);
//     }
//     async function fetchData(q) {
//         setUserData([]);
//         setLoading(true);
//         let searchQuery = q ? q : "";

//         GetUsers({ q: searchQuery })
//             .then((res) => {
//                 const users = res?.hits.map((hit) => hit?.document);
//                 setLoading(false);

//                 if (users?.length > 0) {
//                     setUserData((prevData) => {
//                         const uniqueUsers = users.filter(
//                             (newUser) => !prevData.some((existingUser) => existingUser.uuid === newUser.uuid)
//                         );

//                         return [...prevData, ...uniqueUsers];
//                     });
//                     setLoading(false);
//                 } else {
//                     setUserData([]);
//                     setLoading(false);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error in main code:", error.message);
//                 setLoading(false);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     }
//     const handleSearch = async (q) => {
//         setQuery(q);

//         const params = new URLSearchParams(searchParams);
//         if (q) {
//             params.set("q", q);
//         } else {
//             params.delete("q");
//         }
//         routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
//         window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
//     };

//     const handleDelete = (id, index, name) => {
//         Swal.fire({
//             title: `Are you sure you want to delete ${name} user?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes!"
//         }).then((result) => {
//             if (result.value) {
//                 Swal.fire({
//                     allowOutsideClick: false,
//                     html: `
//                         <div style="text-align: center;">
//                             <div class="spinner-border text-primary" role="status">
//                                 <span class="sr-only">Loading...</span>
//                             </div>
//                             <div style="margin-top: 10px;">Deleting...</div>
//                         </div>`,
//                     showConfirmButton: false,
//                     showCancelButton: false
//                 });

//                 deleteUser(id)
//                     .then((res) => {
//                         if (res.success) {
//                             const newData = [...usersData.slice(0, index), ...usersData.slice(index + 1)];
//                             setUserData(newData);

//                             Swal.fire({
//                                 title: "Record deleted successfully",
//                                 icon: "success",
//                                 confirmButtonColor: "#3085d6",
//                                 cancelButtonColor: "#d33",
//                                 confirmButtonText: "Okay"
//                             });
//                         } else {
//                             toast.error("Failed to delete user");
//                         }
//                     })
//                     .catch((error) => {
//                         console.log(error.message);
//                         alert("Failed to delete user! ".error.message);
//                     });
//             }
//         });
//     };

//     const handleLink = (e) => {
//         if (e != null && e?.target?.href?.includes("#")) {
//             e?.preventDefault();
//             return;
//         }
//     };

//     const findSearchResults = async (q) => {
//         await startAgain();

//         fetchData(q);
//     };

//     useEffect(() => {
//         if (queryOnLoad?.length) findSearchResults(queryOnLoad);
//     }, [queryOnLoad]);

//     const handleEmptySearch = async (q) => {
//         setQuery(q);
//         setUserData([]);
//         params.delete("q");
//         routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
//         window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === "Enter") {
//             findSearchResults(query);
//         }
//     };
//     return (
//         <>
//             <Toolbar
//                 pageName="Dealers"
//                 addNew={{ path1: "dealers", path2: "add" }}
//             />

//             {/*begin::Post*/}
//             <div
//                 className="post fs-6 d-flex flex-column-fluid"
//                 id="kt_post">
//                 {/*begin::Container*/}
//                 <div className="container-xxl">
//                     <div className="text-start mb-2 dealers-found-label">{totalRecords} dealers found</div>
//                     {/*begin::Products*/}
//                     <div className="card card-flush">
//                         {/*begin::Card header*/}
//                         <div className="mobile-dealers  card-header align-items-center py-5 gap-2 gap-md-5">
//                             {/*begin::Card title*/}
//                             <div className="card-title">
//                                 {/*begin::Search*/}
//                                 <div className="d-flex align-items-center position-relative my-1">
//                                     <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
//                                         <span className="path1"></span>
//                                         <span className="path2"></span>
//                                     </i>
//                                     <input
//                                         type="text"
//                                         data-kt-ecommerce-product-filter="search"
//                                         className="form-control form-control-solid w-250px ps-12"
//                                         placeholder="Filter by dealer name"
//                                         onChange={(e) => {
//                                             setSearchQuery(e.currentTarget.value);
//                                         }}
//                                         onKeyDown={handleKeyPress}
//                                         value={searchQuery}
//                                     />
//                                     <div className="position-relative buttonContainer-search right-custom">
//                                         <button
//                                             onClick={() => {
//                                                 setSearchQuery("");
//                                                 handleSearch("");
//                                             }}
//                                             disabled={!!!searchQuery}
//                                             type="button"
//                                             className="btn-close closeButton-search"></button>
//                                     </div>
//                                     <button
//                                         onClick={() => {
//                                             !loading && handleSearch(searchQuery);
//                                         }}
//                                         className="btn btn-primary w-100">
//                                         Search
//                                     </button>
//                                 </div>
//                                 {/*end::Search*/}
//                             </div>
//                             {/*end::Card title*/}
//                             {/*begin::Card toolbar*/}
//                             <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
//                                 <div className="w-100 mw-150px">
//                                     {/*begin::Select2*/}
//                                     <select
//                                         className="form-select form-select-solid"
//                                         data-control="select2"
//                                         data-hide-search="true"
//                                         data-placeholder="Filter"
//                                         onChange={(e) => {
//                                             handleActiveFilter(e.target.value);
//                                         }}
//                                         defaultValue={searchParams.get("active")?.toString()}
//                                         data-kt-ecommerce-product-filter="status">
//                                         <option
//                                             value="-1"
//                                             disabled={true}>
//                                             Filter
//                                         </option>
//                                         <option value="-1">All</option>
//                                         <option value="1">Active</option>
//                                         <option value="0">Inactive</option>
//                                         <option value="2">Deleted</option>
//                                     </select>
//                                     {/*end::Select2*/}
//                                 </div>
//                                 {/*begin::Add product*/}
//                                 <Link
//                                     className="btn btn-primary"
//                                     onClick={handleLink}
//                                     href="/admin/dealers/add-dealer"
//                                     passHref>
//                                     Add Dealer
//                                 </Link>
//                                 {/*end::Add product*/}
//                             </div>
//                             {/*end::Card toolbar*/}
//                         </div>
//                         {/*end::Card header*/}
//                         {/*begin::Card body*/}
//                         <div className="card-body pt-0">
//                             {/*begin::Table*/}

//                             <div
//                                 id="kt_ecommerce_products_table_wrapper"
//                                 className="dataTables_wrapper dt-bootstrap4 no-footer">
//                                 {!loading && dealersData?.length === 0 && <p> No records found...</p>}
//                                 {dealersData && dealersData?.length > 0 && (
//                                     <>
//                                         {" "}
//                                         <div className="text-start py-5">
//                                             <label
//                                                 for="exampleFormControlInput1"
//                                                 class="form-label">
//                                                 Name
//                                             </label>
//                                             <h4>
//                                                 {dealersData[0]?.firstName + " " + dealersData[0]?.lastName || "N/A"}
//                                             </h4>
//                                         </div>
//                                         <div className="text-start pb-5">
//                                             <label
//                                                 for="exampleFormControlInput1"
//                                                 class="form-label">
//                                                 Website
//                                             </label>
//                                             <h4>{dealersData[0]?.email || "N/A"}</h4>
//                                         </div>
//                                         <div className="text-start">
//                                             <label
//                                                 for="exampleFormControlInput1"
//                                                 class="form-label">
//                                                 Actions
//                                             </label>
//                                             <div className="d-flex align-items-stretch flex-shrink-0">
//                                                 <Link
//                                                     onClick={handleLink}
//                                                     href={`/admin/dealers/add-dealer?id=${
//                                                         dealer.uuid
//                                                     }&key=${Math.random().toString(36).substring(2, 7)}`}
//                                                     passHref>
//                                                     <div
//                                                         style={{
//                                                             background: "#f1faff"
//                                                         }}
//                                                         className="btn btn-icon btn-active-light-primary fs-6">
//                                                         <span className="active">
//                                                             <i
//                                                                 className="ki-duotone ki-pencil fs-2"
//                                                                 style={{
//                                                                     color: "#00a3ff"
//                                                                 }}>
//                                                                 <span className="path1"></span>
//                                                                 <span className="path2"></span>
//                                                             </i>
//                                                         </span>
//                                                     </div>
//                                                 </Link>
//                                                 <div
//                                                     style={{
//                                                         background: "#f1faff"
//                                                     }}
//                                                     className="btn btn-icon btn-active-light-primary fs-6 ms-2">
//                                                     <span
//                                                         className="active"
//                                                         onClick={() => handleDelete(dealer.uuid, index)}>
//                                                         <i
//                                                             style={{
//                                                                 color: "#00a3ff"
//                                                             }}
//                                                             className="ki-duotone ki-basket fs-2x">
//                                                             <span className="path1"></span>
//                                                             <span className="path2"></span>
//                                                             <span className="path3"></span>
//                                                             <span className="path4"></span>
//                                                         </i>
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                                 {loading && (
//                                     <div className="admin-loading">
//                                         <LoadingSpinner />
//                                     </div>
//                                 )}
//                             </div>
//                             {/*end::Table*/}
//                         </div>
//                         {/*end::Card body*/}
//                     </div>
//                     {/*end::Products*/}
//                 </div>
//                 {/*end::Container*/}
//             </div>
//             {/*end::Post*/}
//         </>
//     );
// };
