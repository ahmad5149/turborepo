import AppContext from "@/StateManagement/AppContext";
import { memo, useContext } from "react";

export const WidgetDescriptionPopup = memo(() => {
    const { widgetDetailModal, setWidgetDetailModal } = useContext(AppContext);

    const closeModal = () => {
        setWidgetDetailModal((prevState) => ({
            ...prevState,
            show: false,
            description: "",
            title: ""
        }));
        document.body.style.overflow = "auto";
    };

    return (
        <>
            {widgetDetailModal.show && (
                <div
                    className="overlay"
                    onClick={closeModal}></div>
            )}
            <div
                className={`modal fade ${widgetDetailModal.show ? "show" : ""}`}
                id="notification-response-message-modal"
                tabIndex="-1"
                aria-labelledby="notification-response-message-modal"
                style={{ display: widgetDetailModal.show ? "block" : "none" }}
                aria-hidden={!widgetDetailModal.show}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{widgetDetailModal?.title}</h5>
                            <button
                                type="button"
                                className="btn-close closeModal"
                                aria-label="Close"
                                onClick={() => {
                                    closeModal();
                                }}></button>
                        </div>
                        <div
                            className="modal-body"
                            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            <p>{widgetDetailModal?.description}</p>
                        </div>
                        <div
                            className="modal-footer"
                            style={{ justifyContent: "center" }}>
                            <button
                                type="button"
                                className="btn btn-primary custom_btn"
                                onClick={() => {
                                    closeModal();
                                }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});
