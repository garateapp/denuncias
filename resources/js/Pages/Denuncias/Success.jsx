import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Success({ codigoSeguimiento }) {
    return (
        <GuestLayout>
            <Head title="Denuncia Enviada" />

            <div className="mb-4 text-sm text-gray-600">
                Tu denuncia ha sido enviada exitosamente. Por favor, guarda el siguiente código de seguimiento para consultar el estado de tu denuncia:
            </div>

            <div className="mb-4 text-center text-2xl font-bold text-gray-800">
                {codigoSeguimiento}
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href={route('seguimiento.index')}
                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Consultar estado de mi denuncia
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Confidencialidad Garantizada</h3>
                    <p className="text-gray-600 text-sm">Tu identidad y la información de tu denuncia serán protegidas y son tratadas con la máxima reserva. Su identidad, en los casos que se requiera, solo será conocida por el equipo de investigación.</p>
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Cero Represalias</h3>
                    <p className="text-gray-600 text-sm">Greenex prohibe y sanciona cualquier tipo de represalia contra quienes denuncian de buena f. Su protección es nuestra prioridad.</p>
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Gestión Externa</h3>
                    <p className="text-gray-600 text-sm">La recepción de denuncias es administrada por la empresa externa Resguarda para asegurar la imparcialidad y objetividad en el proceso.</p>
                </div>
            </div>
        </GuestLayout>
    );
}
