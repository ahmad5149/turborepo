import FinishSignin from "../../../components/finishsignin/FinishSignin";

export const metadata = {
    title: "Complete Sign In",
    description: "Complete Sign In page"
};
const FinishSigninPage = async () => {
    return <div className="text-center">{<FinishSignin />}</div>;
};

export default FinishSigninPage;
