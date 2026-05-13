import { useEffect, useState } from 'react';
import { Bell, UserCircle, Search, Calendar, FileText } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import AppointmentCard from '@/components/dashboard/AppointmentCard';
import Spinner from '@/components/ui/Spinner';
import { appointmentsApi } from '@/api/appointmentsApi';
import type { Appointment } from '@/types/appointment.types';

const DashboardPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await appointmentsApi.getMyAppointments();
                setAppointments(data);
            } catch {
                // En caso de error puedes usar datos mock
                setAppointments([
                    {
                        id: 1,
                        doctorNombre: 'Dr. Juan Vega Lapaz',
                        doctorEspecialidad: 'Cardiología',
                        fecha: '30 de abril de 2025',
                        hora: '10 a.m.',
                        alertaActivada: true,
                    },
                ]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Spinner fullScreen />;

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center justify-between p-4 gap-4 border-b">
                <Sidebar />

                <div className="flex-1 max-w-xl relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full bg-blue-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-primary text-white p-2 rounded-full" aria-label="Notificaciones">
                        <Bell size={20} />
                    </button>
                    <button aria-label="Perfil">
                        <UserCircle size={36} className="text-primary" />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 space-y-8">
                <section>
                    <h2 className="text-lg font-semibold mb-3">Citas programadas</h2>
                    <div className="space-y-3">
                        {appointments.map((a) => <AppointmentCard key={a.id} appointment={a} />)}
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4 max-w-md">
                    <button className="border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
                        <Calendar size={48} className="text-primary" />
                        <span className="text-sm font-medium">Reservar cita médica</span>
                    </button>
                    <button className="border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
                        <FileText size={48} className="text-primary" />
                        <span className="text-sm font-medium">Mis documentos</span>
                    </button>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;