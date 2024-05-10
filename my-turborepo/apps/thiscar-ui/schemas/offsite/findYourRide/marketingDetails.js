export default {
    title: "Marketing Details",
    name: "marketingDetails",
    type: "object",
    fields: [
        {
            title: "Marketing Tiles",
            name: "marketingTiles",
            type: "array",
            of: [
                {
                    title: "Contact",
                    name: "contact",
                    type: "object",
                    fields: [
                        {
                            name: "textBeforeHighlighted",
                            title: "Text Before Highlighted",
                            type: "string"
                        },
                        {
                            name: "highlightedText",
                            title: "Highlighted Text",
                            type: "string"
                        },
                        {
                            name: "textAfterHighlighted",
                            title: "Text After Highlighted",
                            type: "string"
                        },
                        //   {
                        //     name: 'contactNumber',
                        //     title: 'Contact Number',
                        //     type: 'string',
                        //   },
                        {
                            name: "tileBackgroundColor",
                            title: "Tile Background Color",
                            type: "dropdownField"
                        },
                        {
                            name: "hightlightedTextColor",
                            title: "Hightlighted Text Color",
                            type: "dropdownField"
                        }
                    ]
                }
            ]
        }
    ]
};
