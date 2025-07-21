import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Show({ auth, denuncia }) {
    const { data, setData, patch, post, processing, errors, reset } = useForm({
        estado: denuncia.estado,
        comentario: '',
        estado_nuevo: denuncia.estado,
    });

    const updateStatus = (e) => {
        e.preventDefault();
        patch(route('admin.denuncias.update', denuncia.id), {
            onSuccess: () => alert('Estado actualizado.'),
        });
    };

    const addUpdate = (e) => {
        e.preventDefault();
        post(route('admin.denuncias.addUpdate', denuncia.id), {
            onSuccess: () => {
                alert('Actualización añadida.');
                reset('comentario', 'estado_nuevo');
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalle de Denuncia</h2>}
        >
            <Head title="Detalle de Denuncia" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Denuncia #{denuncia.codigo_seguimiento}</h3>

                        <div className="mb-4">
                            <p className="text-gray-600">Estado:</p>
                            <p className="font-bold text-lg">{denuncia.estado}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Descripción de los hechos:</p>
                            <p>{denuncia.descripcion}</p>
                        </div>

                        {denuncia.implicados && (
                            <div className="mb-4">
                                <p className="text-gray-600">Posibles implicados:</p>
                                <p>{denuncia.implicados}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <p className="text-gray-600">Medidas de protección solicitadas:</p>
                            <p>{denuncia.medidas_proteccion_solicitadas ? 'Sí' : 'No'}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Denuncia anónima:</p>
                            <p>{denuncia.es_anonima ? 'Sí' : 'No'}</p>
                        </div>

                        {!denuncia.es_anonima && (
                            <>
                                <div className="mb-4">
                                    <p className="text-gray-600">Nombre del denunciante:</p>
                                    <p>{denuncia.nombre_denunciante}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600">Apellidos del denunciante:</p>
                                    <p>{denuncia.apellidos_denunciante}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600">Género del denunciante:</p>
                                    <p>{denuncia.genero_denunciante}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600">Email Personal del denunciante:</p>
                                    <p>{denuncia.email_personal_denunciante}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600">RUT del denunciante:</p>
                                    <p>{denuncia.rut_denunciante}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600">Teléfono del denunciante:</p>
                                    <p>{denuncia.telefono_denunciante}</p>
                                </div>
                            </>
                        )}

                        {(denuncia.nombre_denunciado || denuncia.apellidos_denunciado || denuncia.area_denunciado || denuncia.cargo_denunciado) && (
                            <>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Datos del Denunciado</h4>
                                {denuncia.nombre_denunciado && (
                                    <div className="mb-4">
                                        <p className="text-gray-600">Nombre del Denunciado:</p>
                                        <p>{denuncia.nombre_denunciado}</p>
                                    </div>
                                )}
                                {denuncia.apellidos_denunciado && (
                                    <div className="mb-4">
                                        <p className="text-gray-600">Apellidos del Denunciado:</p>
                                        <p>{denuncia.apellidos_denunciado}</p>
                                    </div>
                                )}
                                {denuncia.area_denunciado && (
                                    <div className="mb-4">
                                        <p className="text-gray-600">Área o Sector del Denunciado:</p>
                                        <p>{denuncia.area_denunciado}</p>
                                    </div>
                                )}
                                {denuncia.cargo_denunciado && (
                                    <div className="mb-4">
                                        <p className="text-gray-600">Cargo o Puesto del Denunciado:</p>
                                        <p>{denuncia.cargo_denunciado}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {denuncia.evidencias && denuncia.evidencias.length > 0 && (
                            <div className="mb-4">
                                <p className="text-gray-600">Evidencias:</p>
                                <ul>
                                    {denuncia.evidencias.map((evidencia) => (
                                        <li key={evidencia.id}>
                                            <a href={`/storage/${evidencia.ruta_archivo}`} target="_blank" className="text-blue-500 hover:underline">
                                                {evidencia.nombre_archivo}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <h4 className="text-lg font-medium text-gray-900 mb-2">Actualizar Estado</h4>
                        <form onSubmit={updateStatus} className="mb-6">
                            <div className="mb-4">
                                <InputLabel htmlFor="estado" value="Estado" />
                                <select
                                    id="estado"
                                    name="estado"
                                    value={data.estado}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('estado', e.target.value)}
                                >
                                    <option value="Recibida">Recibida</option>
                                    <option value="En Investigación">En Investigación</option>
                                    <option value="Resuelta">Resuelta</option>
                                    <option value="Cerrada">Cerrada</option>
                                </select>
                                <InputError message={errors.estado} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={processing}>Actualizar Estado</PrimaryButton>
                        </form>

                        <h4 className="text-lg font-medium text-gray-900 mb-2">Añadir Actualización</h4>
                        <form onSubmit={addUpdate}>
                            <div className="mb-4">
                                <InputLabel htmlFor="comentario" value="Comentario" />
                                <textarea
                                    id="comentario"
                                    name="comentario"
                                    value={data.comentario}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('comentario', e.target.value)}
                                    required
                                ></textarea>
                                <InputError message={errors.comentario} className="mt-2" />
                            </div>
                            <div className="mb-4">
                                <InputLabel htmlFor="estado_nuevo" value="Nuevo Estado" />
                                <select
                                    id="estado_nuevo"
                                    name="estado_nuevo"
                                    value={data.estado_nuevo}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('estado_nuevo', e.target.value)}
                                >
                                    <option value="Recibida">Recibida</option>
                                    <option value="En Investigación">En Investigación</option>
                                    <option value="Resuelta">Resuelta</option>
                                    <option value="Cerrada">Cerrada</option>
                                </select>
                                <InputError message={errors.estado_nuevo} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={processing}>Añadir Actualización</PrimaryButton>
                        </form>

                        {denuncia.actualizaciones && denuncia.actualizaciones.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Historial de Actualizaciones</h4>
                                <ul>
                                    {denuncia.actualizaciones.map((actualizacion) => (
                                        <li key={actualizacion.id} className="mb-2 p-3 border rounded-lg bg-gray-50">
                                            <p className="font-semibold">Estado: {actualizacion.estado_nuevo} {actualizacion.estado_anterior && `(desde ${actualizacion.estado_anterior})`}</p>
                                            <p>{actualizacion.comentario}</p>
                                            <p className="text-sm text-gray-500">Por: {actualizacion.user ? actualizacion.user.name : 'N/A'} el {new Date(actualizacion.created_at).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
