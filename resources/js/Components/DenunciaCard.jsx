import React from 'react';
import { Link } from '@inertiajs/react';

const getUrgencyClass = (level) => {
    switch (level) {
        case 'Media': return 'bg-orange-400';
        case 'Alta': return 'bg-red-500';
        default: return 'bg-gray-300';
    }
};

export default function DenunciaCard({ denuncia }) {
    return (
        <Link href={route('admin.denuncias.show', denuncia.id)} className="block">
            <div className="bg-white rounded-md shadow-sm p-3 border-l-4 border-indigo-500 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-gray-800">{denuncia.codigo_seguimiento}</p>
                    <div className={`w-3 h-3 rounded-full ${getUrgencyClass(denuncia.urgency_level)}`} title={`Urgencia: ${denuncia.urgency_level}`}></div>
                </div>
                <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {denuncia.categoria_denuncia}
                    </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {denuncia.tipos.map(tipo => (
                        <span key={tipo.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            {tipo.nombre}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-gray-700 mb-2 truncate">{denuncia.descripcion}</p>
                <div className="text-xs text-gray-500">
                    <p>Asignado a: {denuncia.assigned_user ? denuncia.assigned_user.name : 'N/A'}</p>
                </div>
            </div>
        </Link>
    );
}
