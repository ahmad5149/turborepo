export default {
    title: "Car Delivery",
    name: "carDelivery",
    type: "object",
    fields: [
        {
            title: "Title First Part",
            name: "titleStart",
            type: "string"
        },
        {
            title: "Typewriter Words",
            name: "typeWords",
            type: "array",
            of: [
                {
                    title: "Typewriter Word",
                    name: "typeWord",
                    type: "string"
                }
            ]
        },
        {
            title: "Title Second Part",
            name: "titleEnd",
            type: "string"
        },
        // {
        //   title: 'Sub Text',
        //   name: 'subtext',
        //   type: 'text',
        // },
        {
            title: "Image",
            name: "image",
            type: "image"
        }
    ]
};
