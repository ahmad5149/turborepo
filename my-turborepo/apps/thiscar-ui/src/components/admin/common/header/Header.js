"use client";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
//import { GetDefaultImagePath } from "../defaultImage/DefaultImage";
// import { LogoPath } from "../defaultImage/DefaultPaths";
import AppContext from "@/StateManagement/AppContext";
import { clientAuth } from "../../../../services/firebase";
import { appConfig } from "../../../../appConfig";
import { useAuth } from "../../../../components/auth";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import "../../../../contents/admin/scss/header.scss";
import { usePathname } from "next/navigation";
import appLogo from "../../../../../public/media/logo-admin.png";

export const Header = () => {
    const path = usePathname();
    //const admin = currentUser?.tenantId == appConfig.ADMIN_TENANT_ID ? currentUser : false;
    const currentUser = useAuth();
    const expiresIn = 60 * 60 * 23 * 2 * 1000;
    const router = useRouter();
    const signOutUser = async () => {
        Swal.fire({
            title: "Are you sure you want to signout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            localStorage.setItem("logoutEvent", Date.now().toString());
            if (result.value) {
                clientAuth.signOut().then((res) => {
                    fetch(`/api/signout`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${currentUser?.getIdToken()}`
                        }
                    }).then((response) => {
                        if (response.status === 200) {
                            window.location.assign("/admin/login");
                        }
                    });
                });
            }
        });
    };
    const clearUserSession = async () => {
        clientAuth.signOut().then((res) => {
            fetch(`/api/signout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser?.getIdToken()}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    window.location.assign("/admin/login");
                }
            });
        });
    };
    useEffect(() => {
        const signOutTimeout = setTimeout(() => {
            clearUserSession();
        }, expiresIn); // 20 seconds in milliseconds

        // Clean up the timeout when the component unmounts
        return () => clearTimeout(signOutTimeout);
    }, []);
    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };
    useEffect(() => {
        const handleLogoutEvent = (event) => {
            if (event.key === "logoutEvent") {
                // Redirect the user to the logout page or perform any other action
                window.location.href = "/admin/login"; // Redirect to logout page
            }
        };

        // Add event listener when component mounts
        window.addEventListener("storage", handleLogoutEvent);

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener("storage", handleLogoutEvent);
        };
    }, []);
    return (
        <>
            {/*begin::Header*/}
            <div>
                <div
                    id="mt_aside"
                    className="aside aside-default aside-hoverable side-view-panel"
                    data-kt-drawer="true"
                    data-kt-drawer-name="aside"
                    data-kt-drawer-activate="{default: true, lg: false}"
                    data-kt-drawer-overlay="true"
                    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
                    data-kt-drawer-direction="start"
                    data-kt-drawer-toggle="#mmt_aside_toggle">
                    <div
                        className="px-10 pt-9 pb-5"
                        id="mt_aside_logo">
                        <Link
                            onClick={handleLink}
                            className="dropdown-item"
                            href="/admin"
                            passHref>
                            <img
                                alt="ThisCar"
                                src={appLogo.src}
                                className="max-h-50px logo-default theme-light-show"
                            />
                            {/* <img
                            alt="ThisCar"
                            src={process.env.NEXT_PUBLIC_BASE_URL + "/public/media/logo.png"}
                            className="max-h-50px logo-default theme-dark-show"
                        />
                        <img
                            alt="ThisCar"
                            src={process.env.NEXT_PUBLIC_BASE_URL + "/public/media/logo.png"}
                            className="max-h-50px logo-minimize"
                        /> */}
                        </Link>
                    </div>
                    <div className="aside-menu flex-column-fluid ps-3 pe-1">
                        <div
                            className="menu menu-sub-indention menu-column menu-rounded menu-title-gray-600 menu-icon-gray-400 menu-active-bg menu-state-primary menu-arrow-gray-500 fw-semibold fs-6 my-5 mt-lg-2 mb-lg-0"
                            id="mt_aside_menu"
                            data-kt-menu="true">
                            <div
                                className="hover-scroll-y mx-4"
                                id="mt_aside_menu_wrapper"
                                data-kt-scroll="true"
                                data-kt-scroll-activate="{default: false, lg: true}"
                                data-kt-scroll-height="auto"
                                data-kt-scroll-wrappers="#mt_aside_menu"
                                data-kt-scroll-offset="20px"
                                data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer">
                                {/*begin:Menu item*/}
                                <div
                                    data-kt-menu-trigger="click"
                                    className="menu-item here show menu-accordion">
                                    {/*begin:Menu link*/}
                                    {/*end:Menu link*/}
                                    {/*begin:Menu sub*/}
                                    <div className="menu-sub menu-sub-accordion">
                                        {/*begin:Menu item*/}
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={path === "/admin" ? "menu-link active" : "menu-link"}
                                                onClick={handleLink}
                                                href="/admin"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-element-11 fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                        <span className="path4"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Dashboard</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        {/*end:Menu item*/}
                                        {/*begin:Menu item*/}
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={path === "/admin/dealers" ? "menu-link active" : "menu-link"}
                                                onClick={handleLink}
                                                href="/admin/dealers"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-briefcase fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Dealership</span>
                                            </Link>

                                            {/*end:Menu link*/}
                                        </div>
                                        {/*end:Menu item*/}
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={path === "/admin/users" ? "menu-link active" : "menu-link"}
                                                onClick={handleLink}
                                                href="/admin/users"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-user fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Users</span>
                                            </Link>

                                            {/*end:Menu link*/}
                                        </div>
                                        {/*end:Menu item*/}
                                        {/*end:Menu item*/}
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={
                                                    path === "/admin/inventory" ? "menu-link active" : "menu-link"
                                                }
                                                onClick={handleLink}
                                                href="/admin/inventory"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-handcart fs-2"></i>
                                                </span>
                                                <span className="menu-title">Inventory</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={
                                                    path === "/admin/thiscar-notifications"
                                                        ? "menu-link active"
                                                        : "menu-link"
                                                }
                                                onClick={handleLink}
                                                href="/admin/thiscar-notifications"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-notification fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">ThisCar Notifications</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={
                                                    path === "/admin/notifications-queue"
                                                        ? "menu-link active"
                                                        : "menu-link"
                                                }
                                                onClick={handleLink}
                                                href="/admin/notifications-queue"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i class="ki-duotone ki-information fs-2 text-danger">
                                                        <span class="path1"></span>
                                                        <span class="path2"></span>
                                                        <span class="path3"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Notifications Queue</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={
                                                    path === "/admin/offsite-notifications"
                                                        ? "menu-link active"
                                                        : "menu-link"
                                                }
                                                onClick={handleLink}
                                                href="/admin/offsite-notifications"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-notification fs-2">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Offsite Notifications</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        <div className="menu-item">
                                            {/*begin:Menu link*/}
                                            <Link
                                                className={path === "/admin/login" ? "menu-link active" : "menu-link"}
                                                onClick={() => {
                                                    handleLink();
                                                    signOutUser();
                                                }}
                                                href="/admin/login"
                                                passHref>
                                                <span className="menu-icon">
                                                    <i className="ki-duotone ki-user fs-1">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                </span>
                                                <span className="menu-title">Sign Out</span>
                                            </Link>
                                            {/*end:Menu link*/}
                                        </div>
                                        {/*end:Menu item*/}
                                    </div>
                                    {/*end:Menu sub*/}
                                </div>
                                {/*end:Menu item*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="mt_header"
                    className="header"
                    data-kt-sticky="true"
                    data-kt-sticky-name="header"
                    data-kt-sticky-offset="{default: '200px', lg: '300px'}">
                    {/*begin::Container*/}
                    <div className="container-fluid d-flex align-items-stretch justify-content-between">
                        {/*begin::Logo bar*/}
                        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                            {/*begin::Aside Toggle*/}
                            <div className="d-flex align-items-center d-lg-none">
                                {!path.includes("login") && (
                                    <div
                                        className="btn btn-icon btn-active-color-primary ms-n2 me-1"
                                        id="mmt_aside_toggle">
                                        <i className="ki-duotone ki-abstract-14 fs-1">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                        </i>
                                    </div>
                                )}
                            </div>
                            {/*end::Aside Toggle*/}
                            {/*begin::Logo*/}
                            <a
                                href="/admin"
                                className="d-lg-none">
                                {/* <img
                                alt="Logo"
                                src="assets/media/logos/logo-compact.svg"
                                className="mh-40px"
                            /> */}
                            </a>
                            {/*end::Logo*/}
                        </div>
                        {/*end::Logo bar*/}
                        {/*begin::Topbar*/}
                        <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
                            {/*begin::Search*/}
                            <div className="d-flex align-items-stretch me-1"></div>
                            {/*end::Search*/}
                            {/*begin::Toolbar wrapper*/}
                            <div className="d-flex align-items-stretch flex-shrink-0 logout-btn-view">
                                {/*begin::Activities*/}
                                <div className="d-flex align-items-center ms-1 ms-lg-2">
                                    {/*begin::Drawer toggle*/}
                                    <div
                                        className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
                                        id="mt_activities_toggle">
                                        {currentUser ? (
                                            <a
                                                href="#"
                                                className="active"
                                                onClick={signOutUser}>
                                                <i className="ki-duotone ki-user fs-1">
                                                    <span className="path1"></span>
                                                    <span className="path2"></span>
                                                </i>
                                            </a>
                                        ) : (
                                            !path.includes("login") && (
                                                <a
                                                    className="active"
                                                    onClick={handleLink}
                                                    href="/admin/login">
                                                    <i className="ki-duotone ki-user fs-1">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                    </i>
                                                </a>
                                            )
                                        )}
                                    </div>
                                    {/*end::Drawer toggle*/}
                                </div>
                                {/*end::Activities*/}
                                {/*begin::Quick links*/}

                                {/*begin::User*/}
                                {currentUser ? (
                                    <div
                                        className="d-flex align-items-center ms-2 ms-lg-3"
                                        id="mt_header_user_menu_toggle">
                                        {/*begin::Menu wrapper*/}
                                        <div
                                            className="cursor-pointer symbol symbol-35px symbol-lg-35px"
                                            data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                                            data-kt-menu-attach="parent"
                                            data-kt-menu-placement="bottom-end">
                                            {/* <img
                                            alt="Menu"
                                            src="assets/media/avatars/300-1.jpg"
                                        /> */}
                                        </div>
                                        {/*begin::User account menu*/}

                                        <div
                                            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                                            data-kt-menu="true">
                                            {/*begin::Menu item*/}
                                            <div className="menu-item px-3">
                                                <div className="menu-content d-flex align-items-center px-3">
                                                    {/*begin::Username*/}
                                                    <div className="d-flex flex-column">
                                                        <div className="fw-bold d-flex align-items-center fs-5">
                                                            Name
                                                            <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                                                                Role
                                                            </span>
                                                        </div>
                                                        <a
                                                            href="#"
                                                            className="fw-semibold text-muted text-hover-primary fs-7">
                                                            Email
                                                        </a>
                                                    </div>
                                                    {/*end::Username*/}
                                                </div>
                                            </div>
                                            {/*end::Menu item*/}
                                            {/*begin::Menu separator*/}
                                            <div className="separator my-2"></div>
                                            {/*end::Menu separator*/}
                                            {/*begin::Menu item*/}
                                            <div className="menu-item px-5">
                                                <a
                                                    href="#"
                                                    className="menu-link px-5">
                                                    My Profile
                                                </a>
                                            </div>
                                            {/*end::Menu item*/}

                                            {/*begin::Menu item*/}
                                            <div className="menu-item px-5">
                                                <a
                                                    href="#"
                                                    className="menu-link px-5">
                                                    Sign Out
                                                </a>
                                            </div>
                                            {/*end::Menu item*/}
                                        </div>
                                        {/*end::User account menu*/}
                                        {/*end::Menu wrapper*/}
                                    </div>
                                ) : (
                                    <></>
                                )}

                                {/*end::User */}
                            </div>
                            {/*end::Toolbar wrapper*/}
                        </div>
                        {/*end::Topbar*/}
                    </div>
                    {/*end::Container*/}
                </div>
            </div>
            {/*end::Header*/}
        </>
    );
};
