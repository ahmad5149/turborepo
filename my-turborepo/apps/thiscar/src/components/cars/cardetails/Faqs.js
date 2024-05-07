"use client";
import React, { useState } from "react";
import Faq from "../../faq/Faq";
import "../../../contents/scss/faq.scss";

function Faqs(props) {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleClick = () => {
        setButtonDisabled(true);
    };

    return (
        <div>
            <div className="py-5">
                <h2 className="d-flex justify-content-start pb-3">FAQ</h2>
                <div
                    className="accordion accordion-faq"
                    id="accordionExampleFAQ">
                    {props?.faq?.faqInformation?.faqList?.slice(0, 5).map(
                        (
                            item,
                            index // Use the slice method to show only five FAQs
                        ) => (
                            <Faq
                                key={index}
                                index={index}
                                item={item}
                                id={"#accordionExampleFAQ"}
                            />
                        )
                    )}
                </div>
                <div className="sp-btn">
                    {" "}
                    <button
                        className="btn btn-sm custom_btn mt-3"
                        disabled={buttonDisabled}
                        onClick={() => {
                            handleClick();
                            const faqContainer = document.getElementById("accordionExampleFAQ");
                            faqContainer.innerHTML = ""; // Clear the existing FAQs

                            props?.faq?.faqInformation?.faqList?.map((item, index) => {
                                const accordionItem = document.createElement("div");
                                accordionItem.className = "accordion-item";
                                accordionItem.key = index;

                                const accordionHeader = document.createElement("h2");
                                accordionHeader.className = "accordion-header";
                                accordionHeader.id = `heading-${index}`;

                                const accordionButton = document.createElement("button");
                                accordionButton.className = "accordion-button collapsed";
                                accordionButton.type = "button";
                                accordionButton.dataset.bsToggle = "collapse";
                                accordionButton.dataset.bsTarget = `#collapse-${index}`;
                                accordionButton.setAttribute("aria-expanded", "false");
                                accordionButton.setAttribute("aria-controls", `collapse-${index}`);
                                accordionButton.innerText = item.heading;

                                accordionHeader.appendChild(accordionButton);
                                accordionItem.appendChild(accordionHeader);

                                const accordionCollapse = document.createElement("div");
                                accordionCollapse.id = `collapse-${index}`;
                                accordionCollapse.className = "accordion-collapse collapse";
                                accordionCollapse.setAttribute("aria-labelledby", `heading-${index}`);
                                accordionCollapse.dataset.bsParent = "#accordionExampleFAQ";

                                const accordionBody = document.createElement("div");
                                accordionBody.className = "accordion-body";
                                accordionBody.innerHTML = `<p>${item.description}</p>`;

                                accordionCollapse.appendChild(accordionBody);
                                accordionItem.appendChild(accordionCollapse);

                                faqContainer.appendChild(accordionItem);
                            });
                        }}>
                        See Full FAQ
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            className="bi bi-arrow-right-short"
                            viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Faqs;
