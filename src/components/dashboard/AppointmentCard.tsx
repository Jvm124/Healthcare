import { Bell } from 'lucide-react';
import type { Appointment } from '@/types/appointment.types';

interface Props {
    appointment: Appointment;
}

const AppointmentCard = ({ appointment }: Props) => {
    return (
        <div className="bg-primary text-white rounded-xl p-4 flex items-center gap-4 shadow">
            <div className="text-center">
                <img
                    src={appointment.doctorFoto || '/assets/doctor-default.png'}
                    alt={appointment.doctorNombre}
                    className="w-20 h-20 rounded-full object-cover bg-white"
                />
                {appointment.alertaActivada && (
                    <p className="text-xs mt-1 flex items-center gap-1 justify-center">
                        <Bell size={12} /> Alerta activada
                    </p>
                )}
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold">{appointment.doctorNombre}</h3>
                <p className="text-sm opacity-90">Especialista en {appointment.doctorEspecialidad}</p>
            </div>
            <div className="text-right">
                <p>{appointment.fecha}</p>
                <p>{appointment.hora}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;