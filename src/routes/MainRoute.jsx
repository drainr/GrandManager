import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Chat from "../pages/Chat";

const MainRoute = () => {
  return (
    <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private */}
        <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
        </Route>
    </Routes>
  );
};

export default MainRoute;