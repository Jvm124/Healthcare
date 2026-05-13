import axiosClient from './axiosClient';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await axiosClient.get<User>('/auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axiosClient.post('/auth/logout');
    },
};