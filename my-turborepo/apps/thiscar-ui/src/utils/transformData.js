export const transformUserData = (data) => {
    return data?.map((item) => {
        const document = item.document;
        const transformedItem = {
            id: document?.id,
            chromeDealerId: document?.chromeDealerId,
            createContact: document?.createContact,
            createdAt: {
                _seconds: document?.createdAt,
                _nanoseconds: 0
            },
            createdBy: document?.createdBy,
            dealerShip: document?.dealerShip,
            email: document?.email,
            escalationNotification: document?.escalationNotification,
            firebaseId: document?.firebaseId,
            firstName: document?.firstName,
            isActive: document?.isActive,
            isDeleted: document?.isDeleted,          
            lastName: document?.lastName,
            phone: document?.phone,
            receiveNotification: document?.receiveNotification,
            secondaryDealership: document?.role,
            role: document?.secondaryDealership,
            title: document?.title,
            uuid: document?.uuid,
            updatedAt: document?.updatedAt,
            updatedBy: document?.updatedBy


        };

        return transformedItem;
    });
};