import FinishSignup from "../../../components/finishsignup/FinishSignup";

export const metadata = {
    title: "Sign Up Complete",
    description: "Sign Up Complete page"
};
const FinishSignupPage = async () => {
    return <div className="text-center">{<FinishSignup />}</div>;
};

export default FinishSignupPage;
