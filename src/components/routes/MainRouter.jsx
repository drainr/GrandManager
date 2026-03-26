import { createBrowserRouter } from "react-router";
import Root from "";
import Login from "../../pages/Login.jsx";
import SignUp from "../../pages/SignUp.jsx";
import Dashboard from "../../pages/Dashboard.jsx";



const router = createBrowserRouter([

    {
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: "signup",
                element: <SignUp />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "dashboard",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "about",
                element: <NotFound />,
            },
            {
                path: "watch",
                element: <Unauthorized />,
            },
            {
                path: "unauthorized",
                element: <Unauthorized />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

export default router;
