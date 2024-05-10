export default {
    title: "Partner Sales Car Details",
    name: "partnerSalesCarDetails",
    type: "document",
    __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Buy Now",
            name: "buyNowPopup",
            type: "buyNowPartnerSalesPopup"
        },
        {
            title: "Meta Data",
            name: "metaData",
            type: "pageMetaData"
        }
    ]
};
