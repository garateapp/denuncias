import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Welcome({ auth, leyKarinTipos, otrosTipos }) {

    const leyKarinIds = leyKarinTipos.map(tipo => tipo.id);
    const otrosIds = otrosTipos.map(tipo => tipo.id);

    return (
        <>
            <Head title="Canal de Denuncias Greenex" />
            <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
                <header className="bg-white shadow-sm py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <img src="/img/logo.webp" alt="Greenex Logo" className="h-12 w-auto" />
                            </Link>
                        </div>
                        <nav className="-mx-3 flex flex-1 justify-end items-center">
                            <Link
                                href={route('seguimiento.index')}
                                className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                            >
                                Seguimiento
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Canal de Denuncias Greenex
                        </h1>
                        <p className="text-xl text-gray-600 mb-10">
                            Un espacio seguro y confidencial para reportar conductas que atenten contra nuestros valores y la ley.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card para Ley Karin */}
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Acoso o Violencia Laboral</h2>
                                    <p className="text-gray-600 mb-6">
                                        Reporta situaciones de acoso sexual, acoso laboral o violencia en el trabajo, conforme a la Ley Karin.
                                    </p>
                                </div>
                                <PrimaryButton
                                    onClick={() => window.location.href = route('denuncias.create', { category: 'leyKarin' })}
                                >
                                    Iniciar Denuncia
                                </PrimaryButton>
                            </div>

                            {/* Card para Otros Delitos */}
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Delitos o Faltas a la Ética</h2>
                                    <p className="text-gray-600 mb-6">
                                        Informa sobre robos, fraudes, sobornos, o cualquier otra conducta contraria a nuestro código de ética.
                                    </p>
                                </div>
                                <PrimaryButton
                                    onClick={() => window.location.href = route('denuncias.create', { category: 'delitosYEtica' })}
                                >
                                    Iniciar Denuncia
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-6 mt-10 text-center text-sm text-gray-600">
                    <p className="mb-4">
                        Garantizamos la absoluta confidencialidad de la información y la protección total del denunciante contra cualquier tipo de represalia.
                    </p>
                    &copy; {new Date().getFullYear()} Greenex. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}