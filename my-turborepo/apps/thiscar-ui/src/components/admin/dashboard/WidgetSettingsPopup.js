import AppContext from "@/StateManagement/AppContext";
import { memo, useContext } from "react";

export const WidgetSettingsPopup = memo(({ children }) => {
    const { showSpecificWidgetSettings, setShowSpecificWidgetSettings } = useContext(AppContext);

    const closeModal = () => {
        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: false,
            label: "",
            title: ""
        }));
        document.body.style.overflow = "auto";
    };

    return (
        <>
            {showSpecificWidgetSettings.show && (
                <div
                    className="overlay"
                    onClick={closeModal}></div>
            )}
            <div
                className={`modal fade ${showSpecificWidgetSettings.show ? "show" : ""}`}
                id="notification-response-message-modal"
                tabIndex="-1"
                aria-labelledby="notification-response-message-modal"
                style={{ display: showSpecificWidgetSettings.show ? "block" : "none" }}
                aria-hidden={!showSpecificWidgetSettings.show}>
                <div className="modal-dialog modal-dialog-centered ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{showSpecificWidgetSettings?.title}</h5>
                            <button
                                type="button"
                                className="btn-close closeModal"
                                aria-label="Close"
                                onClick={() => {
                                    closeModal();
                                }}></button>
                        </div>
                        <div
                            className="modal-body pb-0"
                            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});
