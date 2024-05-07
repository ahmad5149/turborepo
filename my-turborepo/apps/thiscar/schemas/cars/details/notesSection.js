export default {
    name: "notesSection",
    type: "object",
    fields: [
        {
            name: "notesHeading",
            type: "string",
            title: "Notes Section - Heading "
        },
        {
            name: "paragraphs",
            type: "array",
            title: "Paragraphs",
            of: [{ type: "textSection" }] // Use a custom type for paragraphs
        }
    ]
};

// Create a custom type for a section of text
export const textSection = {
    name: "textSection",
    type: "object",
    title: "Text Section",
    fields: [
        {
            name: "content",
            type: "array",
            title: "Content",
            of: [
                {
                    type: "block",
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Emphasis", value: "em" },
                            { title: "heading", value: "h2" }
                        ],
                        annotations: [
                            {
                                title: "List",
                                name: "list",
                                type: "object",
                                fields: [
                                    {
                                        title: "List Type",
                                        name: "style",
                                        type: "string",
                                        options: {
                                            list: [
                                                { title: "Bullet", value: "bullet" },
                                                { title: "Number", value: "number" }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    ]
};
