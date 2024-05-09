import Signin from "../../../components/signin/Signin";

export const metadata = {
    title: "Sign In",
    description: "Sign page"
};
const SigninPage = async () => {
    return <div className="text-center">{<Signin />}</div>;
};

export default SigninPage;
