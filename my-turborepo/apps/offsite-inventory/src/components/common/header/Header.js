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
import { appConfig } from "@/appConfig";

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
    // const user = useAuth();
    // const [isMenuOpen, setMenuOpen] = useState(false);
    // const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    // const { registeredRoute } = useContext(AppContext);
    // const { isHamburgerMenuOpen, setHamburgerMenuOpen } = useContext(AppContext);

    // const [hostname, setHostname] = useState("");

    // useEffect(() => {
    //     const currentHostname = window.location.hostname;
    //     setHostname(currentHostname);
    // }, []);

    // const isTHIScar = useMemo(() => {
    //     return hostname && (hostname === "thiscar.com" || hostname === "localhost:3000");
    // }, [hostname]);

    // const [dealerConfig, setDealerConfig] = useState(null);

    // useEffect(() => {
    //     // const dealerSub = hostname.substring(0, hostname.indexOf("."));
    //     const dealerSub = window.location.pathname.split("/")[1];

    //     const fetchData = async () => {
    //         const response = await fetch(`/api/dealer/${dealerSub}`);
    //         const newData = await response.json();
    //         setDealerConfig(newData?.dealerData);
    //     };

    //     fetchData();
    // }, [hostname]);

    // const handleMenu = () => {
    //     setMenuOpen(!isMenuOpen);
    //     if (window.innerWidth <= 991) {
    //         setHamburgerMenuOpen(!isHamburgerMenuOpen);
    //     }
    // };
    // const handleLink = (e) => {
    //     setMenuOpen(false);
    //     if (window.innerWidth <= 991) {
    //         setHamburgerMenuOpen(!isHamburgerMenuOpen);
    //     }
    //     if (e != null && e?.target?.href?.includes("#")) {
    //         e.preventDefault();
    //     }
    // };
    // useEffect(() => {
    //     const handleTouch = (event) => {
    //         const targetElement = event.target;
    //         const isHamburgerMenu = targetElement.closest(".navbar-collapse");
    //         if (document.body.classList.contains("menu-open") && !isHamburgerMenu) {
    //             event.preventDefault();
    //         }
    //     };
    //     document.addEventListener("touchstart", handleTouch, { passive: false });
    //     return () => {
    //         document.removeEventListener("touchstart", handleTouch);
    //     };
    // }, []);

    // useEffect(() => {
    //     handleHamBurgerScrolling();
    //     window.addEventListener("scroll", handleScroll);
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    // useEffect(() => {
    //     handleHamBurgerScrolling();
    // }, [isMenuOpen]);

    // useEffect(() => {
    //     const handleOverlayClick = (event) => {
    //         event.preventDefault();
    //     };

    //     const overlay = document.querySelector(".overlay");
    //     if (overlay) {
    //         overlay.addEventListener("click", handleOverlayClick);
    //     }

    //     return () => {
    //         if (overlay) {
    //             overlay.removeEventListener("click", handleOverlayClick);
    //         }
    //     };
    // }, []);

    // const handleHamBurgerScrolling = () => {
    //     if (isMenuOpen) {
    //         document.body.classList.add("menu-open");
    //         document.body.style.overflow = "hidden"; // Prevent scrolling on the background content
    //     } else {
    //         document.body.classList.remove("menu-open");
    //         document.body.style.overflow = ""; // Restore default scrolling
    //     }
    // };

    // const handleScroll = () => {
    //     const scrollTop = window.pageYOffset;
    //     if (scrollTop === 0) {
    //         setIsScrolledToTop(true);
    //     } else {
    //         setIsScrolledToTop(false);
    //     }
    // };

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
                                {/* <img
                                    src={GetDefaultImagePath(LogoPath)}
                                    className="logo"
                                /> */}
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
                                    {/* <NavLink href="/cars">Shop</NavLink>
                                    <NavLink href="/wholesale">Wholesale</NavLink> */}
                                    <li
                                        className="nav-item"
                                        style={{ fontSize: "medium" }}>
                                        <button
                                            onClick={async () => {
                                                await clientAuth.signOut();
                                                await fetch("/api/auth", { method: "DELETE" });
                                                setMenuOpen(false);
                                                window.location.assign(
                                                    "/" 
                                                );
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
            {/* {registeredRoute && ( */}
            {/* <nav className={isScrolledToTop ? "navbar navbar-expand-lg" : "navbar navbar-expand-lg sticky-nav"}>
                <div className="container-fluid">
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
                    <div className="d-flex align-items-center justify-content-between mobile-view w-100">
                        {!isTHIScar && (
                            <div className="d-flex align-items-center">
                                <div key="link5"> */}
                                    {/* <img
                                        src={
                                            dealerConfig
                                                ? appConfig.GOOGLE_BUCKET_URL +
                                                  dealerConfig.bucketGUID +
                                                  "/assets/logo.png"
                                                : ""
                                        }
                                        className="logo"
                                    /> */}
                                {/* </div>

                                <a href={`tel:${dealerConfig ? dealerConfig.phone : ""}`}>
                                    <p className="my-0 ms-2 ms-sm-3 ms-lg-0">
                                        {dealerConfig ? dealerConfig.phone : ""}
                                    </p>
                                </a>
                            </div>
                        )}

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
                                passHref> */}
                                {/* <img
                src={GetImageSource(props.header.link5.image, LogoPath)}
                alt='LOGO'
                className='auto'
              /> */}
                                {/* <div key="link5">
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
                        </div> */}
                        {/* <Link href={"/"}> */}

                        {/* </Link> */}
                        {/* {isTHIScar && (
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link
                                        className="nav-link searchCars"
                                        aria-current="page"
                                        href={"#"}>
                                        Search Cars
                                    </Link>
                                </li>
                                {props.header.link1.linkText != null && props.header.link1.linkText.trim() != "" && (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            aria-current="page"
                                            href={CheckLink(props.header.link1.link)}
                                            onClick={handleLink}
                                            passHref>
                                            <b key="link1"> {props.header.link1.linkText} </b>
                                        </Link>
                                    </li>
                                )}

                                {props.header.link2.linkText != null && props.header.link2.linkText != "" && (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            href={CheckLink(props.header.link2.link)}
                                            onClick={handleLink}
                                            passHref>
                                            <b key="link2"> {props.header.link2.linkText} </b>
                                        </Link>
                                    </li>
                                )}
                                {props.header.link3.linkText != null && props.header.link3.linkText.trim() != "" && (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            href={CheckLink(props.header.link3.link)}
                                            onClick={handleLink}
                                            passHref>
                                            <b key="link3"> {props.header.link3.linkText} </b>
                                        </Link>
                                    </li>
                                )}

                                {props.header.link4.link4.linkText != null &&
                                    props.header.link4.link4.linkText.trim() != "" && (
                                        <li className="nav-item dropdown d-flex">
                                            <Link
                                                onClick={handleLink}
                                                className="nav-link"
                                                href={CheckLink(props.header.link4.link4.link)}
                                                passHref>
                                                <b key="link4"> {props.header.link4.link4.linkText}</b>
                                            </Link>

                                            <div>
                                                <a
                                                    className="nav-link dropdown-toggle"
                                                    href={"#"}
                                                    id="navbarDarkDropdownMenuLink"
                                                    role="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"></a>
                                                <ul
                                                    className="dropdown-menu"
                                                    aria-labelledby="navbarDarkDropdownMenuLink">
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            className="dropdown-item"
                                                            href={CheckLink(
                                                                props.header.link4.link4SubMenu.subLink1.link
                                                            )}
                                                            passHref>
                                                            <b key="link4Sub1">
                                                                {" "}
                                                                {props.header.link4.link4SubMenu.subLink1.linkText}
                                                            </b>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            className="dropdown-item"
                                                            href={CheckLink(
                                                                props.header.link4.link4SubMenu.subLink2.link
                                                            )}
                                                            passHref>
                                                            <b key="link4Sub2">
                                                                {" "}
                                                                {props.header.link4.link4SubMenu.subLink2.linkText}
                                                            </b>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            className="dropdown-item"
                                                            href={CheckLink(
                                                                props.header.link4.link4SubMenu.subLink3.link
                                                            )}
                                                            passHref>
                                                            <b key="link4Sub2">
                                                                {" "}
                                                                {props.header.link4.link4SubMenu.subLink3.linkText}{" "}
                                                            </b>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    )} */}

                                {/* <li className="d-flex ms-lg-4 me-lg-2 nav-item signIn">
                                    <div className="d-flex-web align-items-center justify-content-center signInHamburger">
                                        {user ? (
                                            <button
                                                title={`Sign Out ${user.displayName}`}
                                                type="button"
                                                className="nav-link signInHamburger"
                                                onClick={async () => await clientAuth.signOut()}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    class="feather feather-log-out">
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                    <polyline points="16 17 21 12 16 7"></polyline>
                                                    <line
                                                        x1="21"
                                                        y1="12"
                                                        x2="9"
                                                        y2="12"></line>
                                                </svg>
                                            </button>
                                        ) : (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M11.5054 14.96C15.0844 14.96 17.9854 12.059 17.9854 8.48C17.9854 4.901 15.0844 2 11.5054 2C7.92639 2 5.02539 4.901 5.02539 8.48C5.02539 12.059 7.92639 14.96 11.5054 14.96Z"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                                <path
                                                    d="M3 21.8331C3 21.8331 3 16.1631 9.48 14.5431"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                                <path
                                                    d="M20.5132 21.8331C20.5132 21.8331 20.5132 16.1631 14.0332 14.5431"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                            </svg>
                                        )}
                                    </div>{" "}
                                    {user ? (
                                        <button
                                            title={`Sign Out ${user.displayName}`}
                                            type="button"
                                            className="nav-link signInHamburger"
                                            onClick={async () => await clientAuth.signOut()}>
                                            {user.displayName}
                                        </button>
                                    ) : (
                                        <Link
                                            onClick={handleLink}
                                            className="nav-link signInHamburger"
                                            href="/login">
                                            Sign In
                                        </Link>
                                    )}
                                </li> */}
                            {/* </ul>
                        )}

                        {!isTHIScar && (
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="d-flex ms-lg-4 me-lg-2 nav-item signIn">
                                    <div className="d-flex-web align-items-center justify-content-center signInHamburger">
                                        {user ? (
                                            <button
                                                title={`Sign Out ${user.email}`}
                                                type="button"
                                                className="nav-link signInHamburger"
                                                onClick={async () => await clientAuth.signOut()}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    class="feather feather-log-out">
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                    <polyline points="16 17 21 12 16 7"></polyline>
                                                    <line
                                                        x1="21"
                                                        y1="12"
                                                        x2="9"
                                                        y2="12"></line>
                                                </svg>
                                            </button>
                                        ) : (
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M11.5054 14.96C15.0844 14.96 17.9854 12.059 17.9854 8.48C17.9854 4.901 15.0844 2 11.5054 2C7.92639 2 5.02539 4.901 5.02539 8.48C5.02539 12.059 7.92639 14.96 11.5054 14.96Z"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                                <path
                                                    d="M3 21.8331C3 21.8331 3 16.1631 9.48 14.5431"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                                <path
                                                    d="M20.5132 21.8331C20.5132 21.8331 20.5132 16.1631 14.0332 14.5431"
                                                    stroke="#1A1919"
                                                    strokeWidth="0.81"
                                                />
                                            </svg>
                                        )}
                                    </div>{" "}
                                    {user ? (
                                        <button
                                            title={`Sign Out ${user.email}`}
                                            type="button"
                                            className="nav-link signInHamburger"
                                            onClick={async () => await clientAuth.signOut()}>
                                            {user.email}
                                        </button>
                                    ) : (
                                        <Link
                                            onClick={handleLink}
                                            className="nav-link signInHamburger"
                                            href="/">
                                            Sign In
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        )}

                        <p className="copyrights">
                            {" "}
                            &copy;
                            {props.hamBurgerCopyRight.hamburgerCopyRightsYear}{" "}
                            {props.hamBurgerCopyRight.hamburgerCopyRightsText1}&trade;
                            {props.hamBurgerCopyRight.hamburgerCopyRightsText2}{" "}
                        </p>
                    </div>
                    <div className="tab_sign_in ms-lg-4 me-lg-2">
                        <div className="d-flex align-items-center justify-content-center"> */}
                            {/* {user ? (
                                    <button
                                        title={`Sign Out ${user.displayName}`}
                                        type="button"
                                        className="nav-link signInHamburger"
                                        onClick={async () => await clientAuth.signOut()}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            class="feather feather-log-out">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line
                                                x1="21"
                                                y1="12"
                                                x2="9"
                                                y2="12"></line>
                                        </svg>
                                    </button>
                                ) : (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M11.5054 14.96C15.0844 14.96 17.9854 12.059 17.9854 8.48C17.9854 4.901 15.0844 2 11.5054 2C7.92639 2 5.02539 4.901 5.02539 8.48C5.02539 12.059 7.92639 14.96 11.5054 14.96Z"
                                            stroke="#1A1919"
                                            strokeWidth="0.81"
                                        />
                                        <path
                                            d="M3 21.8331C3 21.8331 3 16.1631 9.48 14.5431"
                                            stroke="#1A1919"
                                            strokeWidth="0.81"
                                        />
                                        <path
                                            d="M20.5132 21.8331C20.5132 21.8331 20.5132 16.1631 14.0332 14.5431"
                                            stroke="#1A1919"
                                            strokeWidth="0.81"
                                        />
                                    </svg>
                                )} */}
                        {/* </div>{" "} */}
                        {/* {user ? (
                                <button
                                    title={`Sign Out ${user.displayName}`}
                                    type="button"
                                    className="nav-link signInHamburger"
                                    onClick={async () => await clientAuth.signOut()}>
                                    {user.displayName}
                                </button>
                            ) : (
                                <Link
                                    onClick={handleLink}
                                    className="nav-link signInHamburger"
                                    href="/login">
                                    Sign In
                                </Link>
                            )} */}
                        {/* <a
                            className="nav-link signInHamburger visibleHide"
                            href="#">
                            Hide it
                        </a>
                    </div>
                </div>
            </nav> */}
            {/* )} */}
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