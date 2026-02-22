import React from 'react';
import { ChangePasswordModal } from '../components/auth';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ChangePasswordPage: React.FC = () => {
    const { isAuthenticated, isLoading, mustChangePassword } = useAuth();

    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <ChangePasswordModal forced={mustChangePassword} />;
};

export default ChangePasswordPage;
