import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function TiposDenunciaIndex({ auth, tiposDenuncia }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
    });

    const [editingTipoDenuncia, setEditingTipoDenuncia] = useState(null);
    const [confirmingTipoDenunciaDeletion, setConfirmingTipoDenunciaDeletion] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingTipoDenuncia) {
            put(route('admin.tipos_denuncia.update', editingTipoDenuncia.id), {
                onSuccess: () => {
                    reset();
                    setEditingTipoDenuncia(null);
                },
            });
        } else {
            post(route('admin.tipos_denuncia.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const confirmDeletion = (tipoDenuncia) => {
        setConfirmingTipoDenunciaDeletion(tipoDenuncia);
    };

    const handleDelete = () => {
        destroy(route('admin.tipos_denuncia.destroy', confirmingTipoDenunciaDeletion.id), {
            onSuccess: () => {
                setConfirmingTipoDenunciaDeletion(null);
            },
        });
    };

    const startEditing = (tipoDenuncia) => {
        setEditingTipoDenuncia(tipoDenuncia);
        setData('nombre', tipoDenuncia.nombre);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Tipos de Denuncia</h2>}
        >
            <Head title="Gestión de Tipos de Denuncia" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingTipoDenuncia ? 'Editar Tipo de Denuncia' : 'Crear Nuevo Tipo de Denuncia'}</h3>
                            <form onSubmit={submit} className="mb-8">
                                <InputLabel htmlFor="nombre" value="Nombre" />
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nombre} className="mt-2" />
                                <PrimaryButton className="mt-4" disabled={processing}>
                                    {editingTipoDenuncia ? 'Actualizar Tipo de Denuncia' : 'Crear Tipo de Denuncia'}
                                </PrimaryButton>
                                {editingTipoDenuncia && (
                                    <SecondaryButton onClick={() => { setEditingTipoDenuncia(null); reset(); }} className="ml-2 mt-4">
                                        Cancelar
                                    </SecondaryButton>
                                )}
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tiposDenuncia.map((tipo) => (
                                            <tr key={tipo.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{tipo.nombre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <PrimaryButton onClick={() => startEditing(tipo)} className="mr-2">Editar</PrimaryButton>
                                                    <DangerButton onClick={() => confirmDeletion(tipo)}>Eliminar</DangerButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingTipoDenunciaDeletion !== null} onClose={() => setConfirmingTipoDenunciaDeletion(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ¿Estás seguro de que quieres eliminar este Tipo de Denuncia?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Esta acción es irreversible.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingTipoDenunciaDeletion(null)}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} className="ml-3">
                            Eliminar
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
