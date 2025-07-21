import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo'; // Assuming this component exists or will be created
import PrimaryButton from '@/Components/PrimaryButton';

export default function Welcome({ auth }) {
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
                            <PrimaryButton
                                onClick={() => window.location.href = route('denuncias.create')}
                                className="ml-4"
                            >
                                Realizar Denuncia
                            </PrimaryButton>
                            <Link
                                    href={route('seguimiento.index')}
                                    className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                >
                                    Seguimiento
                                </Link>
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                    {auth.user.rol === 'admin' && (
                                        <Link
                                            href={route('admin.denuncias.index')}
                                            className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                        >
                                            Administración
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-white"
                                    >
                                        Iniciar Sesión
                                    </Link>

                                </>
                            )}


                        </nav>
                    </div>
                </header>

                <main className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="p-6 sm:px-20 bg-white border-b border-gray-200">
                                <div className="text-2xl font-bold text-gray-800 mb-4">
                                    Canal de Denuncias Greenex: Nuestro Compromiso con la Ética y la Transparencia
                                </div>

                                <div className="mt-6 text-gray-700 leading-relaxed">
                                    <p className="mb-4">
                                        En Greenex, la integridad, la ética y el respeto son pilares fundamentales de nuestra cultura corporativa. Estamos firmemente comprometidos con la creación y el mantenimiento de un ambiente de trabajo seguro, justo y libre de cualquier forma de acoso, discriminación o conducta indebida. Este Canal de Denuncias es una manifestación tangible de ese compromiso.
                                    </p>
                                    <p className="mb-4">
                                        Diseñado bajo los más altos estándares de seguridad y confidencialidad, nuestro canal permite a empleados, colaboradores, proveedores y terceros reportar de manera segura y, si lo desean, anónima, cualquier situación que consideren contraria a nuestros valores, políticas internas o la legislación vigente. Esto incluye, pero no se limita a, casos de acoso laboral, acoso sexual, violencia en el trabajo, o cualquier otra conducta que pueda constituir un delito según la Ley N°20.393 sobre Responsabilidad Penal de las Personas Jurídicas.
                                    </p>
                                    <p className="mb-4">
                                        La implementación de este canal no solo cumple con las exigencias de la normativa chilena, como la reciente Ley Karin (Ley 21.643), sino que refuerza nuestra proactividad en la detección y prevención de riesgos. Creemos que un entorno donde la voz de cada individuo es valorada y protegida es esencial para el bienestar de nuestros trabajadores y para el éxito sostenible de nuestra organización.
                                    </p>
                                    <p className="mb-4">
                                        Garantizamos la absoluta confidencialidad de la información y la protección total del denunciante contra cualquier tipo de represalia. Cada reporte será tratado con la seriedad, imparcialidad y diligencia que merece, asegurando un proceso de investigación justo y transparente.
                                    </p>
                                    <p>
                                        Su colaboración es crucial para mantener un ambiente de trabajo íntegro y respetuoso. Le invitamos a utilizar este canal con responsabilidad, contribuyendo activamente a la construcción de una Greenex más fuerte y ética.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-4 text-center text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} Greenex. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}
