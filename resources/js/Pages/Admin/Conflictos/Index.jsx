import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const statusBadgeClass = (status) => {
    switch (status) {
        case 'sin_observaciones':
            return 'bg-green-100 text-green-800';
        case 'con_observaciones':
            return 'bg-yellow-100 text-yellow-800';
        case 'requiere_seguimiento':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Index({ auth, declarations, statusFilter, statusOptions, statusLabels }) {
    const list = declarations.data ?? [];

    const handleFilterChange = (event) => {
        const value = event.target.value;
        Inertia.get(route('admin.conflictos.index'), { status: value }, { preserveState: true, replace: true });
    };

    const resolveStatusLabel = (status) => {
        if (!status) {
            return 'Pendiente';
        }
        return statusLabels[status] ?? status;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Declaraciones de Conflictos de Interés</h2>}
        >
            <Head title="Declaraciones de Conflictos de Interés" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Formularios recibidos</h3>
                                    <p className="text-sm text-gray-500">Revisa y gestiona las declaraciones anuales de conflictos de interés.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por estado</label>
                                    <select
                                        value={statusFilter}
                                        onChange={handleFilterChange}
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Colaborador</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa / Área / Cargo</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revisado por</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {list.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                                                    No hay declaraciones que coincidan con el filtro seleccionado.
                                                </td>
                                            </tr>
                                        )}
                                        {list.map((declaration) => (
                                            <tr key={declaration.id}>
                                                <td className="px-4 py-4">
                                                    <p className="font-semibold text-gray-900">{declaration.nombre_colaborador}</p>
                                                    <p className="text-sm text-gray-500">{declaration.rut}</p>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    <p className="font-medium">{declaration.empresa}</p>
                                                    <p>{declaration.area}</p>
                                                    <p className="text-gray-500">{declaration.cargo}</p>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    <p>{new Date(declaration.fecha).toLocaleDateString()}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Enviado: {new Date(declaration.created_at).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(declaration.review_status)}`}>
                                                        {resolveStatusLabel(declaration.review_status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">
                                                    {declaration.reviewer ? (
                                                        <>
                                                            <p>{declaration.reviewer.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {declaration.reviewed_at ? new Date(declaration.reviewed_at).toLocaleString() : ''}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-400">Pendiente</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium">
                                                    <Link
                                                        href={route('admin.conflictos.show', declaration.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {declarations.links?.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded-md ${link.active ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 text-sm rounded-md text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
