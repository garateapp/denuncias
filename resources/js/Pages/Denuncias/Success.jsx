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
        </GuestLayout>
    );
}
