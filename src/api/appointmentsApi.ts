import axiosClient from './axiosClient';
import type { Appointment } from '@/types/appointment.types';

export const appointmentsApi = {
    getMyAppointments: async (): Promise<Appointment[]> => {
        const response = await axiosClient.get<Appointment[]>('/appointments/me');
        return response.data;
    },

    create: async (payload: Partial<Appointment>): Promise<Appointment> => {
        const response = await axiosClient.post<Appointment>('/appointments', payload);
        return response.data;
    },
};