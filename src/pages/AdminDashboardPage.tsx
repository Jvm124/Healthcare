import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Stethoscope } from 'lucide-react';
import DashboardLayout, { type NavItem } from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { usuariosApi } from '@/api/usuariosApi';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { registrarUsuarioSchema, type RegistrarUsuarioFormData } from '@/schemas/registrarUsuarioSchema';
import type { UsuarioLista } from '@/types/usuario.types';

const nav: NavItem[] = [
    { label: 'Usuarios', to: '/admin', icon: Users },
    { label: 'Médicos', to: '/admin/medicos', icon: Stethoscope },
];

const EstadoPill = ({ activo }: { activo: boolean }) =>
    activo ? (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Activo</span>
    ) : (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Inactivo</span>
    );

const BotonDesactivar = ({ habilitado, onClick }: { habilitado: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        disabled={!habilitado}
        className="text-sm font-medium text-red-500 hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
    >
        Desactivar
    </button>
);

const AdminDashboardPage = () => {
    const { user } = useAuth();

    const [usuarios, setUsuarios] = useState<UsuarioLista[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState('');
    const [formError, setFormError] = useState('');
    const [formOk, setFormOk] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegistrarUsuarioFormData>({ resolver: zodResolver(registrarUsuarioSchema) });

    const cargar = useCallback(async () => {
        setListError('');
        try {
            const page = await usuariosApi.listar();
            setUsuarios(page.content);
        } catch (err) {
            setListError(getErrorMessage(err, 'No se pudieron cargar los usuarios'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    const onSubmit = async (data: RegistrarUsuarioFormData) => {
        setFormError('');
        setFormOk('');
        try {
            await usuariosApi.registrar(data);
            setFormOk(`Usuario ${data.correo} creado`);
            reset();
            await cargar();
        } catch (err) {
            setFormError(getErrorMessage(err, 'No se pudo crear el usuario'));
        }
    };

    const desactivar = async (u: UsuarioLista) => {
        if (!window.confirm(`¿Desactivar a ${u.correo}? No podrá iniciar sesión.`)) return;
        try {
            await usuariosApi.desactivar(u.id);
            await cargar();
        } catch (err) {
            setListError(getErrorMessage(err, 'No se pudo desactivar el usuario'));
        }
    };

    const puedeDesactivar = (u: UsuarioLista) => u.activo && u.id !== user?.id;

    return (
        <DashboardLayout title="Administración" navItems={nav}>
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-1 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Registrar usuario</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <Input
                            type="email"
                            placeholder="Correo"
                            {...register('correo')}
                            error={errors.correo?.message}
                        />
                        <Input
                            type="password"
                            placeholder="Contraseña"
                            {...register('contrasenia')}
                            error={errors.contrasenia?.message}
                        />
                        <div>
                            <select
                                {...register('rol')}
                                defaultValue=""
                                className={`input-field ${errors.rol ? 'border-red-500' : ''}`}
                            >
                                <option value="" disabled>
                                    Selecciona un rol
                                </option>
                                <option value="RECEPCIONISTA">Recepcionista</option>
                                <option value="ADMINISTRADOR">Administrador</option>
                            </select>
                            {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol.message}</p>}
                        </div>

                        {formError && <p className="text-red-500 text-sm">{formError}</p>}
                        {formOk && <p className="text-green-600 text-sm">{formOk}</p>}

                        <Button type="submit" isLoading={isSubmitting}>
                            Crear usuario
                        </Button>
                    </form>
                </Card>

                <Card className="p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Usuarios</h2>

                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Spinner /> Cargando…
                        </div>
                    ) : listError ? (
                        <p className="text-red-500 text-sm">{listError}</p>
                    ) : usuarios.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay usuarios.</p>
                    ) : (
                        <>
                            <table className="w-full text-sm hidden md:table">
                                <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200">
                                    <th className="py-2 pr-4 font-medium">Correo</th>
                                    <th className="py-2 pr-4 font-medium">Rol</th>
                                    <th className="py-2 pr-4 font-medium">Estado</th>
                                    <th className="py-2 text-right font-medium">Acción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {usuarios.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-100 last:border-0">
                                        <td className="py-3 pr-4">{u.correo}</td>
                                        <td className="py-3 pr-4">{u.rol}</td>
                                        <td className="py-3 pr-4">
                                            <EstadoPill activo={u.activo} />
                                        </td>
                                        <td className="py-3 text-right">
                                            <BotonDesactivar habilitado={puedeDesactivar(u)} onClick={() => desactivar(u)} />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="md:hidden space-y-3">
                                {usuarios.map((u) => (
                                    <div key={u.id} className="border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold break-all">{u.correo}</span>
                                            <EstadoPill activo={u.activo} />
                                        </div>
                                        <p className="text-sm text-gray-500">{u.rol}</p>
                                        {puedeDesactivar(u) && (
                                            <div className="text-right mt-2">
                                                <BotonDesactivar habilitado onClick={() => desactivar(u)} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
