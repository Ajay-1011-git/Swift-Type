import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface WPMChartProps {
    wpmHistory: number[];
    errorHistory: number[];
    bestWPM?: number;
}

export function WPMChart({ wpmHistory, errorHistory, bestWPM }: WPMChartProps) {
    const labels = wpmHistory.map((_, i) => `${i + 1}s`);

    const data = {
        labels,
        datasets: [
            {
                label: 'WPM',
                data: wpmHistory,
                borderColor: '#e2b714',
                backgroundColor: 'rgba(226, 183, 20, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#e2b714',
                pointBorderColor: '#e2b714',
                borderWidth: 2.5,
            },
            {
                label: 'Errors',
                data: errorHistory.map((e) => e * 5), // Scale errors for visibility
                borderColor: '#ca4754',
                backgroundColor: 'rgba(202, 71, 84, 0.05)',
                fill: false,
                tension: 0,
                pointRadius: errorHistory.map((e) => (e > 0 ? 4 : 0)),
                pointBackgroundColor: '#ca4754',
                borderWidth: 1.5,
                borderDash: [5, 5],
            },
            ...(bestWPM
                ? [
                    {
                        label: 'Best WPM',
                        data: Array(wpmHistory.length).fill(bestWPM),
                        borderColor: 'rgba(209, 208, 197, 0.3)',
                        borderWidth: 1,
                        borderDash: [10, 5],
                        pointRadius: 0,
                        fill: false,
                    },
                ]
                : []),
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: '#646669',
                    font: { size: 11, family: 'Inter' },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                },
            },
            tooltip: {
                backgroundColor: '#2c2e31',
                titleColor: '#d1d0c5',
                bodyColor: '#d1d0c5',
                borderColor: '#363739',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                bodyFont: { family: 'JetBrains Mono' },
            },
        },
        scales: {
            x: {
                ticks: { color: '#646669', font: { size: 10 } },
                grid: { color: 'rgba(100,102,105,0.1)' },
            },
            y: {
                ticks: { color: '#646669', font: { size: 10 } },
                grid: { color: 'rgba(100,102,105,0.1)' },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-64">
            <Line data={data} options={options} />
        </div>
    );
}

interface PerformanceChartProps {
    data: { label: string; value: number }[];
    title: string;
    color?: string;
}

export function PerformanceChart({ data, title, color = '#e2b714' }: PerformanceChartProps) {
    const chartData = {
        labels: data.map((d) => d.label),
        datasets: [
            {
                label: title,
                data: data.map((d) => d.value),
                borderColor: color,
                backgroundColor: `${color}15`,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#2c2e31',
                titleColor: '#d1d0c5',
                bodyColor: '#d1d0c5',
                borderColor: '#363739',
                borderWidth: 1,
                bodyFont: { family: 'JetBrains Mono' },
            },
        },
        scales: {
            x: {
                ticks: { color: '#646669', font: { size: 10 } },
                grid: { color: 'rgba(100,102,105,0.1)' },
            },
            y: {
                ticks: { color: '#646669', font: { size: 10 } },
                grid: { color: 'rgba(100,102,105,0.1)' },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-48">
            <Line data={chartData} options={options} />
        </div>
    );
}
