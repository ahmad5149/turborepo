"use client";

import { downloadInspectionRequests } from "@/app/(public)/wholesale/actions/downloadInspectionRequests";
import { useAuth } from "@/components/auth";
import { useTransition } from "react";

export function DownloadInspectionButton(props) {
    const user = useAuth();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    const downloadInspectionsForUser = downloadInspectionRequests.bind(null, {
                        email: user?.email,
                        dealer: props.dealer,
                        status: props.status
                    });
                    await downloadInspectionsForUser();
                });
            }}
            className="btn">
            {isPending ? (
                <>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                            opacity=".25"
                        />
                        <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                dur="0.75s"
                                values="0 12 12;360 12 12"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>{" "}
                    Emailing
                </>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ width: 24, height: 24 }}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                    />
                </svg>
            )}
        </button>
    );
}
