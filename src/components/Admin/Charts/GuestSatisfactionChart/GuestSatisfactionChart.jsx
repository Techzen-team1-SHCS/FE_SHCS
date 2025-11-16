// components/GuestSatisfactionChart/GuestSatisfactionChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from './GuestSatisfactionChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin để hiển thị tổng ở giữa - CHỈ DÙNG CHO CHART NÀY
const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
        const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;
        const total = chart.config._config.total || 4551;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Vẽ chữ "Total"
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillStyle = '#6c757d';
        ctx.fillText('Total', width / 2, height / 2 - 15);

        // Vẽ số tổng
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(total.toLocaleString(), width / 2, height / 2 + 10);

        ctx.restore();
    }
};

const GuestSatisfactionChart = ({ satisfactionData }) => {
    const {
        section,
        sectionTitle,
        satisfactionCard,
        chartContainer
    } = styles;
    const fallbackData = {
        data: [75, 20, 5], // Excellent, Good, Poor percentages
        total: 4551, // Total reviews
        labels: ['Excellent', 'Good', 'Poor']
    };
    const getChartDataConfig = () => {
        if (satisfactionData) {
            return satisfactionData;
        }
        return fallbackData;
    };
    const config = getChartDataConfig();
    const chartData = {
        labels: config.labels,
        datasets: [
            {
                data: config.data,
                backgroundColor: [
                    '#28a745', // Green for Excellent
                    '#ffc107', // Yellow for Good
                    '#dc3545'  // Red for Poor
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff',
                    '#ffffff'
                ],
                borderWidth: 2,
                borderRadius: 2,
                spacing: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    color: '#6c757d',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    boxWidth: 8,
                    boxHeight: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#007bff',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = config.total;
                        const count = Math.round((value / 100) * total);
                        return `${label}: ${value}% (${count.toLocaleString()} reviews)`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 0,
                borderAlign: 'center'
            }
        },
        total: config.total
    };

    return (
        <div className={section}>
            <h3 className={sectionTitle}>Guest Satisfaction</h3>
            <div className={satisfactionCard}>
                <div className={chartContainer}>
                    <Pie 
                        data={chartData} 
                        options={chartOptions}
                        plugins={[centerTextPlugin]} // CHỈ ÁP DỤNG PLUGIN Ở ĐÂY
                    />
                </div>
            </div>
        </div>
    );
};

export default GuestSatisfactionChart;