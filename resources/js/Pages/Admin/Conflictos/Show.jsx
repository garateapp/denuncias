import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

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

const statusBadgeClass = (status) => {
    switch (status) {
        case 'sin_observaciones':
            return 'bg-green-100 text-green-800';
        case 'con_observaciones':
            return 'bg-yellow-100 text-yellow-800';
        case 'requiere_seguimiento':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Show({ auth, declaration, statusOptions, canReview, signatureUrl }) {
    const { flash } = usePage().props;
    const statusMessage = flash?.status;

    const { data, setData, patch, processing, errors } = useForm({
        review_status: declaration.review_status ?? 'sin_observaciones',
        review_notes: declaration.review_notes ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.conflictos.review', declaration.id), { preserveScroll: true });
    };

    const resolveStatusLabel = (status) => {
        if (!status) {
            return 'Pendiente';
        }
        return statusOptions[status] ?? status;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalle de declaración</h2>}
        >
            <Head title={`Declaración ${declaration.nombre_colaborador}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {statusMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                            {statusMessage}
                        </div>
                    )}

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{declaration.nombre_colaborador}</h3>
                                <p className="text-sm text-gray-600">{declaration.cargo} • {declaration.area}</p>
                                <p className="text-sm text-gray-500">{declaration.empresa}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Declarado el {new Date(declaration.fecha).toLocaleDateString()} • Registro: {new Date(declaration.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(declaration.review_status)}`}>
                                    {resolveStatusLabel(declaration.review_status)}
                                </span>
                                {declaration.reviewer && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Última revisión por {declaration.reviewer.name} {declaration.reviewed_at && `el ${new Date(declaration.reviewed_at).toLocaleString()}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-6 space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800">Respuestas del formulario</h4>

                        <div className="grid gap-4">
                            {QUESTIONS.map((question, index) => {
                                const answer = declaration[question.key];
                                const detail = declaration[`${question.key}_detalle`];
                                return (
                                    <div key={question.key} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <p className="text-sm font-medium text-gray-800">
                                                {index + 1}. {question.label}
                                            </p>
                                            <span
                                                className={`inline-flex h-6 w-24 items-center justify-center rounded-full text-xs font-semibold ${
                                                    answer ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                                                {answer ? 'Sí' : 'No'}
                                            </span>
                                        </div>
                                        {answer && (
                                            <div className="mt-3">
                                                <p className="text-xs uppercase text-gray-500 mb-1">Detalle entregado</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div>
                            <h5 className="text-md font-semibold text-gray-800 mb-2">Firma del colaborador</h5>
                            {signatureUrl || declaration.firma_url ? (
                                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                                    <img
                                        src={signatureUrl ?? declaration.firma_url}
                                        alt={`Firma de ${declaration.nombre_colaborador}`}
                                        className="max-h-48 object-contain"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No se encontró la firma adjunta.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión del Comisionado</h4>
                        {!canReview && (
                            <p className="mb-4 rounded-md bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                                Solo los usuarios con rol de Comisionado pueden registrar observaciones.
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="review_status" value="Estado de revisión *" />
                                <select
                                    id="review_status"
                                    name="review_status"
                                    value={data.review_status}
                                    onChange={(e) => setData('review_status', e.target.value)}
                                    disabled={!canReview}
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {Object.entries(statusOptions).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.review_status} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="review_notes" value="Detalle de observaciones o acciones correctivas" />
                                <textarea
                                    id="review_notes"
                                    name="review_notes"
                                    value={data.review_notes}
                                    onChange={(e) => setData('review_notes', e.target.value)}
                                    rows="4"
                                    disabled={!canReview}
                                    placeholder="Registra observaciones, acciones correctivas o instrucciones de seguimiento."
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.review_notes} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Obligatorio cuando el estado sea “Con observaciones” o “Requiere seguimiento”.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton disabled={!canReview || processing}>
                                    {declaration.review_status ? 'Actualizar revisión' : 'Registrar revisión'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
