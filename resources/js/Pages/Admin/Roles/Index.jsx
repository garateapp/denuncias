import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function RolePermissionIndex({ auth, roles, permissions }) {
    const { data: roleData, setData: setRoleData, post: postRole, put: putRole, delete: deleteRole, processing: processingRole, errors: roleErrors, reset: resetRole } = useForm({
        name: '',
    });

    const { data: permissionData, setData: setPermissionData, post: postPermission, put: putPermission, delete: deletePermission, processing: processingPermission, errors: permissionErrors, reset: resetPermission } = useForm({
        name: '',
    });

    const { data: assignData, setData: setAssignData, post: postAssign, processing: processingAssign, errors: assignErrors, reset: resetAssign } = useForm({
        permissions: [],
    });

    const [editingRole, setEditingRole] = useState(null);
    const [editingPermission, setEditingPermission] = useState(null);
    const [assigningRole, setAssigningRole] = useState(null);
    const [confirmingRoleDeletion, setConfirmingRoleDeletion] = useState(null);
    const [confirmingPermissionDeletion, setConfirmingPermissionDeletion] = useState(null);

    const submitRole = (e) => {
        e.preventDefault();
        if (editingRole) {
            putRole(route('admin.roles.update', editingRole.id), {
                onSuccess: () => {
                    resetRole();
                    setEditingRole(null);
                },
            });
        } else {
            postRole(route('admin.roles.store'), {
                onSuccess: () => resetRole(),
            });
        }
    };

    const submitPermission = (e) => {
        e.preventDefault();
        if (editingPermission) {
            putPermission(route('admin.permissions.update', editingPermission.id), {
                onSuccess: () => {
                    resetPermission();
                    setEditingPermission(null);
                },
            });
        } else {
            postPermission(route('admin.permissions.store'), {
                onSuccess: () => resetPermission(),
            });
        }
    };

    const confirmRoleDeletion = (role) => {
        setConfirmingRoleDeletion(role);
    };

    const handleDeleteRole = () => {
        deleteRole(route('admin.roles.destroy', confirmingRoleDeletion.id), {
            onSuccess: () => {
                setConfirmingRoleDeletion(null);
            },
        });
    };

    const confirmPermissionDeletion = (permission) => {
        setConfirmingPermissionDeletion(permission);
    };

    const handleDeletePermission = () => {
        deletePermission(route('admin.permissions.destroy', confirmingPermissionDeletion.id), {
            onSuccess: () => {
                setConfirmingPermissionDeletion(null);
            },
        });
    };

    const startEditingRole = (role) => {
        setEditingRole(role);
        setRoleData('name', role.name);
    };

    const startEditingPermission = (permission) => {
        setEditingPermission(permission);
        setPermissionData('name', permission.name);
    };

    const startAssigningPermissions = (role) => {
        setAssigningRole(role);
        setAssignData('permissions', role.permissions.map(p => p.id));
    };

    const handleAssignPermissions = (e) => {
        e.preventDefault();
        postAssign(route('admin.roles.assignPermission', assigningRole.id), {
            onSuccess: () => {
                setAssigningRole(null);
                resetAssign();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Roles y Permisos</h2>}
        >
            <Head title="Gestión de Roles y Permisos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Role Management */}
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Roles</h3>
                            <form onSubmit={submitRole} className="mb-8">
                                <InputLabel htmlFor="roleName" value={editingRole ? 'Editar Rol' : 'Nuevo Rol'} />
                                <TextInput
                                    id="roleName"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={roleData.name}
                                    onChange={(e) => setRoleData('name', e.target.value)}
                                    required
                                />
                                <InputError message={roleErrors.name} className="mt-2" />
                                <PrimaryButton className="mt-4" disabled={processingRole}>
                                    {editingRole ? 'Actualizar Rol' : 'Crear Rol'}
                                </PrimaryButton>
                                {editingRole && (
                                    <SecondaryButton onClick={() => { setEditingRole(null); resetRole(); }} className="ml-2 mt-4">
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
                                        {roles.map((role) => (
                                            <tr key={role.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <PrimaryButton onClick={() => startEditingRole(role)} className="mr-2">Editar</PrimaryButton>
                                                    <DangerButton onClick={() => confirmRoleDeletion(role)} className="mr-2">Eliminar</DangerButton>
                                                    <SecondaryButton onClick={() => startAssigningPermissions(role)}>Asignar Permisos</SecondaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Permission Management */}
                            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Permisos</h3>
                            <form onSubmit={submitPermission} className="mb-8">
                                <InputLabel htmlFor="permissionName" value={editingPermission ? 'Editar Permiso' : 'Nuevo Permiso'} />
                                <TextInput
                                    id="permissionName"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={permissionData.name}
                                    onChange={(e) => setPermissionData('name', e.target.value)}
                                    required
                                />
                                <InputError message={permissionErrors.name} className="mt-2" />
                                <PrimaryButton className="mt-4" disabled={processingPermission}>
                                    {editingPermission ? 'Actualizar Permiso' : 'Crear Permiso'}
                                </PrimaryButton>
                                {editingPermission && (
                                    <SecondaryButton onClick={() => { setEditingPermission(null); resetPermission(); }} className="ml-2 mt-4">
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
                                        {permissions.map((permission) => (
                                            <tr key={permission.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{permission.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <PrimaryButton onClick={() => startEditingPermission(permission)} className="mr-2">Editar</PrimaryButton>
                                                    <DangerButton onClick={() => confirmPermissionDeletion(permission)}>Eliminar</DangerButton>
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

            {/* Delete Role Confirmation Modal */}
            <Modal show={confirmingRoleDeletion !== null} onClose={() => setConfirmingRoleDeletion(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ¿Estás seguro de que quieres eliminar este rol?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Esta acción es irreversible. Todos los usuarios con este rol perderán sus permisos asociados.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingRoleDeletion(null)}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDeleteRole} className="ml-3">
                            Eliminar Rol
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Delete Permission Confirmation Modal */}
            <Modal show={confirmingPermissionDeletion !== null} onClose={() => setConfirmingPermissionDeletion(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        ¿Estás seguro de que quieres eliminar este permiso?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Esta acción es irreversible. Los roles que tengan este permiso lo perderán.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingPermissionDeletion(null)}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDeletePermission} className="ml-3">
                            Eliminar Permiso
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Assign Permissions Modal */}
            <Modal show={assigningRole !== null} onClose={() => setAssigningRole(null)} maxWidth="md">
                <form onSubmit={handleAssignPermissions} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Asignar Permisos a {assigningRole?.name}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`permission-${permission.id}`}
                                    value={permission.id}
                                    checked={assignData.permissions.includes(permission.id)}
                                    onChange={(e) => {
                                        const newPermissions = e.target.checked
                                            ? [...assignData.permissions, permission.id]
                                            : assignData.permissions.filter(id => id !== permission.id);
                                        setAssignData('permissions', newPermissions);
                                    }}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <label htmlFor={`permission-${permission.id}`} className="ml-2 text-sm text-gray-600">
                                    {permission.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <InputError message={assignErrors.permissions} className="mt-2" />
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => { setAssigningRole(null); resetAssign(); }}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processingAssign}>
                            Guardar Permisos
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
