import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Chat from "../pages/Chat";
import Root from "../layout/Root";
import NotFound from "../pages/NotFound.jsx";
import Settings from "../pages/Settings.jsx";


const MainRoute = () => {
  return (
    <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />


        {/* Private */}
        <Route element={<PrivateRoute />}>
            <Route element={<Root />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/Settings" element={<Settings />} /> {/* Optional: Redirect /dashboard to / */}
            </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default MainRoute;