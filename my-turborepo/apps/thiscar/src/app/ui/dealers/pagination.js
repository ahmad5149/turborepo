"use client";

// import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
// import { generatePagination } from "@/app/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination(name) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    //const id = Number(searchParams.get("id")) || null;
    //const name = Number(searchParams.get("name")) || null;

    //const createPageURL = (name) => {
    const params = new URLSearchParams(searchParams);
    //params.set("id", id.toString());
    params.set("name", name.toString());
    //return `${pathname}?${params.toString()}`;
    //const path = ${pathname}?${params.toString()};
    //carsURL = path;
    // router.push(path, { scroll: false });
    window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    //};
}
