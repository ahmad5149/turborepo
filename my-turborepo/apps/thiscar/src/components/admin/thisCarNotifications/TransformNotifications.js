export const transformNotifications = (data) => {
    var notification = data?.map((item) => {
        const document = item.document;
        const transformedItem = {
            id: document?.id,
            answerVia: document?.answerVia,
            contactId: document?.contactId,
            contactName: document?.contactName || null,
            dateOfAttempt: document?.dateOfAttempt || null,
            responseDate: document?.responseDate || null,
            attempt: document?.attempt,
            dealerId: document?.dealerId,
            dealerName: document?.dealerName,
            description: document?.description,
            responseMessage: document?.responseMessage,
            status: document?.status,
            stockId: document?.stockId,
            type: document?.type,
            uuid: document?.uuid,
            vin: document?.vin,
            updatedAt: document?.updatedAt,
            createdBy: document?.createdBy || null,
            createdAt: {
                _seconds: document?.createdAt,
                _nanoseconds: 0
            },

            userName: document?.userName
        };

        return transformedItem;
    });
    return notification;
};
