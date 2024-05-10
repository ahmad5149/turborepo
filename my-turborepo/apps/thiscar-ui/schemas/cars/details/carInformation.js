export default {
    title: "Car Information",
    name: "carInformation",
    type: "object",
    fields: [
        {
            name: "button1Text",
            title: "Button Text",
            type: "string",
            required: true,
            description: "Enter the text for button - e.g. (Confirm Availability)",
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "button2Text",
            title: "Button Text",
            type: "string",
            required: true,
            description: "Enter the text for button - e.g. (Click to Call)",
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },

        {
            name: "button3Text",
            title: "Button Text",
            type: "string",
            required: true,
            description: "Enter the text for button - e.g. (Calculate Payment)",
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        }
    ]
};
