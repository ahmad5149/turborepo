import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const FormikToast = () => {
    const { errors, isSubmitting } = useFormikContext();

    useEffect(() => {
        if (isSubmitting && Object.keys(errors).length > 0) {
            toast.error(`Please make sure that correct information is entered!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true
            });
        }
    }, [errors, isSubmitting]);

    return null;
};
