import { Head, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Welcome({ auth }) {
    const [modalType, setModalType] = useState(null); // null, 'sugerencia', or 'felicitacion'

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        email: '',
        detalle: '',
        tipo: '',
    });

    const openModal = (type) => {
        reset();
        setData('tipo', type);
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('sugerencias.felicitaciones.store'), {
            onSuccess: () => {
                closeModal();
                if (data.tipo === 'sugerencia') {
                    Swal.fire({
                        title: '¡Gracias por tu sugerencia!',
                        text: 'Tus comentarios son muy valiosos y nos ayudan a crecer y mejorar cada día. Hemos recibido tu mensaje y lo tendremos en cuenta.',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    Swal.fire({
                        title: '¡Gracias por tus palabras!',
                        text: 'Nos alegra enormemente recibir tu felicitación. Mensajes como el tuyo nos motivan a seguir dando lo mejor de nosotros.',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                    });
                }
            },
        });
    };

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
                                className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20]"
                            >
                                Seguimiento
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-gray-700 ring-1 ring-transparent transition hover:text-gray-900 focus:outline-none focus-visible:ring-[#FF2D20]"
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
                            Canal de Denuncias, Sugerencias y Felicitaciones
                        </h1>
                        <p className="text-xl text-gray-600 mb-10">
                            Un espacio seguro y confidencial para mejorar nuestro ambiente de trabajo.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Acoso o Violencia Laboral</h2>
                                    <p className="text-gray-600 mb-6">
                                        Reporta situaciones de acoso sexual, acoso laboral o violencia en el trabajo, conforme a la Ley Karin.
                                    </p>
                                </div>
                                <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'leyKarin' })}>
                                    Iniciar Denuncia
                                </PrimaryButton>
                            </div>
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Delitos o Faltas a la Ética</h2>
                                    <p className="text-gray-600 mb-6">
                                        Informa sobre robos, fraudes, sobornos, o cualquier otra conducta contraria a nuestro código de ética.
                                    </p>
                                </div>
                                <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'delitosYEtica' })}>
                                    Iniciar Denuncia
                                </PrimaryButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-blue-50 overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-800 mb-3">Sugerencias</h2>
                                    <p className="text-blue-600 mb-6">
                                        ¿Tienes una idea para mejorar? Compártela con nosotros.
                                    </p>
                                </div>
                                <PrimaryButton onClick={() => openModal('sugerencia')} className="bg-blue-600 hover:bg-blue-700">
                                    Enviar Sugerencia
                                </PrimaryButton>
                            </div>
                            <div className="bg-green-50 overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-green-800 mb-3">Felicitaciones</h2>
                                    <p className="text-green-600 mb-6">
                                        Reconoce el buen trabajo de nuestros equipos y colaboradores.
                                    </p>
                                </div>
                                <PrimaryButton onClick={() => openModal('felicitacion')} className="bg-green-600 hover:bg-green-700">
                                    Enviar Felicitación
                                </PrimaryButton>
                            </div>
                        </div>

                        {/* <div className="mt-12 text-left">
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center md:text-left">
                                    Declaración de Conflictos de Interés
                                </h2>
                                <p className="text-gray-600 mb-6 text-center md:text-left">
                                    Ingresa  para completar el formulario oficial, registrar tus datos personales
                                    y declarar eventuales situaciones que puedan afectar la independencia o imparcialidad en tus funciones.
                                </p>
                                <div className="flex justify-center md:justify-start">
                                    <PrimaryButton onClick={() => (window.location.href = route('conflictos.create'))}>
                                        Abrir formulario
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </main>

                <footer className="py-6 mt-10 text-center text-sm text-gray-600">
                    <p className="mb-4">
                        Garantizamos la absoluta confidencialidad de la información y la protección total del denunciante contra cualquier tipo de represalia.
                    </p>
                    &copy; {new Date().getFullYear()} Greenex. Todos los derechos reservados.
                </footer>
            </div>

            <Modal show={modalType !== null} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {modalType === 'sugerencia' ? 'Enviar Sugerencia' : 'Enviar Felicitación'}
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="nombre" value="Nombre *" />
                        <TextInput
                            id="nombre"
                            name="nombre"
                            value={data.nombre}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('nombre', e.target.value)}
                            required
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="email" value="Email (Opcional)" />
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="detalle" value={`${modalType === 'sugerencia' ? 'Detalle de la Sugerencia' : 'Detalle de la Felicitación'} *`} />
                        <textarea
                            id="detalle"
                            name="detalle"
                            value={data.detalle}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="4"
                            onChange={(e) => setData('detalle', e.target.value)}
                            required
                        ></textarea>
                        <InputError message={errors.detalle} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Enviar
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
