import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import AppContext from "@/StateManagement/AppContext";

export const EditNotification = ({ setShowEdit, updateResponse }) => {
    const { notificationId } = useContext(AppContext);

    return (
        <div
            className={`modal show modal-md`}
            id="logsModal"
            style={{ display: "block" }}
            role="dialog">
            <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">Edit Notification Response</h3>
                        <button
                            onClick={() => setShowEdit(false)}
                            type="button"
                            className="close closeModal bg-transparent border-0"
                            data-bs-dismiss="modal">
                            <FontAwesomeIcon
                                icon={faXmark}
                                size="lg"
                            />
                        </button>
                    </div>
                    <div className="modal-body modal-style-body d-flex justify-content-around">
                        <button
                            onClick={() => updateResponse("accepted", notificationId)}
                            className="btn btn-success "
                            type="button">
                            Accepted
                        </button>
                        <button
                            onClick={() => updateResponse("declined", notificationId)}
                            className="btn btn-danger"
                            type="button">
                            Declined
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
