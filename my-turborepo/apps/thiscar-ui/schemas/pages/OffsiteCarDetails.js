export default {
    title: "Offsite Car Details",
    name: "offsiteCarDetails",
    type: "document",
    __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Our Cars PopUp",
            name: "ourCarsPopUp",
            type: "ourCarsPopUp"
        },
        {
            title: "Car Information - Configurable Buttons",
            name: "configurableButtons",
            type: "configurableButtons"
        },
        {
            title: "Buy Now",
            name: "buyNowPopup",
            type: "buyNowPopup"
        },
        {
            title: "Confirm Availability",
            name: "confirmAvailabilityPopUp",
            type: "confirmAvailabilityPopUp"
        },
        {
            title: "Delivery Estimate",
            name: "deliveryEstimates",
            type: "deliveryEstimates"
        },
        {
            title: "Legal Mumbo Jumbo PopUp",
            name: "legalPopUp",
            type: "legalPopUp"
        },
        {
            title: "Meta Data",
            name: "metaData",
            type: "pageMetaData"
        }
    ]
};
