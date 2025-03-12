import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "./AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
