import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

export default function UserIndex({ auth, users, roles }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        roles: [],
    });

    const [editingUser, setEditingUser] = useState(null);

    const startEditing = (user) => {
        setEditingUser(user);
        setData('roles', user.roles.map(role => role.name));
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.updateRole', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Usuarios</h2>}
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Usuarios</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.roles.map(role => role.name).join(', ')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <PrimaryButton onClick={() => startEditing(user)}>Gestionar Roles</PrimaryButton>
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

            {/* Manage Roles Modal */}
            <Modal show={editingUser !== null} onClose={() => setEditingUser(null)} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Gestionar Roles para {editingUser?.name}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {roles.map((role) => (
                            <div key={role.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`role-${role.id}`}
                                    value={role.name}
                                    checked={data.roles.includes(role.name)}
                                    onChange={(e) => {
                                        const newRoles = e.target.checked
                                            ? [...data.roles, role.name]
                                            : data.roles.filter(name => name !== role.name);
                                        setData('roles', newRoles);
                                    }}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <label htmlFor={`role-${role.id}`} className="ml-2 text-sm text-gray-600">
                                    {role.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <InputError message={errors.roles} className="mt-2" />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => { setEditingUser(null); reset(); }}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Guardar Roles
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
