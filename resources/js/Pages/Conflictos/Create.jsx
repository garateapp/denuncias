import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Switch } from '@/Components/ui/switch';
import SignatureCanvas from 'react-signature-canvas';

const QUESTIONS = [
    {
        key: 'intereses_externos',
        label:
            '¿Posee usted intereses externos o negocios independientes (como socio, dueño, asesor o trabajador) que puedan desviar su tiempo laboral o atención de sus funciones en Greenex?',
    },
    {
        key: 'beneficios_externos',
        label:
            '¿Recibe usted o ha recibido ingresos, comisiones o beneficios de proveedores, competidores o clientes de Greenex?',
    },
    {
        key: 'cliente_greenex',
        label: '¿Ha participado usted como cliente de Greenex o de alguna de sus filiales?',
    },
    {
        key: 'negocios_agroindustria',
        label:
            '¿Posee o participa usted en negocios dedicados a la comercialización o transformación de productos o servicios asociados a la agroindustria, exportación o negocio frutícola?',
    },
    {
        key: 'proveedor_greenex',
        label:
            '¿Es usted actualmente o ha sido en los últimos 12 meses proveedor o subcontratista de Greenex, directa o indirectamente?',
    },
    {
        key: 'familiares_clientes_proveedores',
        label:
            '¿Tiene usted familiares directos o indirectos que sean clientes, proveedores o empleados relevantes de clientes o proveedores de Greenex?',
    },
    {
        key: 'vinculos_misma_area',
        label:
            '¿Mantiene o ha mantenido usted vínculos personales o de parentesco con otro colaborador de Greenex dentro de la misma área o unidad organizacional?',
    },
    {
        key: 'relacion_sentimental',
        label: '¿Se encuentra usted en una relación sentimental con otro trabajador o trabajadora de Greenex?',
    },
    {
        key: 'vinculos_clientes_proveedores',
        label:
            '¿Tiene usted vínculos personales o de parentesco con proveedores, clientes o representantes de éstos?',
    },
    {
        key: 'regalos_cortesia',
        label:
            '¿Ha recibido usted regalos, cortesías, viajes o invitaciones de clientes, proveedores o subcontratistas que pudieran influir en su objetividad o independencia?',
    },
    {
        key: 'soborno_participacion',
        label:
            '¿Ha sido usted testigo o partícipe de situaciones de soborno, cohecho, extorsión o irregularidades en decisiones comerciales dentro o fuera de Greenex?',
    },
    {
        key: 'propiedad_intelectual',
        label:
            '¿Ha desarrollado o registrado invenciones, mejoras, patentes o derechos de autor relacionados con sus labores en Greenex?',
    },
    {
        key: 'contratacion_terceros',
        label:
            '¿Ha promovido, sugerido o participado en la contratación directa o indirecta de trabajadores actuales de Greenex para terceros o competidores?',
    },
    {
        key: 'conductas_anticompetitivas',
        label:
            '¿Ha tenido participación en decisiones o acuerdos que pudieran implicar comportamientos anticompetitivos o monopólicos en el mercado?',
    },
];

const baseFormState = {
    empresa: '',
    area: '',
    nombre_colaborador: '',
    cargo: '',
    rut: '',
    fecha: '',
    firma_colaborador: '',
};

const INITIAL_FORM_STATE = { ...baseFormState };
QUESTIONS.forEach((question) => {
    INITIAL_FORM_STATE[question.key] = false;
    INITIAL_FORM_STATE[`${question.key}_detalle`] = '';
});

export default function Create({ empresas }) {
    const { flash } = usePage().props;
    const statusMessage = flash?.status;

    const signaturePadRef = useRef(null);
    const [signatureError, setSignatureError] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm(INITIAL_FORM_STATE);

    const submit = (e) => {
        e.preventDefault();

        const hasStroke = signaturePadRef.current && !signaturePadRef.current.isEmpty();

        if (hasStroke) {
            const latestSignature = signaturePadRef.current.getCanvas().toDataURL('image/png');
            if (latestSignature !== data.firma_colaborador) {
                setData('firma_colaborador', latestSignature);
            }
        }

        if (!hasStroke && !data.firma_colaborador) {
            setSignatureError('Debes dibujar tu firma antes de enviar.');
            return;
        }

        post(route('conflictos.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearSignature();
                setSignatureError(null);
            },
        });
    };

    const handleAnswerChange = (key, value) => {
        setData(key, value);
        if (!value) {
            setData(`${key}_detalle`, '');
        }
    };

    const handleSignatureEnd = () => {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            setData('firma_colaborador', signaturePadRef.current.getCanvas().toDataURL('image/png'));
            setSignatureError(null);
        } else {
            setData('firma_colaborador', '');
        }
    };

    const clearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
        setData('firma_colaborador', '');
        setSignatureError(null);
    };

    return (
        <>
            <Head title="Declaración de Conflictos de Interés" />

            <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
                <header className="bg-white shadow-sm py-4">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/">
                            <img src="/img/logo.webp" alt="Greenex Logo" className="h-12 w-auto" />
                        </Link>
                        <Link
                            href={route('welcome')}
                            className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            Regresar al portal
                        </Link>
                    </div>
                </header>

                <main className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-800 mb-3">
                                Formulario de Declaración de Conflictos de Interés
                            </h1>
                            <p className="text-lg text-gray-600">
                                Completa la información solicitada y declara cualquier situación que pueda representar un
                                conflicto de interés.
                            </p>
                        </div>

                        {statusMessage && (
                            <div className="mb-8 rounded-md bg-green-50 p-4 text-green-800">
                                {statusMessage}
                            </div>
                        )}

                        <form onSubmit={submit} className="bg-white shadow-xl sm:rounded-lg p-8 space-y-10">
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos del colaborador</h2>
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="empresa" value="Empresa *" />
                                        <select
                                            id="empresa"
                                            name="empresa"
                                            value={data.empresa}
                                            onChange={(e) => setData('empresa', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="" disabled>
                                                Selecciona una empresa
                                            </option>
                                            {empresas.map((empresa) => (
                                                <option key={empresa} value={empresa}>
                                                    {empresa}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.empresa} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="area" value="Área *" />
                                            <TextInput
                                                id="area"
                                                name="area"
                                                value={data.area}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('area', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.area} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="cargo" value="Cargo *" />
                                            <TextInput
                                                id="cargo"
                                                name="cargo"
                                                value={data.cargo}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('cargo', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.cargo} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="nombre_colaborador" value="Nombre del colaborador *" />
                                            <TextInput
                                                id="nombre_colaborador"
                                                name="nombre_colaborador"
                                                value={data.nombre_colaborador}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('nombre_colaborador', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nombre_colaborador} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="rut" value="RUT *" />
                                            <TextInput
                                                id="rut"
                                                name="rut"
                                                value={data.rut}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('rut', e.target.value)}
                                                placeholder="12.345.678-9"
                                                required
                                            />
                                            <InputError message={errors.rut} className="mt-2" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha" value="Fecha *" />
                                        <TextInput
                                            id="fecha"
                                            name="fecha"
                                            type="date"
                                            value={data.fecha}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('fecha', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.fecha} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Introducción</h2>
                                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                                    <li>
                                        <p className="font-semibold text-gray-800">Propósito</p>
                                        <p>
                                            El presente formulario tiene como finalidad identificar, declarar y evaluar
                                            potenciales conflictos de interés que puedan afectar la independencia,
                                            objetividad o imparcialidad de los colaboradores de Greenex S.A. en el ejercicio de sus
                                            funciones.
                                        </p>
                                        <p className="mt-2">
                                            Este instrumento forma parte del Modelo de Prevención de Delitos (MPD) de Greenex,
                                            implementado conforme a la Ley N°20.393 sobre Responsabilidad Penal de las Personas
                                            Jurídicas y a la Ley N°21.595 sobre Delitos Económicos y Atentados contra el Medioambiente,
                                            que exigen la detección, prevención y control de situaciones que puedan derivar en
                                            conductas contrarias a la ética o a la ley.
                                        </p>
                                        <p className="mt-2">
                                            La información declarada será tratada con estricto carácter confidencial, conforme a la
                                            Ley N°21.096 sobre Protección de Datos Personales y a las políticas internas de Greenex.
                                        </p>
                                    </li>
                                    <li>
                                        <p className="font-semibold text-gray-800">
                                            Declaración de Situaciones Potenciales de Conflicto de Interés
                                        </p>
                                        <p className="mt-2">
                                            Por favor, seleccione la opción que corresponda y entregue detalles en caso afirmativo.
                                        </p>
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Declaración de situaciones
                                </h2>
                                <div className="space-y-6">
                                    {QUESTIONS.map((question, index) => {
                                        const detailKey = `${question.key}_detalle`;
                                        return (
                                            <div
                                                key={question.key}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <p className="text-base font-medium text-gray-800">
                                                            {index + 1}. {question.label}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-500">No</span>
                                                        <Switch
                                                            id={`${question.key}-switch`}
                                                            checked={Boolean(data[question.key])}
                                                            onCheckedChange={(checked) =>
                                                                handleAnswerChange(question.key, checked)
                                                            }
                                                            aria-label={question.label}
                                                        />
                                                        <span className="text-sm text-gray-700 font-semibold">Sí</span>
                                                    </div>
                                                </div>
                                                <InputError message={errors[question.key]} className="mt-2" />

                                                {data[question.key] && (
                                                    <div className="mt-4">
                                                        <InputLabel
                                                            htmlFor={detailKey}
                                                            value="Detalle en caso afirmativo (nombre, empresa o descripción del vínculo) *"
                                                        />
                                            <textarea
                                                id={detailKey}
                                                name={detailKey}
                                                value={data[detailKey]}
                                                onChange={(e) => setData(detailKey, e.target.value)}
                                                rows="3"
                                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Describe el vínculo o la situación declarada."
                                                required={Boolean(data[question.key])}
                                            />
                                                        <InputError message={errors[detailKey]} className="mt-2" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Compromiso del colaborador</h2>
                                <p className="text-gray-700 mb-4">
                                    Declaro que la información proporcionada en este formulario es veraz, completa y
                                    actualizada, y que comprendo las implicancias que un conflicto de interés puede tener
                                    en el cumplimiento de mis funciones, en la reputación de la compañía y en el Modelo de
                                    Prevención de Delitos (MPD) de Greenex.
                                </p>
                                <p className="text-gray-700 font-semibold">Me comprometo a:</p>
                                <ul className="mt-3 list-disc list-inside space-y-2 text-gray-700">
                                    <li>
                                        Notificar de inmediato a mi jefatura directa y/o al área de Compliance y Prevención
                                        de Delitos ante cualquier cambio o nueva situación que pueda constituir un conflicto
                                        de interés.
                                    </li>
                                    <li>
                                        Solicitar autorización previa cuando mantenga vínculos personales o de parentesco
                                        con colaboradores dentro de la misma área o con proveedores o clientes.
                                    </li>
                                    <li>
                                        Abstenerme de participar en decisiones o gestiones donde exista un conflicto de interés
                                        real, potencial o aparente.
                                    </li>
                                    <li>
                                        Cumplir íntegramente con las Leyes N°20.393 y N°21.595, así como con las políticas
                                        internas de ética, libre competencia, conducta y compliance de Greenex.
                                    </li>
                                </ul>

                                <div className="mt-6">
                                    <InputLabel value="Firma del colaborador *" />
                                    <div className="mt-2 rounded-md border border-gray-300 bg-white p-2">
                                        <SignatureCanvas
                                            ref={signaturePadRef}
                                            penColor="#1f2937"
                                            canvasProps={{
                                                className:
                                                    'w-full h-40 bg-white rounded-md',
                                            }}
                                            onEnd={handleSignatureEnd}
                                        />
                                    </div>
                                    <div className="mt-3 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={clearSignature}
                                            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Limpiar firma
                                        </button>
                                        <p className="text-sm text-gray-500 self-center">
                                            Utiliza el cursor o tu dedo (en dispositivos táctiles) para dibujar tu firma.
                                        </p>
                                    </div>
                                    {signatureError && (
                                        <p className="mt-2 text-sm text-red-600">{signatureError}</p>
                                    )}
                                    <InputError message={errors.firma_colaborador} className="mt-2" />
                                </div>

                                <p className="mt-4 text-sm text-gray-500">
                                    La fecha y hora de envío se registrarán automáticamente. Este formulario debe ser
                                    completado una vez al año por todos los colaboradores.
                                </p>
                            </section>

                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>Guardar declaración</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
