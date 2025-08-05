import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';

export default function UserIndex({ auth, users, roles }) {
    const { data, setData, put, post, processing, errors, reset } = useForm({
        roles: [],
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [editingUser, setEditingUser] = useState(null);
    const [creatingUser, setCreatingUser] = useState(false);

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

    const createUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setCreatingUser(false);
                reset('name', 'email', 'password', 'password_confirmation', 'roles');
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
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>
                                <PrimaryButton onClick={() => setCreatingUser(true)}>
                                    Crear Usuario
                                </PrimaryButton>
                            </div>

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

            {/* Create User Modal */}
            <Modal show={creatingUser} onClose={() => setCreatingUser(false)} maxWidth="md">
                <form onSubmit={createUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Crear Nuevo Usuario
                    </h2>
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="email"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <InputLabel value="Roles" />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`create-role-${role.id}`}
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
                                    <label htmlFor={`create-role-${role.id}`} className="ml-2 text-sm text-gray-600">
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.roles} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => { setCreatingUser(false); reset(); }}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>
                            Crear Usuario
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

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
