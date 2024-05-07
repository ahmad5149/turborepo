export default {
    title: "Offsite Inventory",
    name: "offsite",
    type: "document",
    __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
    fields: [
        {
            title: "Offsite Header",
            name: "offsiteHeader",
            type: "offsiteHeader"
        }
    ]
};
