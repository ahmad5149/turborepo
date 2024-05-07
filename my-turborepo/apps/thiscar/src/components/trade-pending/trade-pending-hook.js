"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
export const LoadTradePending = () => {
    const pathname = usePathname();

    useEffect(() => {
        (function () {
            var script = document.createElement("script");
            script.src = "https://plugin.tradepending.com/v5/snap-EQ8L9zAMyyzZpmt4c.js";
            script.defer = true;

            document.body.appendChild(script);
        })();
    }, []);

    useEffect(() => {
        let timeout = setTimeout(() => {
            if (window && window.tradependingSetup) {
                window.tradependingSetup();
            }
            const navEvent = new Event("tradepending-route-change");
            window.dispatchEvent(navEvent);
        }, 2000);

        document.querySelector(".payment_explorer_banner")?.remove();

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
  window.ignitifySettings = { ignitifyId: "ec6dc474-a763-4b84-816e-a26a74949269" };
  `
                }}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
      (function () { var w = window; var ic = w.Ignitify; if (typeof ic === 'function') { ic('reattach_activator'); ic('update', w.ignitifySettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Ignitify = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://ignitify-tagmanager-scripts.drivecentric.io/prod/ignitify-tagmanager.js'; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (document.readyState === 'complete') { l(); } else if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();
      `
                }}
            />
        </>
    );
};
