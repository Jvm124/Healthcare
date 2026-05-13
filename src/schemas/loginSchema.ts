import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El correo es obligatorio')
        .email('Correo inválido')
        .max(100, 'Máximo 100 caracteres'),
    password: z
        .string()
        .min(6, 'Mínimo 6 caracteres')
        .max(64, 'Máximo 64 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;