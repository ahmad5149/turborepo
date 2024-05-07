"use client";
import Link from "next/link";
import "../../../contents/scss/footer.scss";
import { GetDefaultImagePath } from "../defaultImage/DefaultImage";
import { ChatImagePath, FacebookPath, InstaPath, LogoPath } from "../defaultImage/DefaultPaths";
import React, { useEffect, useContext } from "react";
import AppContext from "@/StateManagement/AppContext";
import { SanityImage } from "@/sanity/SanityImage";
import CheckLink from "../../../utils/constants/LinkCheck";
import { appConfig } from "@/appConfig";

const Footer = (props) => {
    const { registeredRoute, openQoreAI, loadQoreAI, setQoreAIActivated } = useContext(AppContext);
    const thisCarAdminUrl = appConfig.ADMIN_URL;
    const handleLink = (e) => {
        if (e != null && e?.target?.href?.includes("#")) {
            e?.preventDefault();
            return;
        }
    };
    useEffect(() => {
        loadQoreAI();
        setQoreAIActivated(false);
    }, []);

    return (
        <>
            {registeredRoute && (
                <div className="container-fluid footer_bg py-4">
                    <div className="container-fluid p-lg-5 p-sm-0">
                        <div className="row pt-4 ">
                            <div className="col-lg-6 col-sm-6 col-md-6 container-custom admin-sign-in-footer">
                                <Link
                                    className="d-flex"
                                    onClick={handleLink}
                                    href={CheckLink(props.headerData?.link5?.link)}
                                    passHref>
                                    {/* <img
                  src={GetImageSource(props.headerData.link5.image, LogoPath)}
                  alt=""
                /> */}
                                    <div key="link5">
                                        <SanityImage
                                            src={props.headerData.link5.image}
                                            defaultImage={GetDefaultImagePath(LogoPath)}
                                            alt=""
                                            className="footer-logo-image"
                                            width={240}
                                            height={150}
                                        />
                                    </div>
                                </Link>

                                <div className="row mt-3">
                                    <div className="col-sm-6 col-5">
                                        <ul className="p-0">
                                            {props.headerData?.link1?.linkText != null &&
                                                props.headerData?.link1?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.headerData?.link1?.link)}
                                                            passHref>
                                                            <React.Fragment key="link1">
                                                                {props.headerData?.link1?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.headerData?.link2?.linkText != null &&
                                                props.headerData?.link2?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.headerData?.link2?.link)}
                                                            passHref>
                                                            <React.Fragment key="link2">
                                                                {props.headerData?.link2?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.headerData?.link3?.linkText != null &&
                                                props.headerData?.link3?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.headerData?.link3?.link)}
                                                            passHref>
                                                            <React.Fragment key="link3">
                                                                {props.headerData?.link3?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.headerData?.link4?.link4?.linkText != null &&
                                                props.headerData?.link4?.link4?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.headerData?.link4?.link4?.link)}
                                                            passHref>
                                                            <React.Fragment key="link4">
                                                                {props.headerData?.link4?.link4?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.footerData?.link5?.linkText != null &&
                                                props.footerData?.link5?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link5?.link)}
                                                            passHref>
                                                            <React.Fragment key="link5">
                                                                {" "}
                                                                {props.footerData?.link5?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.footerData?.link6?.linkText != null &&
                                                props.footerData?.link6?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link6?.link)}
                                                            passHref>
                                                            <React.Fragment key="link6">
                                                                {" "}
                                                                {props.footerData?.link6?.linkText}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                        </ul>
                                    </div>
                                    <div className="col-5">
                                        <ul className="p-0">
                                            {props.footerData?.link1?.linkText != null &&
                                                props.footerData?.link1?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link1?.link)}
                                                            passHref>
                                                            <React.Fragment key="link1">
                                                                {" "}
                                                                {props.footerData?.link1?.linkText}{" "}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.footerData?.link2?.linkText != null &&
                                                props.footerData?.link2?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link2?.link)}
                                                            passHref>
                                                            <React.Fragment key="link2">
                                                                {" "}
                                                                {props.footerData?.link2?.linkText}{" "}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.footerData?.link3?.linkText != null &&
                                                props.footerData?.link3?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link3?.link)}
                                                            passHref>
                                                            <React.Fragment key="link3">
                                                                {" "}
                                                                {props.footerData?.link3?.linkText}{" "}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                            {props.footerData?.link4?.linkText != null &&
                                                props.footerData?.link4?.linkText?.trim() != "" && (
                                                    <li>
                                                        <Link
                                                            onClick={handleLink}
                                                            href={CheckLink(props.footerData?.link4?.link)}
                                                            passHref>
                                                            <React.Fragment key="link4">
                                                                {" "}
                                                                {props.footerData?.link4?.linkText}{" "}
                                                            </React.Fragment>
                                                        </Link>
                                                    </li>
                                                )}
                                        </ul>
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    {/* <div className="col-lg-9">
                                        <input
                                            type="email"
                                            placeholder={props?.footerData?.footerSearchFieldText ?? ""}
                                            className="d-flex w-100 rounded-pill py-2 px-3"
                                        />
                                    </div>
                                    <div className="col-lg-3 mt-3 mt-lg-0 mob-display ">
                                        <div className="row">
                                            <div className="col-lg-12 d-flex mobile-center">
                                                <span>
                                                    {props.footerData.facebookLink?.link != null && (
                                                        <Link
                                                            href={props.footerData.facebookLink?.link}
                                                            className="ms-2">

                                                            <SanityImage
                                                                src={props.footerData.facebookLink.image}

                                                                defaultImage={GetDefaultImagePath(FacebookPath)}
                                                                alt=""
                                                                width={45}
                                                                height={45}
                                                                className="footer-social-media-image"
                                                            />
                                                        </Link>
                                                    )}
                                                </span>
                                                <span>
                                                    {props.footerData.instagramLink?.link != null && (
                                                        <Link
                                                            href={props.footerData.instagramLink?.link}
                                                            className="ms-2">

                                                            <SanityImage
                                                                // src={urlFor(
                                                                //   props.footerData.instagramLink?.image
                                                                // ).url()}
                                                                src={props.footerData.instagramLink.image}
                                                                defaultImage={GetDefaultImagePath(InstaPath)}
                                                                alt=""
                                                                width={45}
                                                                height={45}
                                                                className="footer-social-media-image"
                                                            />
                                                        </Link>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="mobile-display text-start">
                                    <span className="copy_right">
                                        &copy; {props.footerData.copyRightsText1}&trade;
                                        {props.footerData.copyRightsText2}{" "}
                                        {props.footerData.termsConditions?.linkText != null &&
                                            props.footerData.termsConditions?.linkText?.trim() != "" && (
                                                <Link
                                                    onClick={handleLink}
                                                    href={CheckLink(props.footerData.termsConditions?.link)}
                                                    passHref>
                                                    <React.Fragment key="termsCondition">
                                                        {" "}
                                                        {props.footerData.termsConditions?.linkText}
                                                    </React.Fragment>
                                                </Link>
                                            )}
                                    </span>
                                </div>
                            </div>
                            {/* <div
                                className="col-lg-6 col-sm-6 col-md-6 admin-sign-in"
                                // style={{
                                //     display: "flex",
                                //     justifyContent: "end",
                                //     alignItems: "flex-start"
                                //     // position: "relative"
                                // }}
                            >
                                <Link
                                    className="d-flex link"
                                    onClick={handleLink}
                                    href={CheckLink(props.headerData?.link3?.link)}>
                                    <span className="hoverable-text">login</span>
                                </Link>
                            </div> */}
                            <div className="col-lg-6 col-sm-6 col-md-6 admin-sign-in">
                                <div className="d-flex">
                                    <span
                                        className="d-flex link"
                                        onClick={() => {
                                            // window.location.href = thisCarAdminUrl;
                                            window.open(thisCarAdminUrl, "_blank");
                                        }}>
                                        <span className="hoverable-text">Sign In</span>
                                    </span>
                                </div>
                            </div>
                            <div
                                className="col-sm-6"
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "flex-start"
                                }}>
                                <div className="col-lg-3 mt-3 mt-lg-0 tab-display btm-right-in mb-3">
                                    <div className="row">
                                        <div className="col-lg-12 d-flex tab-right">
                                            {/* <span>login</span> */}
                                            <span>
                                                {props.footerData.facebookLink?.linkText != null && (
                                                    <Link
                                                        onClick={handleLink}
                                                        href={CheckLink(props.footerData.facebookLink?.link)}
                                                        passHref>
                                                        <SanityImage
                                                            key="facebookLink"
                                                            src={props.footerData.facebookLink.image}
                                                            defaultImage={GetDefaultImagePath(FacebookPath)}
                                                            alt=""
                                                            width={45}
                                                            height={45}
                                                            className="footer-social-media-image-tab"
                                                        />
                                                    </Link>
                                                )}
                                            </span>
                                            <span>
                                                {props.footerData.instagramLink?.linkText != null && (
                                                    <Link
                                                        onClick={handleLink}
                                                        href={CheckLink(props.footerData.instagramLink?.link)}
                                                        passHref>
                                                        <SanityImage
                                                            key="instagramLink"
                                                            // src={urlFor(
                                                            //   props.footerData.instagramLink?.image
                                                            // ).url()}
                                                            src={props.footerData.instagramLink.image}
                                                            defaultImage={GetDefaultImagePath(InstaPath)}
                                                            alt=""
                                                            width={45}
                                                            height={45}
                                                            className="footer-social-media-image-tab"
                                                        />
                                                    </Link>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 main_display">
                                <div className="text-center">
                                    <span className="copy_right">
                                        &copy; {props.footerData.copyRightsText1}&trade;
                                        {props.footerData.copyRightsText2}{" "}
                                        {props.footerData.termsConditions?.linkText != null &&
                                            props.footerData.termsConditions?.linkText?.trim() != "" && (
                                                <Link
                                                    onClick={handleLink}
                                                    href={CheckLink(props.footerData.termsConditions?.link)}
                                                    passHref>
                                                    <React.Fragment key="instagramLink">
                                                        {" "}
                                                        {props.footerData.termsConditions?.linkText}
                                                    </React.Fragment>
                                                </Link>
                                            )}
                                    </span>
                                </div>
                                {/* <div className='row mt-2 py-4'>
                  <div className='col-sm-12 text-center'>
                    <span className='copy_right'>
                      &copy; {props.footerData.copyRightsText1}&trade;
                      {props.footerData.copyRightsText2}{" "}
                      <Link href={props.footerData.termsConditions?.link}>
                        {props.footerData.termsConditions?.linkText}
                      </Link>
                    </span>{" "}
                  </div>
                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
