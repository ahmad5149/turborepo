export default {
    title: "Pop-up",
    name: "popUp",
    type: "object",
    fields: [
        {
            title: "Free Shipping To Our HQ | First Headline",
            name: "firstHeadline",
            description: "Enter the text for first Headline in pop-up",
            type: "text"
        },
        {
            title: "Shipping Free for this month | Second Headline",
            name: "secondHeadline",
            description: "Enter the text for second Headline in pop-up",
            type: "text"
        },
        {
            title: "Close Pop-up",
            name: "closePopUpButtonLabel", // Button text/label Placeholder
            description: "Label for the close button on pop-up",
            type: "string"
        },
        {
            name: "showPopUp",
            title: "Show PopUp",
            type: "boolean",
            description: "Check this to show the PopUp at site/page visit"
        }
    ]
};
