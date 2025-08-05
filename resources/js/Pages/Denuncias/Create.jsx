import React, { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ tiposDenuncia, initialTiposDenuncia, initialEsAnonima, leyKarinTypeIds = [], delitosYEticaTypeIds = [] }) {


    const { data, setData, post, processing, errors, reset } = useForm({
        descripcion: '',
        implicados: '',
        medidas_proteccion_solicitadas: false,
        es_anonima: initialEsAnonima,
        nombre_denunciante: '',
        apellidos_denunciante: '',
        genero_denunciante: '',
        email_personal_denunciante: '',
        rut_denunciante: '',
        telefono_denunciante: '',
        nombre_denunciado: '',
        apellidos_denunciado: '',
        area_denunciado: '',
        cargo_denunciado: '',
        evidencias: [],
        tipos_denuncia: initialTiposDenuncia,
        email_opcional_confirmacion: '',
    });

    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (initialTiposDenuncia.some(id => leyKarinTypeIds.includes(id))) {
            return 'leyKarin';
        } else if (initialTiposDenuncia.some(id => delitosYEticaTypeIds.includes(id))) {
            return 'delitosYEtica';
        } else {
            return null;
        }
    });

    const isLeyKarinSelected = data.tipos_denuncia.some(id => leyKarinTypeIds.includes(id));

    useEffect(() => {
        if (initialTiposDenuncia.some(id => leyKarinTypeIds.includes(id))) {
            setSelectedCategory('leyKarin');
        } else if (initialTiposDenuncia.some(id => delitosYEticaTypeIds.includes(id))) {
            setSelectedCategory('delitosYEtica');
        } else {
            setSelectedCategory(null);
        }
    }, [initialTiposDenuncia, leyKarinTypeIds, delitosYEticaTypeIds]);

    const filteredTiposDenuncia = tiposDenuncia.filter(tipo => {
        if (selectedCategory === 'leyKarin') {
            return leyKarinTypeIds.includes(tipo.id);
        } else if (selectedCategory === 'delitosYEtica') {
            return delitosYEticaTypeIds.includes(tipo.id);
        } else {
            return true; // Show all if no category is pre-selected
        }
    });



    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting tipos_denuncia:', data.tipos_denuncia);
        post(route('denuncias.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleFileChange = (e) => {
        setData('evidencias', Array.from(e.target.files));
    };

    const handleTipoDenunciaChange = (e, tipoId) => {
        const isChecked = e.target.checked;
        let newTipos = [...data.tipos_denuncia];

        if (isChecked) {
            if (!newTipos.includes(tipoId)) {
                newTipos.push(tipoId);
            }
        } else {
            newTipos = newTipos.filter(id => id !== tipoId);
        }

        const isNowLeyKarin = newTipos.some(id => leyKarinTypeIds.includes(id));

        setData(prevData => ({
            ...prevData,
            tipos_denuncia: newTipos,
            es_anonima: isNowLeyKarin ? false : (selectedCategory === 'delitosYEtica' ? true : prevData.es_anonima),
        }));
    };
    const getPageTitle = () => {
        if (selectedCategory === 'leyKarin') {
            return "Denuncia Ley Karin";
        } else if (selectedCategory === 'delitosYEtica') {
            return "Denuncia de Delitos y Faltas a la Ética";
        }
        return "Realizar Denuncia";
    };

    const pageTitle = getPageTitle();

    const isCheckboxDisabled = (tipoId) => {
        const isLeyKarinType = leyKarinTypeIds.includes(tipoId);
        const isDelitosYEticaType = delitosYEticaTypeIds.includes(tipoId);

        // If a category is selected, disable checkboxes that don't belong to that category
        if (selectedCategory === 'leyKarin' && !isLeyKarinType) {
            return true;
        }
        if (selectedCategory === 'delitosYEtica' && !isDelitosYEticaType) {
            return true;
        }

        // If no category is selected, and this checkbox is not currently selected,
        // disable it if selecting it would conflict with an already selected type
        // from a different category.
        if (selectedCategory === null && !data.tipos_denuncia.includes(tipoId)) {
            if (isLeyKarinType && data.tipos_denuncia.some(id => delitosYEticaTypeIds.includes(id))) {
                return true;
            }
            if (isDelitosYEticaType && data.tipos_denuncia.some(id => leyKarinTypeIds.includes(id))) {
                return true;
            }
        }

        return false;
    };

    return (
        <GuestLayout>
            <Head title={pageTitle} />

            <h2 className="text-xl font-semibold text-gray-800 leading-tight mb-4">{pageTitle}</h2>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel value="Tipo de Denuncia" />
                    {selectedCategory && (
                        <p className="text-sm text-gray-500 mt-2">
                            Usted está realizando una denuncia bajo la categoría de: {selectedCategory === 'leyKarin' ? 'Ley Karin' : 'Delitos y Faltas a la Ética'}
                        </p>
                    )}
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTiposDenuncia.map((tipo) => (
                            <div key={tipo.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`tipo-${tipo.id}`}
                                    value={tipo.id}
                                    checked={data.tipos_denuncia.includes(tipo.id)}
                                    onChange={(e) => handleTipoDenunciaChange(e, tipo.id)}
                                    disabled={isCheckboxDisabled(tipo.id)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <label htmlFor={`tipo-${tipo.id}`} className="ml-2 text-sm text-gray-600">
                                    {tipo.nombre}
                                </label>
                            </div>
                        ))}
                    </div>
                    <InputError message={errors.tipos_denuncia} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="descripcion" value="Descripción de los hechos" />
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={data.descripcion}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('descripcion', e.target.value)}
                        required
                    ></textarea>
                    <InputError message={errors.descripcion} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center">
                    <input
                        type="checkbox"
                        id="medidas_proteccion_solicitadas"
                        name="medidas_proteccion_solicitadas"
                        checked={data.medidas_proteccion_solicitadas}
                        onChange={(e) => setData('medidas_proteccion_solicitadas', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <InputLabel htmlFor="medidas_proteccion_solicitadas" className="ml-2">Solicitar medidas de protección</InputLabel>
                </div>

                <div className="mt-4 flex items-center">
                    <input
                        type="checkbox"
                        id="es_anonima"
                        name="es_anonima"
                        checked={data.es_anonima}
                        onChange={(e) => setData('es_anonima', e.target.checked)}
                        disabled={isLeyKarinSelected}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <InputLabel htmlFor="es_anonima" className="ml-2">Realizar denuncia de forma anónima</InputLabel>
                </div>

                {!data.es_anonima && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Datos del Denunciante</h3>
                        <div className="mt-4">
                            <InputLabel htmlFor="nombre_denunciante" value="Nombre" />
                            <TextInput
                                id="nombre_denunciante"
                                name="nombre_denunciante"
                                value={data.nombre_denunciante}
                                className="mt-1 block w-full"
                                autoComplete="given-name"
                                onChange={(e) => setData('nombre_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            />
                            <InputError message={errors.nombre_denunciante} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="apellidos_denunciante" value="Apellidos" />
                            <TextInput
                                id="apellidos_denunciante"
                                name="apellidos_denunciante"
                                value={data.apellidos_denunciante}
                                className="mt-1 block w-full"
                                autoComplete="family-name"
                                onChange={(e) => setData('apellidos_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            />
                            <InputError message={errors.apellidos_denunciante} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="genero_denunciante" value="Género" />
                            <select
                                id="genero_denunciante"
                                name="genero_denunciante"
                                value={data.genero_denunciante}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('genero_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                                <option value="Prefiero no especificar">Prefiero no especificar</option>
                            </select>
                            <InputError message={errors.genero_denunciante} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email_personal_denunciante" value="Email Personal" />
                            <TextInput
                                id="email_personal_denunciante"
                                type="email"
                                name="email_personal_denunciante"
                                value={data.email_personal_denunciante}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                onChange={(e) => setData('email_personal_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            />
                            <InputError message={errors.email_personal_denunciante} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="rut_denunciante" value="RUT" />
                            <TextInput
                                id="rut_denunciante"
                                name="rut_denunciante"
                                value={data.rut_denunciante}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('rut_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            />
                            <InputError message={errors.rut_denunciante} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="telefono_denunciante" value="Teléfono" />
                            <TextInput
                                id="telefono_denunciante"
                                name="telefono_denunciante"
                                value={data.telefono_denunciante}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('telefono_denunciante', e.target.value)}
                                required={!data.es_anonima}
                            />
                            <InputError message={errors.telefono_denunciante} className="mt-2" />
                        </div>
                    </>
                )}

                {data.es_anonima && (
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                        <p className="font-bold">¿Desea recibir una copia de la denuncia y el código de seguimiento?</p>
                        <p className="text-sm mb-2">Si lo desea, puede ingresar un correo electrónico. Este correo NO será guardado en nuestros registros y solo se utilizará para enviarle el código de seguimiento.</p>
                        <InputLabel htmlFor="email_opcional_confirmacion" value="Email (opcional)" />
                        <TextInput
                            id="email_opcional_confirmacion"
                            type="email"
                            name="email_opcional_confirmacion"
                            value={data.email_opcional_confirmacion}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email_opcional_confirmacion', e.target.value)}
                        />
                        <InputError message={errors.email_opcional_confirmacion} className="mt-2" />
                    </div>
                )}

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Datos del Denunciado (opcional)</h3>
                <div className="mt-4">
                    <InputLabel htmlFor="nombre_denunciado" value="Nombre del Denunciado" />
                    <TextInput
                        id="nombre_denunciado"
                        name="nombre_denunciado"
                        value={data.nombre_denunciado}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('nombre_denunciado', e.target.value)}
                    />
                    <InputError message={errors.nombre_denunciado} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="apellidos_denunciado" value="Apellidos del Denunciado" />
                    <TextInput
                        id="apellidos_denunciado"
                        name="apellidos_denunciado"
                        value={data.apellidos_denunciado}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('apellidos_denunciado', e.target.value)}
                    />
                    <InputError message={errors.apellidos_denunciado} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="area_denunciado" value="Área o Sector del Denunciado" />
                    <TextInput
                        id="area_denunciado"
                        name="area_denunciado"
                        value={data.area_denunciado}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('area_denunciado', e.target.value)}
                    />
                    <InputError message={errors.area_denunciado} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="cargo_denunciado" value="Cargo o Puesto del Denunciado" />
                    <TextInput
                        id="cargo_denunciado"
                        name="cargo_denunciado"
                        value={data.cargo_denunciado}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('cargo_denunciado', e.target.value)}
                    />
                    <InputError message={errors.cargo_denunciado} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="implicados" value="Posibles implicados (descripción adicional)" />
                    <TextInput
                        id="implicados"
                        name="implicados"
                        value={data.implicados}
                        className="mt-1 block w-full"
                        autoComplete="implicados"
                        onChange={(e) => setData('implicados', e.target.value)}
                    />
                    <InputError message={errors.implicados} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="evidencias" value="Adjuntar Evidencias (opcional, máx. 10MB por archivo)" />
                    <input
                        id="evidencias"
                        type="file"
                        name="evidencias[]"
                        multiple
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <InputError message={errors.evidencias} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Enviar Denuncia
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}


