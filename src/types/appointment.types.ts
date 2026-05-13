export interface Appointment {
    id: number;
    doctorNombre: string;
    doctorEspecialidad: string;
    doctorFoto?: string;
    fecha: string; // ISO Date
    hora: string;
    alertaActivada: boolean;
}

export interface NewsItem {
    id: number;
    titulo: string;
    imagen: string;
    descripcion?: string;
    url?: string;
}