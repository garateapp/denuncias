import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import KanbanBoard from '@/Components/KanbanBoard';
import { Inertia } from '@inertiajs/inertia';

export default function DenunciaIndex({ auth, denuncias, currentView }) {
    const [viewMode, setViewMode] = useState(currentView);

    useEffect(() => {
        setViewMode(currentView);
    }, [currentView]);

    const handleViewChange = (mode) => {
        Inertia.visit(route('admin.denuncias.index', { view: mode }), { preserveScroll: true });
    };

    // Determine which data to pass to KanbanBoard
    const kanbanDenuncias = Array.isArray(denuncias.data) ? denuncias.data : denuncias;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Administración de Denuncias</h2>}
        >
            <Head title="Administración de Denuncias" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Denuncias</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleViewChange('list')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Vista de Lista
                                    </button>
                                    <button
                                        onClick={() => handleViewChange('kanban')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        Vista Kanban
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código de Seguimiento</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría y Tipos</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {denuncias.data.map((denuncia) => (
                                                    <tr key={denuncia.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{denuncia.codigo_seguimiento}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="mb-1">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {denuncia.categoria_denuncia}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {denuncia.tipos.map(tipo => (
                                                                    <span key={tipo.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                                                        {tipo.nombre}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{denuncia.descripcion.substring(0, 50)}...</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{denuncia.estado}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(denuncia.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link href={route('admin.denuncias.show', denuncia.id)} className="text-indigo-600 hover:text-indigo-900">Ver Detalle</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-4 flex justify-between">
                                        {denuncias.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm leading-4 font-medium rounded-md ${link.active ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:text-gray-500'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <KanbanBoard denuncias={kanbanDenuncias} onStatusChange={() => handleViewChange('kanban')} isReadOnly={auth.user.roles.includes('Gerencia')} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
