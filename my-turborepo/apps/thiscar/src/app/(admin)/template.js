"use client";
import { usePathname } from "next/navigation";
import Footer from "../../components/admin/common/footer/Footer";
import { Header } from "../../components/admin/common/header/Header";
import { Sidebar } from "../../components/admin/common/sidebar/Sidebar";
export default function homeLayout({ children }) {
    const path = usePathname();
    const name = path.replace(/\//g, "-");
    return (
        <>
            <div
                className={`d-flex flex-column flex-root`}
                id={`template${name}`}>
                <div className="page d-flex flex-row flex-column-fluid">
                    <Sidebar />
                    <div
                        className="wrapper d-flex flex-column flex-row-fluid"
                        id="kt_wrapper">
                        <Header />

                        {/*begin::Content*/}
                        <div
                            className="content fs-6 d-flex flex-column flex-column-fluid"
                            id="kt_content">
                            {children}
                        </div>
                        {/*end::Content*/}
                        <Footer />
                    </div>

                    {/* </RecaptchaProviders> */}
                </div>
            </div>
        </>
    );
}
