import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Chart from 'react-apexcharts';

export default function Dashboard({ auth, stats, chartData }) {
    const chartOptions = {
        chart: {
            id: 'denuncias-por-fecha',
        },
        xaxis: {
            categories: chartData.dates,
        },
    };

    const chartSeries = [
        {
            name: 'Denuncias',
            data: chartData.totals,
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Denuncias</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-100 p-4 rounded-lg shadow">
                                    <p className="text-lg font-semibold">Total Recibidas:</p>
                                    <p className="text-2xl">{stats.totalReceived}</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg shadow">
                                    <p className="text-lg font-semibold">Recibidas este Mes:</p>
                                    <p className="text-2xl">{stats.totalReceivedMonth}</p>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-lg shadow">
                                    <p className="text-lg font-semibold">Total Ley Karin:</p>
                                    <p className="text-2xl">{stats.totalLeyKarin}</p>
                                </div>
                            </div>

                            <h4 className="text-lg font-medium text-gray-900 mb-4">Totales por Tipo de Denuncia</h4>
                            <ul className="mb-8">
                                {stats.totalsByType.map((typeStat, index) => (
                                    <li key={index} className="mb-2">
                                        {typeStat.nombre}: {typeStat.total}
                                    </li>
                                ))}
                            </ul>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Distribución por Tipo de Denuncia</h4>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'pie',
                                        },
                                        labels: stats.totalsByType.map(item => item.nombre),
                                        responsive: [{
                                            breakpoint: 480,
                                            options: {
                                                chart: {
                                                    width: 200
                                                },
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }
                                        }]
                                    }}
                                    series={stats.totalsByType.map(item => item.total)}
                                    type="pie"
                                    height={350}
                                />
                            </div>

                            <h4 className="text-lg font-medium text-gray-900 mb-4">Totales por Estado de Denuncia</h4>
                            <ul className="mb-8">
                                {stats.totalsByStatus.map((statusStat, index) => (
                                    <li key={index} className="mb-2">
                                        {statusStat.estado}: {statusStat.total}
                                    </li>
                                ))}
                            </ul>

                            <h4 className="text-lg font-medium text-gray-900 mb-4">Denuncias por Fecha</h4>
                            <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
