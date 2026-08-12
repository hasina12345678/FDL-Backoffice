import { Navigate, Outlet } from "react-router-dom";

function isTokenValid(token) {
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        if (!payload.exp) {
            return false;
        }

        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
}

function ProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token || !isTokenValid(token)) {
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;