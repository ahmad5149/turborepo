import React from "react";
import "../../../contents/scss/CarDetails.scss";

const NotesSection = (notesSection) => {
    var notesSection = notesSection.notesSection;
    return (
        <>
            {notesSection && (
                <section>
                    <div className="notesSection mb-3 d-flex justify-content-start bg-white">
                        <div className="col-md-12 col-md-12 col-sm-12 col-12 row">
                            <div className="mt-1">
                                <h1 className="heading-notes">{notesSection.notesHeading}</h1>
                            </div>
                            <div>
                                {notesSection.paragraphs &&
                                    notesSection.paragraphs.map((section, index) => (
                                        <div key={index}>
                                            {section.content.map((block, blockIndex) => {
                                                if (block._type === "block") {
                                                    return (
                                                        <p key={blockIndex}>
                                                            {block.children.map((span, spanIndex) => {
                                                                const classNames = [];

                                                                if (span.marks) {
                                                                    span.marks.forEach((mark) => {
                                                                        if (mark === "strong") {
                                                                            classNames.push("bold");
                                                                        } else if (mark === "em") {
                                                                            classNames.push("emphasized");
                                                                        }
                                                                    });
                                                                    classNames.push("car-details-font");
                                                                }
                                                                return (
                                                                    <span
                                                                        key={spanIndex}
                                                                        className={classNames.join(" ")}>
                                                                        {span.text}
                                                                    </span>
                                                                );
                                                            })}
                                                        </p>
                                                    );
                                                } else if (block._type === "list") {
                                                    return (
                                                        <ul key={blockIndex}>
                                                            {block.items.map((item, itemIndex) => (
                                                                <li
                                                                    className="car-details-font"
                                                                    key={itemIndex}>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default NotesSection;
