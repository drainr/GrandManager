import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // your auth hook

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;