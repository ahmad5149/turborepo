"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "../../contents/scss/carsWeLoveForYou.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AppContext from "../../StateManagement/AppContext";
import Image from "next/image";

const CarsWeLoveForYou = ({ bodyStyleCounts, carsWeLoveForYou }) => {
    const router = useRouter();

    const [isPointMoved, setIsPointMoved] = useState(false);
    const {
        isHamburgerMenuOpen,
        setSelectedBodyStyles,
        setFilterApplied,
        filterApplied,
        setSearchBarText,
        setLinkAllCars
    } = useContext(AppContext);

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "50px",
        slidesToShow: 5,
        speed: 500,
        slidesToScroll: 1,
        initialSlide: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        pauseOnFocus: true,
        beforeChange: () => setIsPointMoved(true),
        afterChange: () => setIsPointMoved(false),
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    className: "center",
                    centerMode: true
                }
            }
        ]
    };

    const handleBodySelection = (bodyStyle) => {
        if (!filterApplied) {
            setFilterApplied(true);
        }
        setSearchBarText("");
        setLinkAllCars("");
        if (bodyStyle == "SUV" || bodyStyle == "Hatchback" || bodyStyle == "Wagon") {
            setSelectedBodyStyles(["SUV", "Hatchback", "Wagon"]);
        } else {
            setSelectedBodyStyles([bodyStyle]);
        }
        router.push("/cars", { scroll: true });
    };

    const handleClick = (value) => {
        if (!isPointMoved) {
            // Handle the click event for the carousel item at the specified index
            handleBodySelection(value);
        }
    };
    return (
        <div className="container-fluid py-5 slickSlider">
            <h1>{carsWeLoveForYou.heading}</h1>
            <p>{carsWeLoveForYou.subtext}</p>
            {isHamburgerMenuOpen && (
                <Slider {...settings}>
                    {bodyStyleCounts?.counts.map(
                        (value, index) =>
                            value.value !== "Other" && (
                                <div
                                    key={index}
                                    onClick={() => handleClick(value.value)}>
                                    <div className="car-slider">
                                        <div className="carDetail">
                                            <h5 className="text-center">{value.value}s</h5>
                                            <Image
                                                src={`/media/${value.value.toLowerCase()}.png`}
                                                alt="SUV"
                                                className="slider_image"
                                                width={1000}
                                                height={900}></Image>
                                            <span>{value.count ? value.count.toLocaleString() : 0} found</span>
                                        </div>
                                    </div>
                                </div>
                            )
                    )}
                </Slider>
            )}
        </div>
    );
};

export default CarsWeLoveForYou;
