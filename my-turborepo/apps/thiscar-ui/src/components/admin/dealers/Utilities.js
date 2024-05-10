import * as Yup from "yup";

const phoneRegExp = /^\(\d{3}\) \d{3}-\d{4}$/;
const websiteRegExp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.){1,}([a-zA-Z]{2,})(\/\S*)?$/;
const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*){1,4}$/;

export const validationSchema = Yup.object().shape({
    website: Yup.string().required("Website is required").matches(websiteRegExp, "Invalid domain name"),
    name: Yup.string().required("First name is required"),
    chromeDealerId: Yup.string().required("Chrome DealerId is required"),
    chromeExportId: Yup.string().required("Chrome ExportId is required"),
    phone: Yup.string().matches(phoneRegExp, "Invalid phone number").required("Phone number is required"),
    address: Yup.string().required("Dealer Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    dealerZipCode: Yup.string().required("Dealer Zip Code is required"),
    packAmount: Yup.number().required("Pack Amount is required"),
    retailMarkup: Yup.number().required("Retail Markup is required"),
    notes: Yup.string().required("Notes is required"),

    ownerLastName: Yup.string().required("Owner Last Name is required"),
    ownerFirstName: Yup.string().required("Owner First Name is required"),
    ownerPhone: Yup.string().matches(phoneRegExp, "Invalid phone number").required("Owner Phone number is required"),

    ownerEmail: Yup.string().matches(emailRegExp, "Invalid email").required("Owner Email is required"),
    crmEmail: Yup.string().matches(emailRegExp, "Invalid email"),
    tradeToolURL: Yup.string().matches(websiteRegExp, "Invalid domain name"),
    prequelURL: Yup.string().matches(websiteRegExp, "Invalid domain name"),

    managerEmail: Yup.string().matches(emailRegExp, "Invalid email"),

    managerPhone: Yup.string().matches(phoneRegExp, "Invalid phone number")

    // escalationFirstName: Yup.string().required("Escalation First Name is required"),
    // escalationPhone: Yup.string()
    //     .matches(phoneRegExp, "Invalid phone number")
    //     .required("Escalation Phone number is required"),
    // escalationLastName: Yup.string().required("Escalation Last Name is required"),
    // escalationEmail: Yup.string().matches(emailRegExp, "Invalid email").required("Escalation Email is required"),

    // contacts: Yup.array().of(
    //     Yup.object().shape({
    //         firstName: Yup.string().required("First name is required"),
    //         email: Yup.string().matches(emailRegExp, "Invalid email").required("Email is required"),
    //         lastName: Yup.string().required("Last Name is required"),
    //         title: Yup.string().required("Title is required"),
    //         phone: Yup.string().matches(phoneRegExp, "Invalid phone number").required("Phone Number is required")
    //     })
    // )
});

export const initialValues = {
    website: "",
    name: "",
    phone: "",
    address: "",
    state: "",
    packAmount: 0,
    retailMarkup: 0,
    alwaysAvailable: false,
    // sendInvitation: false,
    city: "",
    uuid: "",
    isDeleted: false,
    chromeDealerId: "",
    chromeExportId: "",
    isActive: true,
    logo: "",
    notes: "",
    dealerZipCode: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    escalationFirstName: "",
    escalationLastName: "",
    escalationEmail: "",
    escalationPhone: "",
    contacts: [
        {
            correlationId: "",
            firstName: "",
            lastName: "",
            title: "",
            email: "",
            phone: "",
            notification: false,
            isDeleted: false
        }
    ]
};

export const CustomStyle = {
    option: (provided) => ({
        ...provided,
        textAlign: "left"
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: data.color,
            color: "#fff",
            padding: "0px !important",
            margin: "0px !important"
        };
    },
    multiValueContainer: (styles) => {
        return {
            ...styles,
            padding: "0px !important",
            paddingLeft: "0px",
            margin: "0px !important"
        };
    },
    multiValueRemove: (base) => ({
        ...base,
        display: "none"
    }),
    option: (base) => ({
        ...base,
        // borderRadius: "25px",
        border: "1px solid #cfcfd4",
        backgroundColor: "transparent !important",
        fontSize: "11px !important",
        textAlign: "left !important",
        padding: "12px",
        marginTop: "5px",
        cursor: "pointer",
        "&:hover": {
            border: "1px solid transparent !important",
            backgroundColor: "#f2e8fc !important"
        },
        "&:active": {
            border: "1px solid #53119b !important"
        }
    }),
    group: (base) => ({
        ...base,
        fontSize: "14px !important",
        textAlign: "left !important"
    }),
    menu: (base) => ({
        ...base,
        padding: "12px !important",
        zIndex: "20"
    }),
    menuList: (base) => ({
        ...base,
        padding: "0px !important",
        backgroundColor: "white",
        "::-webkit-scrollbar": {
            width: "4px",
            height: "0px"
        },
        "::-webkit-scrollbar-track": {
            background: "#f1f1f1"
        },
        "::-webkit-scrollbar-thumb": {
            background: "#C2C2CF"
        }
    }),
    groupHeading: (base) => ({
        ...base,
        fontSize: "14px",
        color: "black"
    }),
    selectContainer: (base) => ({
        ...base,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }),
    placeholder: (provided) => ({
        ...provided,
        textAlign: "left" // Aligns the placeholder text to the left
    }),
    control: (provided) => ({
        ...provided,
        border: "1px solid var(--bs-gray-300)",
        // height: 34px;
        // borderRadius: "21px !important",
        fontSize: "12px !important",
        color: "#5c666f !important",
        textAlign: "left !important",
        fontWeight: "400 !important",
        minHeight: "34px",
        minWidth: "100%",
        boxShadow: "none",
        touchAction: "manipulation",
        "&:focus": {
            boxShadow: "none",
            textAlign: "left !important",
            borderColor: "#2a0a4d",
            outline: "0"
        },
        "@media (max-width: 575px)": {
            fontSize: "16px !important"
        }
    }),
    container: (provided) => ({
        ...provided,
        width: "100%"
    })
};

export const handlePhoneNumberFormat = (event) => {
    const rawPhoneNumber = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);
    return formattedPhoneNumber;
};

const formatPhoneNumber = (value) => {
    const phoneNumberRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})$/; //Regular Expression
    const groups = value.match(phoneNumberRegex);

    if (groups) {
        let formattedPhoneNumber = "";
        if (groups[1]) {
            formattedPhoneNumber += `(${groups[1]}`;
        }
        if (groups[2]) {
            formattedPhoneNumber += `) ${groups[2]}`;
        }
        if (groups[3]) {
            formattedPhoneNumber += `-${groups[3]}`;
        }
        if (groups[4]) {
            formattedPhoneNumber += `-${groups[4]}`;
        }
        return formattedPhoneNumber;
    } else {
        return value;
    }
};

export const handleChromeId = (event) => {
    return event.target.value.replace(/\D/g, ""); // Remove non-digit characters
};
