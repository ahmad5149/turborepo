"use client";
import { useContext, useState } from "react";
import "../../../contents/admin/scss/widgetsSettings.scss";
import AppContext from "@/StateManagement/AppContext";
import { useAuth } from "../../../components/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const WidgetsSettings = () => {
    const { setWidgets, widgets } = useContext(AppContext);
    const [showSettings, setShowSettings] = useState(true);
    const currentUser = useAuth();
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleCheckboxChange = (widgetId) => {
        const getItems = localStorage.getItem("widgetSettings");
        const settingDoc = JSON.parse(getItems);

        setWidgets((prevWidgets) => {
            const updatedWidget = prevWidgets.map((widget) => {
                if (widget.id === widgetId) {
                    return { ...widget, visibility: !widget.visibility };
                }
                return widget;
            });
            const updatedSettings = {
                ...settingDoc,
                widgets: updatedWidget
            };
            const stringifySettings = JSON.stringify(updatedSettings);
            (async function () {
                const response = await fetch(`/api/widget-settings`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${currentUser?.getIdToken()}`
                    },
                    body: stringifySettings
                });
                if (!response.ok) {
                    toast.error(`HTTP error! Status: ${response.status}`);
                }
            })();

            localStorage.setItem("widgetSettings", JSON.stringify(updatedSettings));

            return updatedWidget;
        });
    };

    return (
        <div>
            <div
                style={{ right: showSettings ? "-250px" : "0" }}
                className="settings-wrapper row bg-white h-100 shadow position-fixed rounded">
                <div>
                    <div
                        className="btn btn-icon btn-active-color-primary ms-n15 mt-n3"
                        id="mt_aside_toggle">
                        <i
                            className={`bi ${showSettings ? "bi-list" : "bi-x-square"}`}
                            onClick={toggleSettings}></i>
                    </div>
                    <div className="col">
                        <h3 className="text-center pt-2">Widgets Settings</h3>
                        <div className="pt-5 ps-5">
                            {widgets?.map((widget) => (
                                <label
                                    key={widget.id}
                                    className="cursor-pointer form-check form-switch form-switch-sm form-check-custom form-check-solid pb-5">
                                    <input
                                        id={widget.label}
                                        className="form-check-input cursor-pointer"
                                        type="checkbox"
                                        name={widget.label}
                                        checked={widget.visibility}
                                        onChange={() => handleCheckboxChange(widget.id)}
                                    />
                                    <span className="form-check-label text-gray-700 fs-6 fw-semibold ms-0 ms-3">
                                        {widget?.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
