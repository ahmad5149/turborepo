"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import "../../../contents/admin/scss/notifications.scss";
import { GetUsers, deleteUser } from "@/services/userService";
import Link from "next/link";
import Select from "react-select";
import { searchDealer } from "@/services/dealerService";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { transformUserData } from "../../../utils/transformData";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import { toast } from "react-toastify";
function Users({ users, dealerOptions }) {
    const searchParams = useSearchParams();

    const params = new URLSearchParams(searchParams);

    const [usersData, setUserData] = useState(users);
    const [loading, setLoading] = useState(false);
    const [lastUUID, setLastUUID] = useState(usersData ? [usersData?.length - 1].uuid : null);
    const [lastName, setLastName] = useState(usersData ? [usersData?.length - 1].firstName : null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    const [limit, setLimit] = useState(20);
    const [sortOrder, setSortOrder] = useState(params.get("sortOrder") ? params.get("sortOrder") : "asc");
    const [sortBy, setSortBy] = useState(params.get("sortBy") ? params.get("sortBy") : "firstName");
    const [query, setQuery] = useState(null);
    const [dealers, setLDealers] = useState(dealerOptions);
    const [loadingDealers, setLoadingDealers] = useState(false);
    const [dealerId, setDealerId] = useState("");
    const selectInputRef = useRef();
    const searchInputRef = useRef();
    const pathname = usePathname();
    const routerNav = useRouter();
    const [hasSearchResults, setHasSearchResults] = useState(false);

    async function startAgain() {
        setUserData([]);
        setLastName(null);
        setLastUUID(null);
        setLoading(true);
    }
    async function getSearchParams() {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        const sortByCol = params.get("sortBy") || sortBy;
        const sortOrderCol = params.get("sortOrder") || sortOrder;
        const dealer = params.get("dealer") || dealerId;
        return { q, sortByCol, sortOrderCol, dealer };
    }

    async function fetchData(q, sortBy, sortOrder, dealer) {
        setUserData([]);
        setLoading(true);
        const paramState = await getSearchParams();
        let searchQuery = q ? q : "";
        // let res = await fetchUsersDataTest();
        // console.log("res", res);
        GetUsers({ q: searchQuery, sortBy, sortOrder, dealer })
            .then((users) => {
                setPage(users?.page);
                setLoading(false);
                users = transformUserData(users?.hits || []);
                if (users?.length > 0) {
                    let lastRow = users?.[users?.length - 1];
                    setLastName(lastRow[paramState.sortByCol] ? lastRow[paramState.sortByCol] : "");
                    setLastUUID(lastRow.uuid ?? "");
                    // setUserData(users);
                    setUserData((prevData) => {
                        const uniqueUsers = users.filter(
                            (newUser) => !prevData.some((existingUser) => existingUser.uuid === newUser.uuid)
                        );

                        if ([...prevData, ...uniqueUsers].length === users?.found) {
                            setLastPage(true);
                        } else {
                            setLastPage(false);
                        }
                        return [...prevData, ...uniqueUsers];
                    });
                    setLoading(false);
                } else {
                    setUserData([]);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error in main code:", error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleInfiniteScroll = async () => {
        const params = await getSearchParams();
        const q = params.q ?? "*";

        const sortby = sortBy ? sortBy : params.sortByCol;

        const sortingOrder = sortOrder ? sortOrder : params.sortOrderCol;

        const { scrollTop, clientHeight, scrollHeight } = document?.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 500 && !loading) {
            try {
                if (!lastPage) {
                    setLoading(true);

                    const res = await GetUsers({
                        page: page + 1,
                        q,
                        sortBy: sortby,
                        sortOrder: sortingOrder,
                        dealer: dealerId
                    });

                    if (res.hits.length > 0) {
                        const users = transformUserData(res?.hits);
                        setPage(res?.page);

                        if (users.length > 0) {
                            setUserData((prevData) => {
                                const uniqueUsers = users.filter(
                                    (newUser) => !prevData.some((existingUser) => existingUser.uuid === newUser.uuid)
                                );

                                if ([...prevData, ...uniqueUsers].length === res?.found) {
                                    setLastPage(true);
                                } else {
                                    setLastPage(false);
                                }

                                return [...prevData, ...uniqueUsers];
                            });
                        }
                    } else {
                        setLastPage(true);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error in searchNotifications:", error.message);
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

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        setQuery(q);
        const dealer = params.get("dealer") || dealerId;
        setDealerId(dealer);
    }, []);

    const handleSearch = async (q) => {
        // await selectInputRef.current.clearValue();
        setQuery(q);
        // setSortBy("firstName");
        // await startAgain();
        // setSortOrder("asc");
        // // setSearchBy("name");
        // fetchData(q, "firstName", "asc", "");

        const params = new URLSearchParams(searchParams);
        if (q) {
            params.set("q", q);
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
            //params.set("searchBy", "name");
            params.delete("dealer");
        } else {
            params.delete("q");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const sortColumn = async (sortByCol) => {
        //const users = await linkFirestoreUsersToFirebase();
        setUserData([]);
        setLastPage(false);
        let sortOrd = sortOrder;
        if (sortBy == sortByCol) {
            if (sortOrder == "asc") {
                setSortOrder("desc");
                sortOrd = "desc";
            } else {
                setSortOrder("asc");
                sortOrd = "asc";
            }
        } else {
            // If a different column is clicked, set it as the new sorting column
            setSortBy(sortByCol);
            setSortOrder("asc"); // Default to ascending order
            sortOrd = "asc";
        }

        setSortBy(sortByCol);

        const stateParams = await getSearchParams();
        fetchData(stateParams.q ?? "*", sortByCol, sortOrd, stateParams.dealer ?? "");

        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sortByCol);
        params.set("sortOrder", sortOrd);
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    function sortingclassNamees(column, order) {
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

    const fetchOptions = async (searchTerm) => {
        try {
            setLoadingDealers(true);
            if (searchTerm) {
                const dealers = await searchDealer(searchTerm);
                setLDealers(dealers);
            } else {
                setLDealers(dealerOptions);
            }
            setLoadingDealers(false);
        } catch (error) {
            console.error("Error in main code:", error?.message);
        }
    };
    const handleInputChange = (value) => {
        debouncedFetchOptions(value);
    };

    const debouncedFetchOptions = debounce(fetchOptions, 300);

    const filterByDealership = async (e) => {
        //console.log("e?.value", e?.value);

        setSortBy("firstName");
        // added state for dealerId
        setDealerId(e?.value);
        await startAgain();
        setSortOrder("asc");

        const params = new URLSearchParams(searchParams);
        if (e?.value) {
            params.set("sortBy", "firstName");
            params.set("sortOrder", "asc");
            params.set("dealer", e?.value);
            params.delete("q");
        } else {
            params.delete("dealer");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
        searchInputRef.defaultValue = "";
        setQuery("");
        fetchData("", "firstName", "asc", e?.value);
        // fetchUsersByDealerId(limit, +e?.value).then((users) => {
        //     if (users?.length > 0) {
        //         setSearchBy("dealership");
        //         let lastRow = users?.[users?.length - 1];
        //         setLastUUID(lastRow.uuid ?? "");
        //         setUserData(users);
        //         setLoading(false);
        //     } else {
        //         setUserData([]);
        //         setLoading(false);
        //     }
        // });
    };

    const handleDelete = (id, index, name) => {
        Swal.fire({
            title: `Are you sure you want to delete ${name} user?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    allowOutsideClick: false,
                    html: `
                        <div style="text-align: center;">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div style="margin-top: 10px;">Deleting...</div>
                        </div>`,
                    showConfirmButton: false,
                    showCancelButton: false
                });

                deleteUser(id)
                    .then((res) => {
                        if (res.success) {
                            const newData = [...usersData.slice(0, index), ...usersData.slice(index + 1)];
                            setUserData(newData);

                            Swal.fire({
                                title: "Record deleted successfully",
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Okay"
                            });
                        } else {
                            toast.error("Failed to delete user");
                        }
                    })
                    .catch((error) => {
                        console.log(error.message);
                        alert("Failed to delete user! ".error.message);
                    });
            }
        });
    };

    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };

    const findSearchResults = async (q) => {
        setHasSearchResults(true);
        setSortBy(sortBy);
        await startAgain();
        setSortOrder(sortOrder);
        fetchData(q, sortBy, sortOrder, "");
    };
    const handleEmptySearch = async (q) => {
        setQuery(q);
        if (hasSearchResults) {
            await startAgain();
            fetchData(q);
        }
        setHasSearchResults(false);
        params.delete("q");

        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            findSearchResults(query);
        }
    };

    return (
        <>
            <Toolbar
                pageName="Users"
                addNew={{ path1: "users" }}
            />

            <div
                className="post fs-6 d-flex flex-column-fluid"
                id="kt_post">
                <div className="container-xxl">
                    <div className="card card-flush">
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
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
                                        placeholder="Filter by username"
                                        value={query}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                        }}
                                        defaultValue={query}
                                        onKeyDown={handleKeyPress}
                                        // defaultValue={searchParams.get("q")?.toString()}
                                    />

                                    <div className="position-relative buttonContainer-search right-custom">
                                        <button
                                            onClick={() => {
                                                handleEmptySearch("");
                                            }}
                                            disabled={!!!query}
                                            type="button"
                                            className="btn-close closeButton-search"></button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            findSearchResults(query);
                                        }}
                                        className="btn btn-primary">
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="filter-by-dealership">
                                <div className="handle-filter-width">
                                    <Select
                                        ref={selectInputRef}
                                        isClearable={true}
                                        options={dealers}
                                        isLoading={loadingDealers}
                                        isSearchable
                                        placeholder="Filter by dealership"
                                        onInputChange={handleInputChange}
                                        onChange={(e) => filterByDealership(e)}
                                        // selectedValue={{
                                        //     value: searchParams.get("dealer")?.toString(),
                                        //     label: "Adasi"
                                        // }}
                                    />
                                </div>
                            </div>
                            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                <div className="w-100 mw-150px">
                                    <Link
                                        className="btn btn-primary text-white"
                                        href="/admin/users/add-user"
                                        passHref>
                                        Add User
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer notifications">
                                <div className="table-responsive">
                                    <table
                                        className="table dataTable align-middle table-row-dashed fs-6 gy-1"
                                        id="kt_ecommerce_products_table">
                                        <thead>
                                            <tr className="text-start text-black-400 fw-bold fs-7 gs-0">
                                                <th
                                                    className={`cursor-pointer text-start min-w-90px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("firstName", sortOrder)}`}
                                                    onClick={() => sortColumn("firstName")}>
                                                    First Name
                                                </th>
                                                <th
                                                    className={`cursor-pointer text-start min-w-40px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("lastName", sortOrder)}`}
                                                    onClick={() => sortColumn("lastName")}>
                                                    Last Name
                                                </th>

                                                <th
                                                    className={`cursor-pointer text-start min-w-60px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("dealerShip", sortOrder)}`}
                                                    onClick={() => sortColumn("dealerShip")}>
                                                    Dealership
                                                </th>

                                                <th
                                                    className={`cursor-pointer text-start min-w-60px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("title", sortOrder)}`}
                                                    onClick={() => sortColumn("title")}>
                                                    Title
                                                </th>

                                                <th
                                                    className={`cursor-pointer text-start min-w-60px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("isActive", sortOrder)}`}
                                                    onClick={() => sortColumn("isActive")}>
                                                    Status
                                                </th>

                                                <th
                                                    className={`cursor-pointer text-start min-w-60px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("email", sortOrder)}`}
                                                    onClick={() => sortColumn("email")}>
                                                    Email
                                                </th>

                                                <th
                                                    className={` cursor-pointer text-start min-w-60px ${
                                                        loading ? "cursor-pointer-none" : ""
                                                    } ${sortingclassNamees("phone", sortOrder)}`}
                                                    onClick={() => sortColumn("phone")}>
                                                    Phone Number
                                                </th>

                                                <th className={`cursor-pointer text-start min-w-70px  `}>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="fw-semibold text-gray-600 fs-6">
                                            {!loading && usersData?.length === 0 && (
                                                <tr>
                                                    <td colSpan="12">No records found...</td>
                                                </tr>
                                            )}

                                            {usersData?.map((user, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td
                                                            className="text-start pe-0"
                                                            title={`${
                                                                user?.escalationNotification ? "Escalation Contact" : ""
                                                            }`}>
                                                            {user?.escalationNotification && (
                                                                <i
                                                                    className="fa-solid fa-star"
                                                                    style={{ color: "gold" }}></i>
                                                            )}{" "}
                                                            {user?.firstName || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">{user?.lastName || "N/A"}</td>
                                                        <td className="text-start pe-0">{user?.dealerShip || "N/A"}</td>
                                                        <td className="text-start pe-0">{user?.title || "N/A"}</td>
                                                        <td className="text-start pe-0">
                                                            {user.isActive ? "Yes" : "No" || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">{user?.email || "N/A"}</td>
                                                        <td className="cell-number text-start pe-0">
                                                            {user?.phone || "N/A"}
                                                        </td>
                                                        <td className="text-start pe-0">
                                                            <div className="d-flex align-items-stretch flex-shrink-0">
                                                                <Link
                                                                    onClick={handleLink}
                                                                    href={`/admin/users/add-user?id=${
                                                                        user.uuid
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
                                                                        className="active"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                user.uuid,
                                                                                index,
                                                                                user?.firstName
                                                                            )
                                                                        }>
                                                                        <i className="ki-duotone ki-basket fs-2x">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* {!loading && (
                                                <tr>
                                                    <td colSpan="12">
                                                        <span
                                                            onClick={() => handleScroll()}
                                                            className="active">
                                                            <i className="ki-duotone ki-plus-square fs-2x">
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                                <span className="path3"></span>
                                                                <span className="path4"></span>
                                                            </i>
                                                        </span>
                                                    </td>
                                                </tr>
                                            )} */}
                                        </tbody>
                                    </table>
                                </div>

                                {loading && (
                                    <div className="admin-loading">
                                        <LoadingSpinner />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;
