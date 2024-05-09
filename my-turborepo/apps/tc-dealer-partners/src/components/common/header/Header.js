"use client";
import "../../../contents/scss/header.scss";
import Link from "next/link";
import { useEffect, useState, useContext, useMemo } from "react";
import { GetDefaultImagePath } from "../defaultImage/DefaultImage";
import { LogoPath } from "../defaultImage/DefaultPaths";
import AppContext from "@/StateManagement/AppContext";
import { SanityImage } from "@/sanity/SanityImage";
import { clientAuth } from "@/services/firebase";
import { useAuth } from "@/components/auth";
import CheckLink from "../../../utils/constants/LinkCheck";
import { HeaderCloseSVG } from "../../../contents/svgs/common";
import { redirect } from "next/navigation";

export const Header = (props) => {
    const user = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolledToTop, setIsScrolledToTop] = useState(true);

    const { isHamburgerMenuOpen, setHamburgerMenuOpen } = useContext(AppContext);

    const [hostname, setHostname] = useState("");

    useEffect(() => {
        const currentHostname = window.location.hostname;
        setHostname(currentHostname);
    }, []);

    const isTHIScar = useMemo(() => {
        return hostname && (hostname === "thiscar.com" || hostname === "localhost:3000");
    }, [hostname]);

    const handleMenu = () => {
        setMenuOpen(!isMenuOpen);
        if (window.innerWidth <= 991) {
            setHamburgerMenuOpen(!isHamburgerMenuOpen);
        }
    };
    const handleLink = (e) => {
        setMenuOpen(false);
        if (window.innerWidth <= 991) {
            setHamburgerMenuOpen(!isHamburgerMenuOpen);
        }
        if (e != null && e?.target?.href?.includes("#")) {
            e.preventDefault();
        }
    };
    useEffect(() => {
        const handleTouch = (event) => {
            const targetElement = event.target;
            const isHamburgerMenu = targetElement.closest(".navbar-collapse");
            if (document.body.classList.contains("menu-open") && !isHamburgerMenu) {
                event.preventDefault();
            }
        };
        document.addEventListener("touchstart", handleTouch, { passive: false });
        return () => {
            document.removeEventListener("touchstart", handleTouch);
        };
    }, []);

    useEffect(() => {
        handleHamBurgerScrolling();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        handleHamBurgerScrolling();
    }, [isMenuOpen]);

    useEffect(() => {
        const handleOverlayClick = (event) => {
            event.preventDefault();
        };

        const overlay = document.querySelector(".overlay");
        if (overlay) {
            overlay.addEventListener("click", handleOverlayClick);
        }

        return () => {
            if (overlay) {
                overlay.removeEventListener("click", handleOverlayClick);
            }
        };
    }, []);

    const handleHamBurgerScrolling = () => {
        if (isMenuOpen) {
            document.body.classList.add("menu-open");
            document.body.style.overflow = "hidden"; // Prevent scrolling on the background content
        } else {
            document.body.classList.remove("menu-open");
            document.body.style.overflow = ""; // Restore default scrolling
        }
    };

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop === 0) {
            setIsScrolledToTop(true);
        } else {
            setIsScrolledToTop(false);
        }
    };

    return (
        <>
            <nav className={isScrolledToTop ? "navbar navbar-expand-lg" : "navbar navbar-expand-lg sticky-nav"}>
                <div className="container-fluid">
                    {user && (
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={() => handleMenu()}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    )}
                    <div className="d-flex align-items-center justify-content-between mobile-view w-100">
                        <div className="d-flex align-items-center">
                            <div key="link5">
                                <img
                                    src={GetDefaultImagePath(LogoPath)}
                                    className="logo"
                                />
                            </div>
                        </div>

                        <div className="me-1">
                            {props.offsiteText && <p className="mb-0">{props.offsiteText?.offsiteHeader?.topText}</p>}
                        </div>
                    </div>
                    <div
                        className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
                        id="navbarSupportedContent">
                        <div className="mob-menu text-center">
                            <Link
                                href={CheckLink(props.header.link5.link)}
                                onClick={handleLink}
                                passHref>
                                <div key="link5">
                                    <SanityImage
                                        src={props.header.link5.image}
                                        defaultImage={GetDefaultImagePath(LogoPath)}
                                        alt=""
                                        className="auto"
                                        sizes="100vw"
                                        style={{
                                            // width: "100%",
                                            height: "auto"
                                        }}
                                        width={138}
                                        height={52}
                                    />
                                </div>
                            </Link>
                            <span
                                className="close navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                                onClick={handleLink}>
                                {" "}
                                <HeaderCloseSVG />
                            </span>
                        </div>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                            {user ? (
                                <>
                                    <NavLink href="/cars">Shop</NavLink>
                                    <NavLink href="/wholesale">Wholesale</NavLink>
                                    <li
                                        className="nav-item"
                                        style={{ fontSize: "medium" }}>
                                        <button
                                            onClick={async () => {
                                                await clientAuth.signOut();
                                                await fetch("/api/auth", { method: "DELETE" });
                                                setMenuOpen(false);
                                                redirect("/");
                                            }}
                                            style={{ borderRadius: 999 }}
                                            className="btn btn-light d-flex align-items-center shadow-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                style={{ width: 20, height: 20, paddingRight: "4px" }}>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                                                />
                                            </svg>
                                            <span className="pl-4">{user?.email}</span>
                                        </button>
                                    </li>
                                </>
                            ) : null}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

function NavLink({ children, ...rest }) {
    return (
        <li
            className={`nav-item`}
            style={{ fontSize: "medium" }}>
            <Link
                className={`${rest.className} nav-link d-flex align-items-center`}
                {...rest}>
                {children}
            </Link>
        </li>
    );
}
