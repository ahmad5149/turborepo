"use client";
import appLogo from "../../../../../public/media/logo-admin.png";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../components/auth";
import { ToastContainer } from "react-toastify";
export const Sidebar = (props) => {
    const currentUser = useAuth();
    const path = usePathname();
    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };
    if (!currentUser) return <></>;
    return (
        <>
            {!path.includes("login") && (
                <div>
                    {/*begin::Aside*/}
                    <ToastContainer />
                    <div
                        id="kt_aside"
                        className="aside aside-default aside-hoverable"
                        data-kt-drawer="true"
                        data-kt-drawer-name="aside"
                        data-kt-drawer-activate="{default: true, lg: false}"
                        data-kt-drawer-overlay="true"
                        data-kt-drawer-width="{default:'200px', '300px': '250px'}"
                        data-kt-drawer-direction="start"
                        data-kt-drawer-toggle="#kt_aside_toggle">
                        {/*begin::Brand*/}
                        <div
                            className="aside-logo flex-column-auto px-10 pt-9 pb-5"
                            id="kt_aside_logo">
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
                        {/*end::Brand*/}
                        {/*begin::Aside menu*/}
                        <div className="aside-menu flex-column-fluid ps-3 pe-1">
                            {/*begin::Aside Menu*/}
                            {/*begin::Menu*/}
                            <div
                                className="menu menu-sub-indention menu-column menu-rounded menu-title-gray-600 menu-icon-gray-400 menu-active-bg menu-state-primary menu-arrow-gray-500 fw-semibold fs-6 my-5 mt-lg-2 mb-lg-0"
                                id="kt_aside_menu"
                                data-kt-menu="true">
                                <div
                                    className="hover-scroll-y mx-4"
                                    id="kt_aside_menu_wrapper"
                                    data-kt-scroll="true"
                                    data-kt-scroll-activate="{default: false, lg: true}"
                                    data-kt-scroll-height="auto"
                                    data-kt-scroll-wrappers="#kt_aside_menu"
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
                                                    className={
                                                        path === "/admin/dealers" ? "menu-link active" : "menu-link"
                                                    }
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
                                                    className={
                                                        path === "/admin/users" ? "menu-link active" : "menu-link"
                                                    }
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
                                                    prefetch={false}
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
                                            {/*end:Menu item*/}
                                        </div>
                                        {/*end:Menu sub*/}
                                    </div>
                                    {/*end:Menu item*/}
                                </div>
                            </div>
                            {/*end::Menu*/}
                        </div>
                        {/*end::Aside menu*/}
                        {/*begin::Footer*/}
                        <div
                            className="aside-footer flex-column-auto pb-5 d-none"
                            id="kt_aside_footer">
                            <a
                                href="/index.html"
                                className="btn btn-light-primary w-100">
                                Button
                            </a>
                        </div>
                        {/*end::Footer*/}
                    </div>
                    {/*end::Aside*/}
                </div>
            )}
        </>
    );
};
