import { db } from "@/services/firebase-admin";
import Link from "next/link";
import { CheckAuth } from "@/app/(public)/page";
import { redirect } from "next/navigation";
import { DownloadInspectionButton } from "./download-inspection-button";
import { BrickMortarButton } from "./brick-mortar-button";
import { FilterByDealerDropDown } from "./filterByDealerDropDown";
import { AuctionIcon, CashIcon, Icons, InspectionIcon, NoSaleIcon, TrashIcon } from "./icons";
import { updateVehicleStatus } from "./actions/updateVehicleStatus";

import { FilterByKindDropDown } from "./filterUnits";

async function GetMyInspections(dealer, status) {
    let col = db.collection("inspectionRequests");

    if (dealer) {
        col = col.where("dealerURI", "==", dealer);
    }

    if (status) {
        col = col.where("status", "==", status);
    }

    const inspectionRefs = await col.get();

    return inspectionRefs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function GetDealerNames() {
    const dealersRef = await db
        .collection("dealers")
        .select("name", "isActive", "dealerURI")
        .where("isActive", "==", true)
        .get();

    const dealers = dealersRef.docs
        .sort((a, b) => (a.get("name") > b.get("name") ? 1 : -1))
        .map((d) => ({ id: d.id, ...d.data() }));

    return dealers;
}

export default async function WholesalePage({ searchParams }) {
    const user = await CheckAuth();

    if (!user) {
        redirect("/");
    }
    const { dealer, status } = searchParams;
    let inspections;

    if (!user.email.includes("@thiscar.com")) {
        inspections = await GetMyInspections(user.dealer, status);
    } else {
        inspections = await GetMyInspections(dealer, status);
    }

    const dealers = await GetDealerNames();

    return (
        <div className="p-4">
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
                <div className="d-flex gap-2">
                    {user.email.includes("thiscar.com") ? <FilterByDealerDropDown dealers={dealers} /> : null}
                    <FilterByKindDropDown
                        kinds={[
                            {
                                status: "sold",
                                label: "Sold"
                            },
                            {
                                label: "No Sale",
                                status: "no_sale"
                            },
                            {
                                label: "Removed",
                                status: "removed"
                            },
                            { status: "inspection_requested", label: "Inspection Requested" }
                        ]}
                    />
                </div>

                <div className="d-flex gap-2">
                    <Link
                        style={{ borderRadius: 999, fontWeight: "normal" }}
                        className="btn btn-primary"
                        href="/wholesale/inspection-request">
                        Inspection Request
                    </Link>
                    <BrickMortarButton />
                    {user && user?.email.includes("thiscar.com") && (
                        <DownloadInspectionButton
                            dealer={dealer}
                            status={status}
                        />
                    )}
                </div>
            </div>

            <div className="d-flex mt-4 gap-2">Count: {inspections.length}</div>

            <div
                style={{ color: "#999", fontFamily: "Avenir-Light", alignContent: "center", alignItems: "center" }}
                className="d-flex gap-4 my-1">
                <strong>Legend</strong>{" "}
                <div>
                    <InspectionIcon /> = Inspection Requested
                </div>
                <div>
                    <CashIcon /> = Sold
                </div>
                <div>
                    <NoSaleIcon /> = No Sale Yet
                </div>
                <div>
                    <TrashIcon /> = Remove From Sale
                </div>
            </div>
            <div
                className="card"
                style={{ overflow: "hidden", overflowX: "auto" }}>
                {inspections.length == 0 ? (
                    <p className="pt-4 mx-auto">No Inspections</p>
                ) : (
                    <table
                        style={{ fontFamily: "Avenir-Light" }}
                        className="table table-striped">
                        <thead style={{ fontFamily: "Avenir-Heavy" }}>
                            <tr>
                                <td>
                                    <span className="sr-only">Status</span>
                                </td>
                                <td>Dealer</td>
                                <td>Uploaded On</td>
                                <td>Last Run</td>
                                <td>VIN</td>
                                <td>Year</td>
                                <td>Make</td>
                                <td>Model</td>
                                <td>Miles</td>
                                <td>Reserve</td>
                                <td>Comments</td>
                                <td>Highest Bid</td>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {inspections
                                .sort((a, b) => (a.createdAt.toDate() > b.createdAt.toDate() ? -1 : 1))
                                .map((i) => {
                                    const colors = {
                                        inspection_requested: "#777",
                                        sold: "#75b798",
                                        no_sale: "#dc3545"
                                    };
                                    const icons = {
                                        inspection_requested: <InspectionIcon />,
                                        sold: <CashIcon />,
                                        no_sale: <NoSaleIcon />,
                                        removed: <TrashIcon className="text-danger" />
                                    };
                                    return (
                                        <tr key={i.id}>
                                            <td style={{ alignContent: "center", justifyItems: "center" }}>
                                                {i.status && (
                                                    <div
                                                        style={{ color: colors[i.status] }}
                                                        aria-label={i.status}
                                                        title={i.status}>
                                                        {icons[i.status]}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {i.dealer} <br />
                                                <small>{i.user}</small>
                                            </td>
                                            <td>
                                                {i.createdAt
                                                    .toDate()
                                                    .toLocaleString("en-US", { timeZone: "America/Chicago" })}
                                            </td>
                                            <td>
                                                {i.auctionAt
                                                    ?.toDate()
                                                    ?.toLocaleString("en-US", { timeZone: "America/Chicago" }) ?? "-"}
                                            </td>
                                            <td>
                                                {i.auctionAt
                                                    ?.toDate()
                                                    ?.toLocaleString("en-US", { timeZone: "America/Chicago" }) ?? "-"}
                                            </td>
                                            <td>{i.vin}</td>
                                            <td>{i.year}</td>
                                            <td>{i.make}</td>
                                            <td>{i.model}</td>
                                            <td>{i.miles}</td>
                                            <td>{i.reserve}</td>
                                            <td>{i.comments || "-"}</td>

                                            <td>{i.highestBid ?? "-"}</td>
                                            <td className="text-sm">
                                                <div className="d-flex justify-content-end gap-3">
                                                    {!["inspection_requested", "sold"].includes(i.status) && (
                                                        <div title="Send to auction">
                                                            <form action={updateVehicleStatus}>
                                                                <input
                                                                    type="hidden"
                                                                    name="kind"
                                                                    value="inspection_requested"
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    name="id"
                                                                    value={i.id}
                                                                />
                                                                <button style={{ all: "unset", cursor: "pointer" }}>
                                                                    <AuctionIcon className="text-success" />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )}
                                                    {["inspection_requested"].includes(i.status) &&
                                                        user.email.includes("@thiscar.com") && (
                                                            <div title="Mark Sold">
                                                                <form action={updateVehicleStatus}>
                                                                    <input
                                                                        type="hidden"
                                                                        name="id"
                                                                        value={i.id}
                                                                    />
                                                                    <input
                                                                        type="hidden"
                                                                        name="kind"
                                                                        value="sold"
                                                                    />
                                                                    <button style={{ all: "unset", cursor: "pointer" }}>
                                                                        <Icons.Money style={{ color: colors.sold }} />
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        )}
                                                    {i.status !== "sold" && i.status !== "removed" && (
                                                        <form
                                                            title="Remove from runlist"
                                                            action={updateVehicleStatus}>
                                                            <input
                                                                type="hidden"
                                                                name="kind"
                                                                value="removed"
                                                            />
                                                            <input
                                                                type="hidden"
                                                                name="id"
                                                                value={i.id}
                                                            />
                                                            <button style={{ all: "unset", cursor: "pointer" }}>
                                                                <TrashIcon className="text-danger" />
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
