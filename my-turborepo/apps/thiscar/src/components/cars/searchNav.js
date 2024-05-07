"use client";
import "../../contents/scss/searchNav.scss";
import "@/contents/scss/CarDetails.scss";
import { useContext, useState, useEffect } from "react";
import AppContext from "../../StateManagement/AppContext";
import { SearchNavISVG, SearchNavSearchSVG } from "../../contents/svgs/cars";

const SearchNav = (props) => {
    const { searchBarText, setSearchBarText, setLinkAllCars } = useContext(AppContext);
    const [isSticky, setIsSticky] = useState(false);

    const handleSearch = () => {
        setSearchBarText(searchBarText);
        setLinkAllCars(searchBarText);
    };

    const removeSearchText = () => {
        setSearchBarText("");
        setLinkAllCars("");
    };

    const handleInputChange = (event) => {
        setSearchBarText(event.target.value);
    };

    const handleKeyPress = () => {
        props.ClearAllStates();
        handleSearch();
    };

    // const handleScroll = () => {
    //     const scrollPosition = window.scrollY;
    //     const threshold = 30; // Adjust this value based on when you want the search bar to stick

    //     setIsSticky(scrollPosition > threshold);
    // };

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    return (
        <div className="sticky-menu">
            <section>
                <div className="row height d-flex ">
                    <div className="col-lg-12 search-menus d-flex pt-4 ">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-9 d-flex search-div ">
                            <div className="tab-line d-flex align-items-center me-4">
                                <span
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">
                                    <SearchNavISVG />
                                </span>
                            </div>
                            <div className="search ">
                                <SearchNavSearchSVG />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Make, Model, or Keyword"
                                    value={searchBarText}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleKeyPress();
                                        }
                                    }}
                                />
                            </div>
                            <div className="modal-header buttonContainer-search">
                                <button
                                    type="button"
                                    className="btn-close  closeButton-search"
                                    onClick={() => {
                                        removeSearchText();
                                    }}></button>
                            </div>
                            <button
                                className="btn  custom_btn custom_search_btn mobile-d-ser"
                                onClick={() => {
                                    handleKeyPress();
                                }}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SearchNav;
