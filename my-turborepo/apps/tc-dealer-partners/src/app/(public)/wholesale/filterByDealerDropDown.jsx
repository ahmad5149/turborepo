"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export async function FilterByDealerDropDown({ dealers }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function Change(e) {
        if (!e.target.value) {
            return router.push(pathname);
        }
        return router.push(`${pathname}?dealer=${encodeURIComponent(e.target.value)}`);
    }
    return (
        <select
            onChange={Change}
            defaultValue={searchParams.get("dealer") ?? ""}
            className="form-select form-select-lg mb">
            <option value="">Show All</option>
            {dealers.map((d) => (
                <option
                    key={d.id}
                    value={d.dealerURI}>
                    {d.name}
                </option>
            ))}
        </select>
    );
}
