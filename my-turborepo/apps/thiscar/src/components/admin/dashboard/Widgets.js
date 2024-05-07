"use client";
import React, { Fragment, useContext, useState, useEffect } from "react";
import { NotificationsCount } from "./NotificationsCount/NotificationsCount";
import { NotificationsCountFilters } from "./NotificationsCount/partials/NotificationsCountFilters";
import HiddenCarSummary from "./HiddenCar/HiddenCarSummary";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Column } from "./Column";
import "react-toastify/dist/ReactToastify.css";
import { WidgetsSettings } from "./WidgetsSettings";
import AppContext from "@/StateManagement/AppContext";
import { NotificationResponseByDealer } from "./NotificationResponse/NotificationResponseByDealer";
import { NotificationResponseBar } from "./NotificationResponseBar/NotificationResponseBar";
import { WidgetDescriptionPopup } from "./WidgetDescriptionPopup";
import { WidgetSettingsPopup } from "./WidgetSettingsPopup";
import { DealerResponseFilters } from "./NotificationResponse/partials/DealerResponseFilters";
import { HiddenCarSummaryFilters } from "./HiddenCar/partials/HiddenCarSummaryFilters";
import { CarsAddedAndRemove } from "./CarsAddedAndRemovedSummary/partials/CarsAddedAndRemoved";
import CarsAddedAndRemovedSummary from "./CarsAddedAndRemovedSummary/CarsAddedAndRemovedSummary";
import { DealerResponseBarFilters } from "./NotificationResponseBar/partials/DealerResponseBarFilters";
import { PriceChangeFilters } from "./PriceChange/partials/PriceChangeFilters";
import { PriceChange } from "./PriceChange/PriceChange";
import AverageResponseTimeForHoldAndPurchase from "./AverageResponseTimeHoldPurchase/AverageResponseTimeForHoldAndPurchase";
import { AverageResponseTime } from "./AverageResponseTimeHoldPurchase/partials/AverageResponseTime";
import { ChangeListPopup } from "./PriceChange/partials/ChangeListPopup";
import { WidgetDetailsPopup } from "./WidgetDetailsPopup";
import { _24HourHoldWidget } from "./_24HourHoldWidget/_24HourHoldWidget";
import { _24HourHoldFilters } from "./_24HourHoldWidget/partials/_24HourHoldFilters";
import InventoryOperationsReport from "./InventoryOperations/InventoryOperationsReport";
import { InventoryOperationsReportFilters } from "./InventoryOperations/partials/InventoryOperationsReportFilters";
import { useAuth } from "../../../components/auth";
import { toast } from "react-toastify";

export const Widgets = ({ dealerOptions }) => {
    const { setWidgets, widgets, showSpecificWidgetSettings, showSpecificWidgetDetails } = useContext(AppContext);

    const currentUser = useAuth();
    const moveColumn = async (dragIndex, hoverIndex) => {
        const dragColumn = widgets[dragIndex];
        const newColumns = [...widgets];
        newColumns.splice(dragIndex, 1);
        newColumns.splice(hoverIndex, 0, dragColumn);

        const getItems = localStorage.getItem("widgetSettings");
        const settingDoc = JSON.parse(getItems);
        const updatedSettings = {
            ...settingDoc,
            widgets: newColumns
        };

        setWidgets(newColumns);
        const stringifySettings = JSON.stringify(updatedSettings);
        localStorage.setItem("widgetSettings", stringifySettings);

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
    };

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                {widgets?.map(
                    (widget, index) =>
                        widget.visibility && (
                            <Fragment key={widget.id}>
                                <Column
                                    key={widget.id}
                                    id={widget.id}
                                    index={index}
                                    moveColumn={moveColumn}>
                                    {widget.label === "NotificationsCount" && <NotificationsCount />}
                                    {widget.label === "HiddenCarSummary" && <HiddenCarSummary />}
                                    {widget.label === "InventoryOperationsReport" && <InventoryOperationsReport />}
                                    {widget.label === "PriceChange" && <PriceChange />}
                                    {widget.label === "CarsAddedAndRemovedSummaryWrapper" && (
                                        // <CarsAddedAndRemovedSummaryWrapper />
                                        <CarsAddedAndRemovedSummary />
                                    )}
                                    {widget.label === "NotificationResponseByDealer" && (
                                        <NotificationResponseByDealer dealerOptions={dealerOptions} />
                                    )}
                                    {widget.label === "NotificationResponseBar" && <NotificationResponseBar />}
                                    {widget.label === "AverageResponseTimeHoldPurchase" && (
                                        <AverageResponseTimeForHoldAndPurchase dealerOptions={dealerOptions} />
                                    )}
                                    {widget.label === "_24HourHoldWidget" && (
                                        <_24HourHoldWidget dealerOptions={dealerOptions} />
                                    )}
                                </Column>
                            </Fragment>
                        )
                )}
            </DndProvider>
            <WidgetsSettings />
            <WidgetDescriptionPopup />
            <WidgetSettingsPopup>
                {showSpecificWidgetSettings?.label === "NotificationResponseByDealer" && <DealerResponseFilters />}
                {showSpecificWidgetSettings?.label === "HiddenCarSummary" && <HiddenCarSummaryFilters />}
                {showSpecificWidgetSettings?.label === "InventoryOperationsReport" && (
                    <InventoryOperationsReportFilters />
                )}
                {showSpecificWidgetSettings?.label === "CarsAddedAndRemovedSummaryWrapper" && <CarsAddedAndRemove />}
                {showSpecificWidgetSettings?.label === "NotificationsCount" && <NotificationsCountFilters />}
                {showSpecificWidgetSettings?.label === "DealerResponseBarFilters" && (
                    <DealerResponseBarFilters dealerOptions={dealerOptions} />
                )}
                {showSpecificWidgetSettings?.label === "PriceChange" && <PriceChangeFilters />}
                {showSpecificWidgetSettings?.label === "AverageResponseTimeHoldPurchase" && <AverageResponseTime />}
                {showSpecificWidgetSettings?.label === "_24HourHoldWidget" && (
                    <_24HourHoldFilters dealerOptions={dealerOptions} />
                )}
            </WidgetSettingsPopup>
            <WidgetDetailsPopup>
                {showSpecificWidgetDetails?.label === "PriceChange" && <ChangeListPopup />}
            </WidgetDetailsPopup>
        </>
    );
};
