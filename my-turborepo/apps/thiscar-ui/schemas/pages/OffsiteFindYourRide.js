export default {
    title: "Offsite - Find Your Ride",
    name: "offsiteFindYourRide",
    type: "document",
    __experimental_actions: ["update", "create", "delete", "publish"],
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Contact Details Text",
            name: "contactDetailsText",
            description: "Enter the text for contact details on car tiles",
            type: "string"
        },
        {
            title: "Marketing Tiles Offsite SRP",
            name: "marketingDetails",
            type: "marketingDetails"
        },
        {
            title: "Meta Data",
            name: "metaData",
            type: "pageMetaData"
        }
    ]
};
