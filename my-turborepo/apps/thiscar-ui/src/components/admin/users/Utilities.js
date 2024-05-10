import * as Yup from "yup";
import { handlePhoneNumberFormat } from "../dealers/Utilities";
const phoneRegExp = /^\(\d{3}\) \d{3}-\d{4}$/;
const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*(?:\.[a-zA-Z0-9]{2,}){1,3}$/;

export const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    title: Yup.string().required("Title name is required"),
    role: Yup.string().required("Role is required"),
    email: Yup.string().matches(emailRegExp, "Invalid email").required("Email is required"),

    phone: Yup.string().matches(phoneRegExp, "Invalid phone").required("Phone is required")
});

export const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    dealerShip: "",
    secondaryDealership: [
        {
            uuid: "",
            userId: "",
            chromeDealerId: null,
            escalationNotification: false,
            receiveNotification: false,
            role: ""
        }
    ],
    receiveNotification: false,
    escalationNotification: false,
    chromeDealerId: "",
    isActive: false,
    createContact: false,
    role: "",
    uuid: ""
};

export const handlePhoneFormat = (event) => {
    return handlePhoneNumberFormat(event);
};
