import { Link } from "react-router-dom";
import YellowButton from "../components/YellowButton.jsx";

const NotFound = () => {
    return (
        <div className="min-h-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#4d2c72] text-center px-6">
            <h1 className="text-8xl font-bold text-[#EBB537]">404</h1>
            <h2 className="text-2xl font-semibold text-[#EBB537] mt-4">Page Not Found</h2>
            <div className="mt-8">
                <YellowButton text='Back to Dashboard'/>
            </div>
        </div>
    );
};

export default NotFound;