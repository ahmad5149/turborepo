"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FilterByKindDropDown({ kinds }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function Change(e) {
        const params = new URLSearchParams(searchParams.toString());
        if (!e.target.value) {
            params.delete("status");
            return router.push(`${pathname}?${params.toString()}`);
        }

        params.set("status", e.target.value);

        return router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <select
            onChange={Change}
            defaultValue={searchParams.get("status") ?? ""}
            className="form-select form-select-lg mb">
            <option value="">Show All</option>
            {kinds.map((k) => (
                <option
                    key={k.status}
                    value={k.status}>
                    {k.label}
                </option>
            ))}
        </select>
    );
}
