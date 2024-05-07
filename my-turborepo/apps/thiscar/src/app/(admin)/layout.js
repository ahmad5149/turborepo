import { redirect } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
//import "bootstrap/dist/css/bootstrap.min.css";import "../../contents/admin/scss/plugins.scss";
import "../../contents/admin/css/style.bundle.css";
import "../../contents/admin/plugins/global/plugins.bundle.css";
import "../../contents/admin/css/custom.global.css";
// import "../../contents/admin/plugins/custom/leaflet/leaflet.bundle.css";
// import "../../contents/admin/plugins/custom/datatables/datatables.bundle.css";

import AppProvider from "../../StateManagement/AppProvider";
import { AuthProvider } from "@/components/auth";
import jsScripts from "../../contents/admin/js/scripts.js";

import "../../contents/scss/admin/adminStyles.scss";

//import jsPlugins from "../../contents/admin/js/vendors/plugins";
// import jsPluginsBundle from "../../contents/admin/plugins/global/plugins.bundle.js";
// import jsScripts from "../../contents/admin/js/scripts.bundle.js";
// import jsWidgets from "../../contents/admin/js/widgets.bundle.js";
//import apexChart from "../../contents/admin/js/vendors/plugins/apexchart.init.js";

export const metadata = {
    title: "THISCar Admin",
    description: "THISCar Admin"
};

const checkAuthentication = async () => {
    // if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    //     return true;
    // }

    return false;
};

// export default function Layout({clientAuth}){
// return login
// }

export default async function RootLayout({ children }) {
    const isAuthenticated = await checkAuthentication();
    if (isAuthenticated) {
        return redirect("/");
    }

    // //const isAuthed = await adminAuthentication();
    // console.log(clientAuth.currentUser);
    // const currentUrl = await getCurrentUrl();
    // console.log(currentUrl);
    // if (clientAuth.currentUser == null && (currentUrl != "/admin/login" || currentUrl != "")) {
    //     //return redirect("/admin/login");
    //     console.log(isAuthed);
    //     const currentUrl = await getCurrentUrl();
    //     console.log(currentUrl);
    //     //if (currentUrl != "/admin/login") {
    //     //return redirect("/admin/login");
    //     //}
    // }

    const routes = [
        "/",
        "dealers",
        "users",
        "inventory",
        "inventory/",
        "login",
        "dealers/add-dealer",
        "users/add-user",
        "notifications",
        "appraisals"
    ];
    return (
        <html lang="en">
            <head>
                <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" />
            </head>
            <body
                className={
                    "header-fixed header-tablet-and-mobile-fixed toolbar-enabled aside-fixed aside-extended-enabled aside-secondary-enabled"
                }>
                <Link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700"
                />
                {/* <script src={jsWidgets} /> */}

                {/* <script src={jsPluginsBundle} /> */}
                <script
                    type="text/babel"
                    src={jsScripts}
                />
                {/* <Script
                    id="theme-switch"
                    dangerouslySetInnerHTML={{
                        __html: `var defaultThemeMode = "light"; var themeMode; if ( document.documentElement ) { if ( document.documentElement.hasAttribute("data-bs-theme-mode")) { themeMode = document.documentElement.getAttribute("data-bs-theme-mode"); } else { if ( localStorage.getItem("data-bs-theme") !== null ) { themeMode = localStorage.getItem("data-bs-theme"); } else { themeMode = defaultThemeMode; } } if (themeMode === "system") { themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } document.documentElement.setAttribute("data-bs-theme", themeMode); }`
                    }}></Script> */}
                <AppProvider routes={routes}>
                    <AuthProvider>{children}</AuthProvider>
                </AppProvider>
            </body>
        </html>
    );
}
