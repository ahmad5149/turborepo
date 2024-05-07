import React from "react";

export const CopyToClipboardSVG = ({ fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className="bi bi-share share-btn-visibility"
      viewBox="0 0 16 16"
    >
      <path
        d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"
        fill={fillColor || "black"}
      />
    </svg>
  );
};

export const ChatButtonSVG = () => {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.7466 15C35.4967 17.5 33.83 23.3333 31.441 26.1299L33.217 32.356C33.2438 32.45 33.227 32.5493 33.1311 32.5679C32.7653 32.6388 31.3631 32.4528 26.0522 29.5902C22.1633 31.6667 17.1633 31.6667 15.4967 29.1667"
        stroke="#1A1919"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17.6569 6.5C12.1279 6.5 8.7567 9.13043 7.3957 12.3921C6.17942 15.3069 6.60032 18.7387 8.5518 20.8347L7.30247 24.2303C6.82304 25.5334 8.21888 26.7323 9.43468 26.0617L13.8102 23.6483C14.9703 23.9859 17.8241 24.7837 20.9332 23.6476C25.1343 22.1124 27.1837 17.8314 26.7764 13.9833C26.5706 12.0392 25.7366 10.1543 24.1933 8.75468C22.6434 7.34912 20.4523 6.5 17.6569 6.5Z"
        stroke="#1A1919"
        strokeWidth="2"
      />
    </svg>
  );
};

export const FlyoutCloseSmallSVG = (props) => {
  const closeFlyout = () => {
    props.closeFlyout();
  };
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={closeFlyout}
      className="svg-close"
    >
      <path
        d="M18.668 18.6666L45.3346 45.3333"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M18.668 45.3333L45.3346 18.6666"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const FlyoutCloseMediumSVG = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.7866 26.8498V21.5019L39.7099 6.25H3.75V73.75H54.7866V69.8875"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.1549 51.1111L37.7734 66.0672L52.6502 61.9697M42.1549 51.1111L65.5909 27.6526L76.1881 38.3062L52.6502 61.9697M42.1549 51.1111L52.6502 61.9697"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8242 39.8737L25.3936 49.6036L42.1657 32.5914"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FlyoutCloseSVG = (props) => {
  const closeFlyout = () => {
    props.closeFlyout();
  };
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={closeFlyout}
      className="svg-close"
    >
      <path
        d="M18.668 18.6666L45.3346 45.3333"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M18.668 45.3333L45.3346 18.6666"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
export const FlyoutBodySVG = () => {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.7866 26.8498V21.5019L39.7099 6.25H3.75V73.75H54.7866V69.8875"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.1549 51.1111L37.7734 66.0672L52.6502 61.9697M42.1549 51.1111L65.5909 27.6526L76.1881 38.3062L52.6502 61.9697M42.1549 51.1111L52.6502 61.9697"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8242 39.8737L25.3936 49.6036L42.1657 32.5914"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const FlyoutRightArrowSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="currentColor"
      className="bi bi-arrow-right-short"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
      />
    </svg>
  );
};

export const HeaderCloseSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-x-lg"
      viewBox="0 0 16 16"
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
};

export const PopupCloseSVG = (props) => {
  const closePopup = (event) => {
    props.handleClosePopup(event);
  };

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(event) => closePopup(event)}
      className="svg-close btn-popup"
      style={{ cursor: "pointer" }}
    >
      <path
        d="M18.668 18.6666L45.3346 45.3333"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M18.668 45.3333L45.3346 18.6666"
        stroke="#2A0A4D"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};
export const PopupButtonCloseSVG = () => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7.5L17 17.5"
        stroke="#E2E42B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 17.5L17 7.5"
        stroke="#E2E42B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
export default {
  CopyToClipboardSVG,
  ChatButtonSVG,
  FlyoutCloseSmallSVG,
  FlyoutCloseMediumSVG,
  FlyoutCloseSVG,
  FlyoutBodySVG,
  FlyoutRightArrowSVG,
  HeaderCloseSVG,
  PopupCloseSVG,
  PopupButtonCloseSVG,
};
