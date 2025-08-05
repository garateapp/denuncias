import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TabButton from '@/Components/TabButton';
import { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Show({ auth, denuncia, investigators, isLeyKarin }) {
    const [activeTab, setActiveTab] = useState(auth.user.roles.includes('Gerencia') ? 'historial' : 'actualizacion');
    const [infoTab, setInfoTab] = useState('denunciante');
    const fileInput = useRef();
    const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Management Panel Data
        comentario: '',
        estado_nuevo: denuncia.estado,
        evidencias: [],
        message: '',
        assigned_user_id: denuncia.assigned_user_id || '',
        urgency_level: denuncia.urgency_level || 'Baja',
        fecha_inicio_investigacion: denuncia.fecha_inicio_investigacion?.split(' ')[0] || '',
        fecha_informe_investigacion: denuncia.fecha_informe_investigacion?.split(' ')[0] || '',
        fecha_aplicacion_medidas: denuncia.fecha_aplicacion_medidas?.split(' ')[0] || '',
        fecha_derivacion_dt: denuncia.fecha_derivacion_dt?.split(' ')[0] || '',
        fecha_notificacion_diat: denuncia.fecha_notificacion_diat?.split(' ')[0] || '',
    });

    const addUpdate = (e) => {
        e.preventDefault();
        post(route('admin.denuncias.addUpdate', denuncia.id), {
            onSuccess: () => {
                reset();
                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
            preserveScroll: true,
        });
    };

    const assignDenuncia = (e) => {
        e.preventDefault();
        post(route('admin.denuncias.assign', denuncia.id), {
            preserveScroll: true,
        });
    };

    const updateDeadlines = (e) => {
        e.preventDefault();
        post(route('admin.denuncias.updateDeadlines', denuncia.id), {
            preserveScroll: true,
        });
    };

    const requestInfo = (e) => {
        e.preventDefault();
        post(route('admin.denuncias.requestMoreInfo', denuncia.id), {
            onSuccess: () => {
                reset('message'); // Reset only the message field
                setShowRequestInfoModal(false);
            },
            preserveScroll: true,
        });
    };

    const handleFileChange = (e) => {
        setData('evidencias', Array.from(e.target.files));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Recibida': return 'bg-blue-100 text-blue-800';
            case 'En Investigación': return 'bg-yellow-100 text-yellow-800';
            case 'Resuelta': return 'bg-green-100 text-green-800';
            case 'Cerrada': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUrgencyClass = (level) => {
        switch (level) {
            case 'Baja': return 'bg-gray-200 text-gray-800';
            case 'Media': return 'bg-orange-200 text-orange-800';
            case 'Alta': return 'bg-red-200 text-red-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalle de Denuncia</h2>}
        >
            <Head title={`Denuncia ${denuncia.codigo_seguimiento}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Columna Izquierda - Información */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card: Resumen de la Denuncia */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Denuncia #{denuncia.codigo_seguimiento}</h3>
                                        <p className="text-sm text-gray-500">Recibida el: {new Date(denuncia.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(denuncia.estado)}`}>
                                            {denuncia.estado}
                                        </span>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyClass(denuncia.urgency_level)}`}>
                                            {denuncia.urgency_level || 'Sin Urgencia'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600">Categoría de Denuncia:</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {denuncia.categoria_denuncia}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600">Tipos de Denuncia:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {denuncia.tipos.map(tipo => (
                                            <span key={tipo.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                                {tipo.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600">Comisionado Asignado:</p>
                                    <p className="font-semibold text-gray-800">{denuncia.assigned_user ? denuncia.assigned_user.name : 'Sin Asignar'}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600">Descripción de los Hechos:</p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{denuncia.descripcion}</p>
                                </div>

                                {denuncia.implicados && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Posibles Implicados:</p>
                                        <p className="text-gray-800 whitespace-pre-wrap">{denuncia.implicados}</p>
                                    </div>
                                )}
                            </div>

                            {/* Card: Involucrados y Evidencias */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="border-b border-gray-200 mb-4">
                                    <nav className="-mb-px flex space-x-4">
                                        <TabButton onClick={() => setInfoTab('denunciante')} active={infoTab === 'denunciante'}>Denunciante</TabButton>
                                        <TabButton onClick={() => setInfoTab('denunciado')} active={infoTab === 'denunciado'}>Denunciado</TabButton>
                                        <TabButton onClick={() => setInfoTab('evidencias')} active={infoTab === 'evidencias'}>Evidencias</TabButton>
                                    </nav>
                                </div>

                                {infoTab === 'denunciante' && (
                                    <div>
                                        {denuncia.es_anonima ? (
                                            <p className="text-gray-600 italic">La denuncia fue realizada de forma anónima.</p>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-semibold">Nombre:</span> {denuncia.nombre_denunciante} {denuncia.apellidos_denunciante}</div>
                                                <div><span className="font-semibold">RUT:</span> {denuncia.rut_denunciante}</div>
                                                <div><span className="font-semibold">Email:</span> {denuncia.email_personal_denunciante}</div>
                                                <div><span className="font-semibold">Teléfono:</span> {denuncia.telefono_denunciante}</div>
                                                <div><span className="font-semibold">Género:</span> {denuncia.genero_denunciante}</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {infoTab === 'denunciado' && (
                                    <div>
                                        {(denuncia.nombre_denunciado || denuncia.apellidos_denunciado || denuncia.area_denunciado || denuncia.cargo_denunciado) ? (
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div><span className="font-semibold">Nombre:</span> {denuncia.nombre_denunciado} {denuncia.apellidos_denunciado}</div>
                                                <div><span className="font-semibold">Área/Sector:</span> {denuncia.area_denunciado}</div>
                                                <div><span className="font-semibold">Cargo/Puesto:</span> {denuncia.cargo_denunciado}</div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 italic">No se proporcionaron datos del denunciado.</p>
                                        )}
                                    </div>
                                )}

                                {infoTab === 'evidencias' && (
                                    <div>
                                        {denuncia.evidencias && denuncia.evidencias.length > 0 ? (
                                            <ul className="list-disc pl-5 space-y-2">
                                                {denuncia.evidencias.map((evidencia) => (
                                                    <li key={evidencia.id}>
                                                        <a href={`/storage/${evidencia.ruta_archivo}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                                            {evidencia.nombre_archivo}
                                                        </a>
                                                        <span className="text-gray-500 text-xs ml-2">({(evidencia.tamano / 1024).toFixed(2)} KB)</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 italic">No se adjuntaron evidencias.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha - Panel de Gestión */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Panel de Gestión</h3>
                                    <div className="border-b border-gray-200 mb-4">
                                        <nav className="-mb-px flex space-x-2">
                                            {/* Tab buttons for different roles */}
                                            {!auth.user.roles.includes('Gerencia') && (
                                                <TabButton onClick={() => setActiveTab('actualizacion')} active={activeTab === 'actualizacion'}>Actualizar</TabButton>
                                            )}
                                            {!auth.user.roles.includes('Comisionado') && !auth.user.roles.includes('Gerencia') && (
                                                <TabButton onClick={() => setActiveTab('asignar')} active={activeTab === 'asignar'}>Asignar</TabButton>
                                            )}
                                            {isLeyKarin && !auth.user.roles.includes('Gerencia') && (
                                                <TabButton onClick={() => setActiveTab('plazos')} active={activeTab === 'plazos'}>Plazos</TabButton>
                                            )}
                                            <TabButton onClick={() => setActiveTab('historial')} active={activeTab === 'historial'}>Historial</TabButton>
                                        </nav>
                                    </div>

                                    {/* Botón para solicitar más antecedentes */}
                                    {denuncia.email_personal_denunciante && (auth.user.roles.includes('Comisionado') || auth.user.roles.includes('Administrador') || auth.user.roles.includes('super-admin')) && (
                                        <div className="mt-4">
                                            <PrimaryButton onClick={() => setShowRequestInfoModal(true)}>
                                                Solicitar Más Antecedentes
                                            </PrimaryButton>
                                        </div>
                                    )}

                                    {/* Modal para solicitar más antecedentes */}
                                    <Modal show={showRequestInfoModal} onClose={() => setShowRequestInfoModal(false)}>
                                        <form onSubmit={requestInfo} className="p-6">
                                            <h2 className="text-lg font-medium text-gray-900">Solicitar Más Antecedentes</h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Envía un correo electrónico al denunciante solicitando más información.
                                            </p>
                                            <div className="mt-6">
                                                <InputLabel htmlFor="message" value="Mensaje" className="sr-only" />
                                                <textarea
                                                    id="message"
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    rows="5"
                                                    placeholder="Escribe tu mensaje aquí..."
                                                    required
                                                ></textarea>
                                                <InputError message={errors.message} className="mt-2" />
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <SecondaryButton onClick={() => setShowRequestInfoModal(false)}>
                                                    Cancelar
                                                </SecondaryButton>
                                                <PrimaryButton className="ms-3" disabled={processing}>
                                                    Enviar Solicitud
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </Modal>

                                    {/* Pestaña: Añadir Actualización */}
                                    {activeTab === 'actualizacion' && (
                                        <form onSubmit={addUpdate} className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="comentario" value="Nuevo Comentario" />
                                                <textarea id="comentario" value={data.comentario} onChange={(e) => setData('comentario', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                                <InputError message={errors.comentario} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="estado_nuevo" value="Cambiar Estado" />
                                                <SelectInput id="estado_nuevo" value={data.estado_nuevo} onChange={(e) => setData('estado_nuevo', e.target.value)} className="mt-1 block w-full">
                                                    <option value="Recibida">Recibida</option>
                                                    <option value="En Investigación">En Investigación</option>
                                                    <option value="Resuelta">Resuelta</option>
                                                    <option value="Cerrada">Cerrada</option>
                                                </SelectInput>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="evidencias" value="Adjuntar Nuevas Evidencias" />
                                                <input ref={fileInput} id="evidencias" type="file" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                                <InputError message={errors.evidencias} className="mt-2" />
                                            </div>
                                            <PrimaryButton disabled={processing}>Añadir Actualización</PrimaryButton>
                                        </form>
                                    )}

                                    {/* Pestaña: Asignar y Priorizar */}
                                    {!auth.user.roles.includes('Comisionado') && !auth.user.roles.includes('Gerencia') && activeTab === 'asignar' && (
                                        <form onSubmit={assignDenuncia} className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="assigned_user_id" value="Asignar Comisionado" />
                                                <SelectInput id="assigned_user_id" value={data.assigned_user_id} onChange={(e) => setData('assigned_user_id', e.target.value)} className="mt-1 block w-full">
                                                    <option value="">Sin Asignar</option>
                                                    {investigators.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                                </SelectInput>
                                                <InputError message={errors.assigned_user_id} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="urgency_level" value="Nivel de Urgencia" />
                                                <SelectInput id="urgency_level" value={data.urgency_level} onChange={(e) => setData('urgency_level', e.target.value)} className="mt-1 block w-full">
                                                    <option value="Baja">Baja</option>
                                                    <option value="Media">Media</option>
                                                    <option value="Alta">Alta</option>
                                                </SelectInput>
                                                <InputError message={errors.urgency_level} className="mt-2" />
                                            </div>
                                            <PrimaryButton disabled={processing}>Guardar Asignación</PrimaryButton>
                                        </form>
                                    )}

                                    {/* Pestaña: Gestionar Plazos (Ley Karin) */}
                                    {activeTab === 'plazos' && isLeyKarin && !auth.user.roles.includes('Gerencia') && (
                                        <form onSubmit={updateDeadlines} className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="fecha_inicio_investigacion" value="Inicio Investigación" />
                                                <TextInput type="date" id="fecha_inicio_investigacion" value={data.fecha_inicio_investigacion} onChange={(e) => setData('fecha_inicio_investigacion', e.target.value)} className="mt-1 block w-full" />
                                                {denuncia.fecha_fin_investigacion_prevista && <p className="text-xs text-gray-500 mt-1">Vence: {denuncia.fecha_fin_investigacion_prevista}</p>}
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="fecha_informe_investigacion" value="Informe Investigación" />
                                                <TextInput type="date" id="fecha_informe_investigacion" value={data.fecha_informe_investigacion} onChange={(e) => setData('fecha_informe_investigacion', e.target.value)} className="mt-1 block w-full" />
                                                {denuncia.fecha_aplicacion_medidas_prevista && <p className="text-xs text-gray-500 mt-1">Plazo medidas: {denuncia.fecha_aplicacion_medidas_prevista}</p>}
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="fecha_notificacion_diat" value="Notificación DIAT" />
                                                <TextInput type="date" id="fecha_notificacion_diat" value={data.fecha_notificacion_diat} onChange={(e) => setData('fecha_notificacion_diat', e.target.value)} className="mt-1 block w-full" />
                                            </div>
                                            <PrimaryButton disabled={processing}>Guardar Fechas</PrimaryButton>
                                        </form>
                                    )}

                                    {/* Pestaña: Historial */}
                                    {activeTab === 'historial' && (
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            {denuncia.actualizaciones && denuncia.actualizaciones.length > 0 ? (
                                                denuncia.actualizaciones.map((actualizacion) => (
                                                    <div key={actualizacion.id} className="p-3 border rounded-lg bg-gray-50 text-sm">
                                                        <p className="font-semibold">De <span className="font-bold">{actualizacion.estado_anterior}</span> a <span className="font-bold">{actualizacion.estado_nuevo}</span></p>
                                                        <p className="text-gray-700 my-1">{actualizacion.comentario}</p>
                                                        <p className="text-xs text-gray-500">Por: {actualizacion.user ? actualizacion.user.name : 'N/A'} - {new Date(actualizacion.created_at).toLocaleString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600 italic">No hay actualizaciones.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}