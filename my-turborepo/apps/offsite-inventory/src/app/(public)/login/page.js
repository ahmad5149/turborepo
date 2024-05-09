import Login from "../../../components/login/Login";

export const metadata = {
    title: "Login",
    description: "Login page"
};
const LoginPage = async () => {
    return <div className="text-center">{<Login />}</div>;
};

export default LoginPage;
