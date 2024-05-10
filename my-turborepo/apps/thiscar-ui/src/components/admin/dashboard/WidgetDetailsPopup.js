import AppContext from "@/StateManagement/AppContext";
import { memo, useContext } from "react";

export const WidgetDetailsPopup = memo(({ children }) => {
    const { showSpecificWidgetDetails, setShowSpecificWidgetDetails } = useContext(AppContext);

    const closeModal = () => {
        setShowSpecificWidgetDetails((prevState) => ({
            ...prevState,
            show: false,
            label: "",
            title: ""
        }));
        document.body.style.overflow = "auto";
    };

    return (
        <>
            <div
                className="modal-body pb-0"
                style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
                {children}
            </div>
        </>
    );
});
