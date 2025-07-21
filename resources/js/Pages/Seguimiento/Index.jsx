import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Index() {
    const { data, setData, get, processing, errors, reset } = useForm({
        codigo: '',
    });

    const submit = (e) => {
        e.preventDefault();
        get(route('seguimiento.show', data.codigo));
    };

    return (
        <GuestLayout>
            <Head title="Seguimiento de Denuncia" />

            <h2 className="text-xl font-semibold text-gray-800 leading-tight mb-4">Seguimiento de Denuncia</h2>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="codigo" value="Código de Seguimiento" />
                    <TextInput
                        id="codigo"
                        name="codigo"
                        value={data.codigo}
                        className="mt-1 block w-full"
                        autoComplete="codigo"
                        onChange={(e) => setData('codigo', e.target.value)}
                        required
                    />
                    <InputError message={errors.codigo} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Consultar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
    }
