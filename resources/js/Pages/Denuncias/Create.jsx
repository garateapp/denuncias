import React, { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ initialTiposDenuncia, initialEsAnonima, leyKarinTypeIds = [], delitosYEticaTypeIds = [], empresa = 'Gárate Hermanos' }) {


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
        empresa: empresa,

        // --- NUEVOS CAMPOS PARA INOCUIDAD ---
        area_ocurrencia: '',
        fecha_aproximada: '',
        turno: '',
        fruta_despachada: '',
        situacion_continua: '',
    });

    const [selectedCategory, setSelectedCategory] = useState(null);

    const isLeyKarinSelected = selectedCategory === 'leyKarin';

    useEffect(() => {
        const isKarin = initialTiposDenuncia.some(id => leyKarinTypeIds.includes(id));
        const isDelitos = initialTiposDenuncia.some(id => delitosYEticaTypeIds.includes(id));

        if (isKarin) {
            setSelectedCategory('leyKarin');
            setData('es_anonima', false); // Forzar a no anónima para Ley Karin
        } else if (isDelitos) {
            setSelectedCategory('delitosYEtica');
            setData('es_anonima', initialEsAnonima);
        } else {
            // CAMBIO AQUÍ: Asignamos 'inocuidad' en lugar de null
            setSelectedCategory('inocuidad');
            setData('es_anonima', initialEsAnonima);
        }
    }, [initialTiposDenuncia, leyKarinTypeIds, delitosYEticaTypeIds, initialEsAnonima]);


    const submit = (e) => {
        e.preventDefault();
        post(route('denuncias.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleFileChange = (e) => {
        setData('evidencias', Array.from(e.target.files));
    };

    const getPageTitle = () => {
        if (selectedCategory === 'leyKarin') {
            return "Denuncia Ley Karin";
        } else if (selectedCategory === 'delitosYEtica') {
            return "Denuncia de Delitos y Faltas a la Ética";
        } else if (selectedCategory === 'inocuidad') {
            return "Denuncia de Inocuidad, Calidad y Legalidad";
        }
        return "Realizar Denuncia";
    };

    const pageTitle = getPageTitle();

    return (
        <GuestLayout>
            <Head title={pageTitle} />

            <h2 className="text-xl font-semibold text-gray-800 leading-tight mb-4">{pageTitle}</h2>

            <form onSubmit={submit}>
                <div className="mt-4">
                    {selectedCategory && (
                        <div className="p-4 bg-gray-100 border-l-4 border-gray-400 text-gray-800">
                            <p className="font-bold">Categoría de la denuncia</p>
                            <p className="text-sm">
                                Usted está realizando una denuncia bajo la categoría de: {selectedCategory === 'leyKarin' ? 'Ley Karin' : selectedCategory==='delitosYEtica' ? 'Delitos y Faltas a la Ética' : 'Inocuidad, Calidad y Legalidad'}.
                            </p>
                            {selectedCategory !== 'leyKarin' && (
                                <p className="text-sm mt-2">
                                    Reporta, de manera anónima, confidencial y sin temor a represalias, posibles vulneraciones de derechos laborales y humanos, discriminación, trabajo forzoso o infantil, incumplimientos en remuneraciones o jornadas, riesgos para la salud y seguridad, represalias, fraude, soborno, robo o cualquier otra conducta contraria a nuestro Código de Ética
                                    </p>
                            )}
                             <p className="text-sm mt-2">
                                El equipo de cumplimiento revisará y clasificará su denuncia.
                            </p>
                        </div>
                    )}
                </div>

                {/* Empresa banner */}
                <div className="mt-4">
                    <div className={`p-4 border-l-4 ${empresa === 'agricola' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-gray-100 border-gray-400 text-gray-800'}`}>
                        <p className="font-bold">Empresa: {empresa === 'agricola' ? 'Agrícola Greenex' : 'Gárate Hermanos'}</p>
                        <p className="text-sm">Esta denuncia será gestionada por el equipo de {empresa === 'agricola' ? 'Agrícola Greenex' : 'Gárate Hermanos'}.</p>
                        {selectedCategory === 'inocuidad' && (
                            <p className="text-sm mt-2">
                                Su denuncia será revisada por el área de Aseguramiento de Calidad y la Gerencia, sin revelar su identidad.
                            </p>
                        )}
                    </div>
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
                {/* --- BLOQUE ESPECÍFICO PARA INOCUIDAD --- */}
                {selectedCategory === 'inocuidad' && (
                    <>
                        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">
                            Detalles del Incidente de Inocuidad
                        </h3>

                        <div className="mt-4">
                            <InputLabel htmlFor="area_ocurrencia" value="Área o línea donde ocurrió" />
                            <select
                                id="area_ocurrencia"
                                name="area_ocurrencia"
                                value={data.area_ocurrencia}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('area_ocurrencia', e.target.value)}
                                required
                            >
                                <option value="">Seleccione un área</option>
                                <option value="linea1carozos">Línea 1 Carozos</option>
                                <option value="linea2carozos">Línea 2 Carozos</option>
                                <option value="linea1cherries">Línea 1 Cherries</option>
                                <option value="linea2cherries">Línea 2 Cherries</option>
                                <option value="almacenamiento">Almacenamiento / Frío</option>
                                <option value="despacho">Despacho</option>
                                <option value="otra">Otra</option>
                            </select>
                            <InputError message={errors.area_ocurrencia} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="fecha_aproximada" value="Fecha aproximada del hecho" />
                            <input
                                type="date"
                                id="fecha_aproximada"
                                name="fecha_aproximada"
                                value={data.fecha_aproximada}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('fecha_aproximada', e.target.value)}
                                required
                            />
                            <InputError message={errors.fecha_aproximada} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="turno" value="Turno" />
                            <select
                                id="turno"
                                name="turno"
                                value={data.turno}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('turno', e.target.value)}
                                required
                            >
                                <option value="">Seleccione un turno</option>
                                <option value="manana">Mañana</option>
                                <option value="tarde">Tarde</option>
                                <option value="noche">Noche</option>
                                <option value="no_aplica">No aplica / No sé</option>
                            </select>
                            <InputError message={errors.turno} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="fruta_despachada" value="¿La fruta afectada ya fue despachada?" />
                            <select
                                id="fruta_despachada"
                                name="fruta_despachada"
                                value={data.fruta_despachada}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('fruta_despachada', e.target.value)}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                                <option value="no_se">No sé</option>
                            </select>
                            <InputError message={errors.fruta_despachada} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="situacion_continua" value="¿La situación sigue ocurriendo?" />
                            <select
                                id="situacion_continua"
                                name="situacion_continua"
                                value={data.situacion_continua}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                onChange={(e) => setData('situacion_continua', e.target.value)}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                                <option value="no_se">No sé</option>
                            </select>
                            <InputError message={errors.situacion_continua} className="mt-2" />
                        </div>
                    </>
                )}
                {/* --- FIN DEL BLOQUE INOCUIDAD --- */}
                  {(selectedCategory !== 'inocuidad') && (
                    <>
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
                </>
                )}
                {isLeyKarinSelected ? (
                    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                        <p className="font-bold">Denuncia No Anónima</p>
                        <p className="text-sm">Para cumplir con la Ley Karin, el denunciante debe identificarse. Su denuncia no será anónima.</p>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="es_anonima"
                            name="es_anonima"
                            checked={data.es_anonima}
                            onChange={(e) => setData('es_anonima', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <InputLabel htmlFor="es_anonima" className="ml-2">Realizar denuncia de forma anónima</InputLabel>
                    </div>
                )}


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

                {(data.es_anonima) && (
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

                {(selectedCategory !== 'inocuidad') && (
                    <>
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
                </>
                )}
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
