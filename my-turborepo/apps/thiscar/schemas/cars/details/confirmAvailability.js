export default {
    title: "Confirm Availability PopUp",
    name: "confirmAvailabilityPopUp",
    type: "object",
    fields: [
        {
            name: "popUpHeading",
            title: "PopUp Heading",
            type: "string",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "popUpText1",
            title: "PopUp Text",
            type: "text",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "popUpText2",
            title: "PopUp Text",
            type: "text",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "buttonText",
            title: "Button Text",
            type: "string",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "confirmationHeading",
            title: "Confirmation heading",
            type: "string",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "confirmationMessage",
            title: "Confirmation Text",
            type: "text",
            required: true,
            description: "message to be displayed after request sent",
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        }
    ]
};
