"use client";
import Link from "next/link";
import "../../contents/scss/home.scss";
import { appConfig } from "../../appConfig";

const ButtonSection = () => {
    const dealerId = appConfig.DEALER_ID;
    const url = `https://www.routeone.net/digital-retail-ui/?dealerId=${dealerId}`;

    const handleFinancingInfo = () => {
        window.open(url, "_blank");
    };

    return (
        <div className="buttonSection container-fluid">
            <Link
                href="/sell-trade"
                passHref>
                <button className="mt-3 mb-2 btn btn-sm custom_btn custom-btn-fill">
                    <span>Sell us Your Car</span>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle
                            cx="24"
                            cy="24"
                            r="17"
                            stroke="#E2E42B"
                            strokeWidth="2"
                        />
                        <path
                            d="M28 20C28 18.6667 26.6667 16.6667 24 16.6667C21.3333 16.6667 19.9992 18.6667 20 20C20.0008 21.3333 20.2667 23.4667 24 24C27.7333 24.5333 28 26.6667 28 28C28 29.3333 27.3325 31.3333 24 31.3333C20.7559 31.3333 20 29.3333 20 28"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M24 16.6667V14"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M24 31.3333V34"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </Link>
            <Link
                href="/cars"
                passHref>
                <button className="mt-1 mb-2 mt-md-5 btn btn-sm custom_btn custom-btn-fill">
                    <span>Buy a Car</span>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M34 32.5V35.5C34 36.6046 34.8954 37.5 36 37.5H39C40.1046 37.5 41 36.6046 41 35.5V29.5"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M7 29.5V35.5C7 36.6046 7.89543 37.5 9 37.5H12C13.1046 37.5 14 36.6046 14 35.5V32.5"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M39 31.5H9C7.89543 31.5 7 30.6046 7 29.5V24.9853C7 23.394 7.63214 21.8679 8.75736 20.7426L12 17.5H36L39.2426 20.7426C40.3679 21.8679 41 23.394 41 24.9853V29.5C41 30.6046 40.1046 31.5 39 31.5Z"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.5 17.5L12.6325 14.1026C13.4491 11.6526 15.742 10 18.3246 10H29.6754C32.258 10 34.5509 11.6526 35.3675 14.1026L36.5 17.5"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.5 14.5H7.5C6.11929 14.5 5 15.6193 5 17V17C5 18.3807 6.11929 19.5 7.5 19.5H9.5"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M36 14.5H41C42.3807 14.5 43.5 15.6193 43.5 17V17C43.5 18.3807 42.3807 19.5 41 19.5H38"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M32 24H36.5"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.5 24H16"
                            stroke="#E2E42B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </Link>

            <button
                onClick={handleFinancingInfo}
                className="mt-1 mb-2 mt-md-5 btn btn-sm custom_btn custom-btn-fill">
                <span>Get Pre-Approved</span>
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 24.9091L19.8125 34L37 14"
                        stroke="#E2E42B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button
                onClick={() => (window.location.href = "tel:800-844-7227")}
                className="mt-1 mb-3 mt-md-5 btn btn-sm custom_btn custom-btn-fill">
                <span>Click To Call</span>
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                        cx="24"
                        cy="24"
                        r="17"
                        stroke="#E2E42B"
                        strokeWidth="2"
                    />
                    <path
                        d="M24 21V32"
                        stroke="#E2E42B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle
                        cx="24"
                        cy="16"
                        r="1"
                        fill="#E2E42B"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ButtonSection;
