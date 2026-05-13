export interface User {
    id: number;
    nombreCompleto: string;
    email: string;
    dni: string;
    telefono: string;
    rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
}

export interface LoginRequest {
    email: string;
    password: string;
    recaptchaToken?: string; // ← opcional
}

export interface RegisterRequest {
    nombreCompleto: string;
    dni: string;
    telefono: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}