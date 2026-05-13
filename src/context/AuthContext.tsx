import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/authApi';
import { tokenStorage } from '@/utils/tokenStorage';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth.types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = tokenStorage.get();
            if (token) {
                try {
                    const me = await authApi.me();
                    setUser(me);
                } catch {
                    tokenStorage.remove();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        const { token, user: u } = await authApi.login(credentials);
        tokenStorage.set(token);
        setUser(u);
    };

    const register = async (data: RegisterRequest) => {
        const { token, user: u } = await authApi.register(data);
        tokenStorage.set(token);
        setUser(u);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            /* ignore */
        } finally {
            tokenStorage.remove();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, isAuthenticated: !!user, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};