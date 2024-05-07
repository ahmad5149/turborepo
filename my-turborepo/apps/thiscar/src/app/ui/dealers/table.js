import { db } from "../../../services/firebase-admin";
import Pagination from "@/app/ui/dealers/pagination";
// import { fetchDealersData } from "../../../services/dealerService";
const fetchFilteredDealers = async (query, name) => {
    // added the ability to accept the page and limit
    // firestore has a better model for querying read the docs

    query = query || "";
    const limit = 10;

    try {
        const dealerRef = await db.collection("dealers").orderBy("name", "asc").startAt(name).limit(limit).get();

        const dealers = dealerRef.docs.map((d) => d.data());

        return dealers;
    } catch (err) {
        console.log(err);
    }
    return [];
};

export default async function DealersTable({ query, name }) {
    const filteredDealers = await fetchFilteredDealers(query, name);
    //return filteredDealers;

    return (
        <div className="table-responsive">
            <table
                className="table align-middle table-row-dashed fs-6 gy-5"
                id="kt_ecommerce_products_table">
                <thead>
                    <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                        <th className="w-10px pe-2">
                            <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    data-kt-check="true"
                                    data-kt-check-target="#kt_ecommerce_products_table .form-check-input"
                                    value="1"
                                />
                            </div>
                        </th>
                        <th className="min-w-200px">Name</th>
                        <th className="text-end min-w-100px">Chrome Dealer Id</th>
                        <th className="text-end min-w-100px">Phone</th>
                        <th className="text-end min-w-70px">Postal Code</th>
                        <th className="text-end min-w-100px">City</th>
                        <th className="text-end min-w-100px">State</th>
                        <th className="text-end min-w-100px">Website</th>
                        <th className="text-end min-w-100px">Status</th>
                        <th className="text-center min-w-70px">Actions</th>
                    </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                    {filteredDealers.map((dealer, index) => (
                        <tr key={index}>
                            <td>
                                <div className="form-check form-check-sm form-check-custom form-check-solid">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="1"
                                    />
                                </div>
                            </td>
                            <td>{dealer.name}</td>
                            <td>{dealer.chromeDealerId}</td>
                            <td className="text-end pe-0">
                                <span className="fw-bold">{dealer.phone}</span>
                            </td>
                            <td
                                className="text-end pe-0"
                                data-order="45">
                                <span className="fw-bold ms-3">{dealer.postalCode}</span>
                            </td>
                            <td className="text-end pe-0">{dealer.city}</td>
                            <td className="text-end pe-0">{dealer.state}</td>
                            <td className="text-end pe-0">{dealer.website}</td>
                            <td
                                className="text-end pe-0"
                                data-order="active">
                                {/*begin::Badges*/}
                                <div className="badge badge-light-success">Active</div>
                                {/*end::Badges*/}
                            </td>
                            <td className="text-center">
                                {/*begin::Actions*/}

                                <div className="d-flex align-items-stretch flex-shrink-0">
                                    <div className="btn btn-icon btn-active-light-primary fs-6">
                                        <a
                                            href="#"
                                            className="active">
                                            <i className="ki-duotone ki-pencil fs-2">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                            </i>
                                        </a>
                                    </div>
                                    <div className="btn btn-icon btn-active-light-primary fs-6">
                                        <a
                                            href="#"
                                            className="active">
                                            <i className="ki-duotone ki-basket fs-2x">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                                <span className="path4"></span>
                                            </i>
                                        </a>
                                    </div>
                                </div>
                                {/*end::Actions*/}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <span onClick={() => Pagination(filteredDealers[filteredDealers?.length - 1].name)}>Next Page</span>
        </div>
    );
}
