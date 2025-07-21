import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Show({ denuncia }) {
    return (
        <GuestLayout>
            <Head title="Detalle de Denuncia" />

            <h2 className="text-xl font-semibold text-gray-800 leading-tight mb-4">Detalle de Denuncia</h2>

            {!denuncia ? (
                <div className="text-red-500">Denuncia no encontrada.</div>
            ) : (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="mb-4">
                        <p className="text-gray-600">Código de Seguimiento:</p>
                        <p className="font-bold text-lg">{denuncia.codigo_seguimiento}</p>
                    </div>

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

                    {denuncia.actualizaciones && denuncia.actualizaciones.length > 0 && (
                        <div className="mb-4">
                            <p className="text-gray-600">Actualizaciones:</p>
                            <ul>
                                {denuncia.actualizaciones.map((actualizacion) => (
                                    <li key={actualizacion.id} className="mb-2 p-2 border rounded">
                                        <p className="font-semibold">Estado: {actualizacion.estado_nuevo}</p>
                                        <p>{actualizacion.comentario}</p>
                                        <p className="text-sm text-gray-500">{new Date(actualizacion.created_at).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </GuestLayout>
    );
}
