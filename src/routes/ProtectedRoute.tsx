import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Spinner fullScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;