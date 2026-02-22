import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, LoginRequest, LoginResponse } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    mustChangePassword: boolean;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
    setMustChangePassword: (value: boolean) => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mustChangePassword, setMustChangePassword] = useState(false);

    const isAuthenticated = !!user;

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            // Read from user object
            setMustChangePassword(currentUser.mustChangePassword ?? false);
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setMustChangePassword(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await authService.login(data);

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Set user from response
        setUser(response.user);
        // Read mustChangePassword from user object 
        setMustChangePassword(response.user.mustChangePassword ?? false);

        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setMustChangePassword(false);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        setMustChangePassword(updatedUser.mustChangePassword ?? false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                mustChangePassword,
                login,
                logout,
                updateUser,
                setMustChangePassword,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
