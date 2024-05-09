import Signup from "../../../components/signup/Signup";

export const metadata = {
    title: "Signup",
    description: "Signup page"
};
const SignupPage = async () => {
    return <div className="text-center">{<Signup />}</div>;
};

export default SignupPage;
