import { formatOffsiteNotificationDate } from "../../../utils/helpers/dateFormatter";
export const transformData = (data) => {
    var notification = data?.map((item) => {
        const document = item.document;
        const transformedItem = {
            id: document?.id,
            contactId: document?.contactId,
            contactName: document?.contactName || null,
            dealerStockId: document?.dealerStockId,
            description: document?.description,
            type: document?.type,
            uuid: document?.uuid,
            requestingDealerId: document?.requestingDealerId,
            createdBy: document?.createdBy || null,
            stockId: document?.stockId,
            vin: document?.vin,
            status: document?.status,
            createdAt: {
                _seconds: document?.createdAt,
                _nanoseconds: 0
            },
            dealerId: document?.dealerId,
            dealerName: document?.dealerName,
            requestingDealerName: document?.requestingDealerName,
            userName: document?.userName,
            email: document?.email,
            offsiteStatus: document?.offsiteStatus
        };

        return transformedItem;
    });
    return notification;
    // return formatOffsiteNotificationDate(notification);
};
