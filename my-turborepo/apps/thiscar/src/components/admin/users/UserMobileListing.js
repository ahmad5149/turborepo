"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toolbar } from "../common/toolbar/Toolbar";
import "../../../contents/admin/scss/notifications.scss";
import { GetUsers, deleteUser } from "@/services/userService";
import Link from "next/link";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/common/loader/LoadingSpinner";
import "../../../../src/contents/scss/spinner.scss";
import { toast } from "react-toastify";

export const UserMobileListing = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const [usersData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(null);
    const [queryOnLoad, setQueryOnLoad] = useState(null);
    const pathname = usePathname();
    const routerNav = useRouter();

    async function startAgain() {
        setUserData([]);
        setLoading(true);
    }

    async function fetchData(q) {
        setUserData([]);
        setLoading(true);
        let searchQuery = q ? q : "";

        GetUsers({ q: searchQuery })
            .then((res) => {
                const users = res?.hits.map((hit) => hit?.document);
                setLoading(false);

                if (users?.length > 0) {
                    setUserData((prevData) => {
                        const uniqueUsers = users.filter(
                            (newUser) => !prevData.some((existingUser) => existingUser.uuid === newUser.uuid)
                        );

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

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const q = params.get("q") || query;
        setQuery(q);
        setQueryOnLoad(q);
    }, []);

    const handleSearch = async (q) => {
        setQuery(q);

        const params = new URLSearchParams(searchParams);
        if (q) {
            params.set("q", q);
        } else {
            params.delete("q");
        }
        routerNav.push(`${pathname}?${params.toString()}`, { scroll: false });
        window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
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
        await startAgain();

        fetchData(q);
    };

    useEffect(() => {
        if (queryOnLoad?.length) findSearchResults(queryOnLoad);
    }, [queryOnLoad]);

    const handleEmptySearch = async (q) => {
        setQuery(q);
        setUserData([]);
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
                        <div className="mobile-users text-center m-auto align-items-center py-5 gap-2 gap-md-5">
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
                                        placeholder="Filter by email"
                                        value={query}
                                        onChange={(e) => {
                                            handleSearch(e.target.value);
                                        }}
                                        onKeyDown={handleKeyPress}
                                        defaultValue={query}
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
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        query?.length && findSearchResults(query);
                                    }}
                                    className="btn btn-primary w-100">
                                    Search
                                </button>
                            </div>
                            <div className="text-end pt-3">
                                <Link
                                    className=" text-white"
                                    href="/admin/users/add-user"
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
                            <div
                                id="kt_ecommerce_products_table_wrapper"
                                className="dataTables_wrapper dt-bootstrap4 no-footer notifications">
                                {!loading && usersData?.length === 0 && <p>No records found...</p>}
                                {usersData && usersData?.length > 0 && (
                                    <>
                                        {" "}
                                        <div className="text-start py-5">
                                            <label
                                                for="exampleFormControlInput1"
                                                class="form-label">
                                                Name
                                            </label>
                                            <h4>{usersData[0]?.firstName + " " + usersData[0]?.lastName || "N/A"}</h4>
                                        </div>
                                        <div className="text-start pb-5">
                                            <label
                                                for="exampleFormControlInput1"
                                                class="form-label">
                                                Email
                                            </label>
                                            <h4>{usersData[0]?.email || "N/A"}</h4>
                                        </div>
                                        <div className="text-start">
                                            <label
                                                for="exampleFormControlInput1"
                                                class="form-label">
                                                Actions
                                            </label>
                                            <div className="d-flex align-items-stretch flex-shrink-0">
                                                <Link
                                                    onClick={handleLink}
                                                    href={`/admin/users/add-user?id=${
                                                        usersData[0].uuid
                                                    }&key=${Math.random().toString(36).substring(2, 7)}`}
                                                    passHref>
                                                    <div
                                                        style={{
                                                            background: "#f1faff"
                                                        }}
                                                        className="btn btn-icon btn-active-light-primary fs-6">
                                                        <span className="active">
                                                            <i
                                                                className="ki-duotone ki-pencil fs-2"
                                                                style={{
                                                                    color: "#00a3ff"
                                                                }}>
                                                                <span className="path1"></span>
                                                                <span className="path2"></span>
                                                            </i>
                                                        </span>
                                                    </div>
                                                </Link>
                                                <div
                                                    style={{
                                                        background: "#f1faff"
                                                    }}
                                                    className="btn btn-icon btn-active-light-primary fs-6 ms-2">
                                                    <span
                                                        className="active"
                                                        onClick={() =>
                                                            handleDelete(usersData[0].uuid, 0, usersData[0]?.firstName)
                                                        }>
                                                        <i
                                                            style={{
                                                                color: "#00a3ff"
                                                            }}
                                                            className="ki-duotone ki-basket fs-2x">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                            <span className="path4"></span>
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

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
};
