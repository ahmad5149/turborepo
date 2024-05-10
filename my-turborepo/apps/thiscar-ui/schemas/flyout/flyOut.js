export default {
    title: "Apply For Financing - Flyout",
    name: "flyOut",
    type: "object",
    fields: [
        {
            name: "flyoutOpeningButton",
            title: "Apply For Financing",
            type: "string",
            description: "Enter the text for button - Apply for financing",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "flyoutHeading",
            title: "Flyout Heading",
            type: "string",
            description: "Enter the text for heading",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "flyoutBodyText",
            title: "Flyout Body Text",
            type: "text",
            description: "Enter the details - text",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "flyoutBodyButtonText",
            title: "Flyout Body CTA Button",
            type: "string",
            description: "Enter the text for button",
            required: true,
            validation: (Rule) => Rule.required().error("Please fill in all required fields.")
        },
        {
            name: "showFlyout",
            title: "Show Flyout",
            type: "boolean",
            description: "Check this to show the Flyout (APPLY FOR FINANCING)"
        }
    ]
};
