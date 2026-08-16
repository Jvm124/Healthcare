import axiosClient from './axiosClient';
import type { UsuarioLista, NuevoUsuarioRequest, Page } from '@/types/usuario.types';

export const usuariosApi = {
    listar: async (pagina = 0, size = 10): Promise<Page<UsuarioLista>> => {
        const { data } = await axiosClient.get<Page<UsuarioLista>>('/usuarios', {
            params: { page: pagina, size, sort: 'correo' },
        });
        return data;
    },

    registrar: async (payload: NuevoUsuarioRequest): Promise<void> => {
        await axiosClient.post('/usuarios', payload);
    },

    // Baja lógica (DELETE /usuarios/{id}): el backend pone activo = false.
    desactivar: async (id: number): Promise<void> => {
        await axiosClient.delete(`/usuarios/${id}`);
    },
};
