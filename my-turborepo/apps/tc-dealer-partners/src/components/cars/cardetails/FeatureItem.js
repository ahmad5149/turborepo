"use client";
import { useState, useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../../../StateManagement/AppContext";

function FeatureItem({ index, items, values }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFeatureArea, setShowFeatureArea] = useState(false);
    const { featureItemVisible, setFeatureItemVisible } = useContext(AppContext);
    const btnRef = useRef(null);

    useEffect(() => {
        if (showFeatureArea) {
            setFeatureItemVisible(index);
        }

        if (!showFeatureArea && featureItemVisible != index && featureItemVisible != -1) {
            const element = document.getElementById(`toggleBtn-${featureItemVisible}`);
            const yCoordinate = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(500, yCoordinate - 100);
        }
    }, [showFeatureArea]);

    useEffect(() => {
        if (featureItemVisible != index) {
            setShowFeatureArea(false);
        }
    }, [featureItemVisible]);

    const capitalizeText = (text) => {
        if (text != null && text != "") {
            const lowercaseText = text.toLowerCase();
            const words = lowercaseText.split(" ");
            const capitalizedWords = words.map((word) => {
                if (word === "and") {
                    return word; // Skip capitalizing "and"
                } else {
                    const firstChar = word.charAt(0).toUpperCase();
                    const restOfWord = word.slice(1);
                    return `${firstChar}${restOfWord}`;
                }
            });
            return capitalizedWords.join(" ");
        }
    };

    const capitalizedText = capitalizeText(items);
    const toggleAccordion = () => {
        setShowFeatureArea(!showFeatureArea);
    };
    return (
        <div
            className="accordion-item mt-3 p-2"
            key={`keys-${index}`}>
            <h2
                className="accordion-header"
                id={`headings-${index}`}>
                <button
                    id={`toggleBtn-${index}`}
                    className="accordion-button collapsed"
                    type="button"
                    onClick={toggleAccordion}>
                    <span className="left-heading">{capitalizedText}</span>
                    {values.length > 0 && !showFeatureArea && (
                        <span className="right-heading car-details-font">{values[0]}</span>
                    )}
                    <FontAwesomeIcon icon={showFeatureArea ? faAngleDown : faAngleRight} />
                </button>
            </h2>
            <div
                id={`collaps-${index}`}
                className={`accordion-collapse collapse ${showFeatureArea ? "show" : ""}`}>
                <div className="accordion-body">
                    <div className="justify-content-between list_detail_product">
                        <ul className={values.length > 2 ? "list-inline ps-4" : "list-inline-less-3 ps-4"}>
                            {values.map((value, index) => (
                                <li key={index}>{value}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureItem;
