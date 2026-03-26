import React from 'react';
import { ChangePasswordModal } from '../components/auth';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ChangePasswordPage: React.FC = () => {
    const { isAuthenticated, isLoading, mustChangePassword } = useAuth();
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <ChangePasswordModal forced={mustChangePassword} />;
};

export default ChangePasswordPage;
