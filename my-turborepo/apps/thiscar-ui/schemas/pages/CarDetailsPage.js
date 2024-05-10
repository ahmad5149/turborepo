export default {
    title: "Car Details",
    name: "carDetails",
    type: "document",
    __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Delivery Estimate",
            name: "deliveryEstimates",
            type: "deliveryEstimates"
        },
        {
            title: "Our Cars PopUp",
            name: "ourCarsPopUp",
            type: "ourCarsPopUp"
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
        },
        {
            title: "Notes Section - VDP",
            name: "notesSection",
            type: "notesSection"
        },
        {
            title: "Car Information - section",
            name: "carInformation",
            type: "carInformation"
        },
        {
            title: "Confirm Availability",
            name: "confirmAvailabilityPopUp",
            type: "confirmAvailabilityPopUp"
        }
    ]
};
