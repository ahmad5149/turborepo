"use client";
import { ErrorMessage, FieldArray, Field, useFormikContext } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { handlePhoneNumberFormat } from "./Utilities";

function DealerContactsRepeater() {
    const { values, setFieldValue, errors, touched } = useFormikContext();

    return (
        <table
            className="table align-middle table-row-dashed fs-6 gy-5"
            id="kt_ecommerce_products_table">
            <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-100px">First Name</th>
                    <th className="min-w-100px">Last Name</th>
                    <th className="min-w-100px">Title</th>
                    <th className="min-w-70px">Email</th>
                    <th className="min-w-100px">Phone</th>
                    <th className="min-w-100px">Notifications</th>
                </tr>
            </thead>

            <tbody className="fw-semibold text-gray-600">
                <FieldArray name="contacts">
                    {({ insert, remove, push }) => (
                        <>
                            {values?.contacts?.length > 0 &&
                                values.contacts.map((attr, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="form-floating">
                                                <Field
                                                    type="text"
                                                    className={`form-control mb-2 ${
                                                        touched?.contacts?.[index]?.firstName &&
                                                        errors?.contacts?.[index]?.firstName
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id={`contacts[${index}].firstName`}
                                                    name={`contacts[${index}].firstName`}
                                                    placeholder="First Name"
                                                />
                                                <label
                                                    className=""
                                                    for={`contacts[${index}].firstName`}>
                                                    First Name
                                                </label>
                                                <ErrorMessage
                                                    name={`contacts[${index}].firstName`}
                                                    component="div"
                                                    className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="form-floating">
                                                <Field
                                                    type="text"
                                                    id={`contacts[${index}].lastName`}
                                                    name={`contacts[${index}].lastName`}
                                                    placeholder="Last Name"
                                                    className={`form-control mb-2 ${
                                                        touched?.contacts?.[index]?.lastName &&
                                                        errors?.contacts?.[index]?.lastName
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                />
                                                <label
                                                    className=""
                                                    for={`contacts[${index}].lastName`}>
                                                    Last Name
                                                </label>
                                                <ErrorMessage
                                                    name={`contacts[${index}].lastName`}
                                                    component="div"
                                                    className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="form-floating">
                                                <Field
                                                    type="text"
                                                    id={`contacts[${index}].title`}
                                                    name={`contacts[${index}].title`}
                                                    placeholder="Title"
                                                    className={`form-control mb-2 ${
                                                        touched?.contacts?.[index]?.title &&
                                                        errors?.contacts?.[index]?.title
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                />
                                                <label
                                                    className=""
                                                    for={`contacts[${index}].title`}>
                                                    Title
                                                </label>
                                                <ErrorMessage
                                                    name={`contacts[${index}].title`}
                                                    component="div"
                                                    className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="form-floating">
                                                <Field
                                                    type="text"
                                                    name={`contacts[${index}].email`}
                                                    id={`contacts[${index}].email`}
                                                    placeholder="Email"
                                                    className={`form-control mb-2 ${
                                                        touched?.contacts?.[index]?.email &&
                                                        errors?.contacts?.[index]?.email
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                />
                                                <label
                                                    className=""
                                                    for={`contacts[${index}].email`}>
                                                    Email
                                                </label>
                                                <ErrorMessage
                                                    name={`contacts[${index}].email`}
                                                    component="div"
                                                    className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="form-floating">
                                                <Field
                                                    type="text"
                                                    name={`contacts[${index}].phone`}
                                                    id={`contacts[${index}].phone`}
                                                    className={`form-control mb-2 ${
                                                        touched?.contacts?.[index]?.phone &&
                                                        errors?.contacts?.[index]?.phone
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    maxLength="14"
                                                    onChange={(event) =>
                                                        setFieldValue(
                                                            `contacts[${index}].phone`,
                                                            handlePhoneNumberFormat(event)
                                                        )
                                                    }
                                                    placeholder="Phone"
                                                />
                                                <label
                                                    className=""
                                                    for={`contacts[${index}].phone`}>
                                                    Phone
                                                </label>
                                                <ErrorMessage
                                                    name={`contacts[${index}].phone`}
                                                    component="div"
                                                    className="text-start fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
                                                />
                                            </div>
                                        </td>

                                        <td className="fv-row w-100 flex-md-root d-flex">
                                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                                                <Field
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name={`contacts[${index}].notification`}
                                                    id={`contacts[${index}].notification`}
                                                />

                                                <span className="ps-5">
                                                    {/* <FontAwesomeIcon icon={faEdit} size="lg" /> */}
                                                    <span
                                                        className="ps-5"
                                                        role="button"
                                                        onClick={() => remove(index)}>
                                                        <FontAwesomeIcon
                                                            icon={faDeleteLeft}
                                                            size="lg"
                                                        />
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            <tr>
                                <td colspan="6">
                                    <button
                                        type="button"
                                        className="btn btn-contact color-white"
                                        onClick={() =>
                                            push({
                                                firstName: "",
                                                lastName: "",
                                                title: "",
                                                email: "",
                                                phone: "",
                                                notification: false,
                                                isDeleted: false,
                                                correlationId: ""
                                            })
                                        }>
                                        <i class="ki-duotone ki-plus-circle text-info fs-2qx">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                        Add Contacts
                                    </button>
                                </td>
                            </tr>
                        </>
                    )}
                </FieldArray>
            </tbody>
        </table>
    );
}

export default DealerContactsRepeater;
