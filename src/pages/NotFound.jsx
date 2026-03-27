import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#4d2c72] text-center px-6">
            <h1 className="text-8xl font-bold text-[#EBB537]">404</h1>
            <h2 className="text-2xl font-semibold text-[#EBB537] mt-4">Page Not Found</h2>
            <div className="mt-8">
                <Link
                    to="/"
                    className="px-6 py-2 rounded-full font-semibold bg-[#4d2c72] text-[#EBB537] hover:bg-[#9DBEBB] transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;