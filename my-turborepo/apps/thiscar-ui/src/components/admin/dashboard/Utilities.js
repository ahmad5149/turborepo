export const fetchWidgetSettings = () => {
    const getItems = localStorage.getItem("widgetSettings");
    return JSON.parse(getItems);
};
