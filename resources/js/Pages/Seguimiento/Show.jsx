import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ denuncia }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        comentario: '',
        evidencias: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('seguimiento.addPublicUpdate', denuncia.codigo_seguimiento), {
            onSuccess: () => reset(),
        });
    };

    const handleFileChange = (e) => {
        setData('evidencias', Array.from(e.target.files));
    };

    return (
        <GuestLayout>
            <Head title={`Seguimiento de Denuncia ${denuncia.codigo_seguimiento}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seguimiento de Denuncia</h2>
                        <p className="mb-4">Aquí puede ver el estado de su denuncia y añadir más información si es necesario.</p>

                        <div className="mb-6">
                            <p><span className="font-semibold">Código de Seguimiento:</span> {denuncia.codigo_seguimiento}</p>
                            <p><span className="font-semibold">Estado:</span> {denuncia.estado}</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="comentario" value="Añadir Información Adicional" />
                                <textarea
                                    id="comentario"
                                    value={data.comentario}
                                    onChange={(e) => setData('comentario', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                <InputError message={errors.comentario} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="evidencias" value="Adjuntar Nuevas Evidencias" />
                                <input
                                    id="evidencias"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.evidencias} className="mt-2" />
                            </div>

                            <PrimaryButton disabled={processing}>Añadir Información</PrimaryButton>
                        </form>

                        {/* <div className="mt-8">
                            <h3 className="text-xl font-bold">Historial de la Denuncia</h3>
                            <div className="space-y-4 mt-4">
                                {denuncia.actualizaciones.map((actualizacion) => (
                                    <div key={actualizacion.id} className="p-4 border rounded-lg bg-gray-50">
                                        <p className="font-semibold">{new Date(actualizacion.created_at).toLocaleString()}</p>
                                        <p className="text-gray-700 my-1">{actualizacion.comentario}</p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
