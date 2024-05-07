import Script from "next/script";
import Login from "../../../../components/admin/login/Login";
export const metadata = {
    title: "Login",
    description: "Login Page"
};

const LoginPage = async () => {
    return (
        <>
            <div className="text-center">{<Login />}</div>
        </>
    );
};

export default LoginPage;
