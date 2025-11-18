import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from "./MostBookedChart.module.css";

// Register Bar chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MostBookedChart = ({ MostBookedData }) => {
    const {
        chartCard,
        header,
        title,
        chartContainer
    } = styles;

    const chartRef = useRef(null);

    // Dữ liệu fallback
    const fallbackData = {
        labels: ['Hilton DaNang', 'Sheraton Hanoi', 'Intercontinental', 'Marriott', 'Sofitel'],
        data: [45, 38, 32, 28, 25]
    };

    const getChartDataConfig = () => {
        if (MostBookedData) {
            return MostBookedData;
        }
        return fallbackData;
    };

    const getChartData = () => {
        const config = getChartDataConfig();
        const ctx = chartRef.current?.ctx;

        // Tạo gradient cho tất cả các cột
        const createGradient = (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 123, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 123, 255, 0.4)');
            return gradient;
        };

        return {
            labels: config.labels, // Tên khách sạn sẽ ở dưới cột
            datasets: [
                {
                    label: '',
                    data: config.data, // Số lượt đặt
                    backgroundColor: ctx ? createGradient(ctx) : 'rgba(223, 161, 68, 0.8)', // MÀU CHUNG
                    borderColor: 'rgba(223, 161, 68, 0.8)', // VIỀN CHUNG
                    borderWidth: 1,
                    borderRadius: 0, // Bo góc cột
                    borderSkipped: false,
                    barPercentage: 0.7, // GIẢM CHIỀU RỘNG CỘT (0.5 = 50% chiều rộng)
                    categoryPercentage: 0.6,// GIẢM KHOẢNG CÁCH GIỮA CÁC CỘT
                },
            ],
        };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Bookings: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Hotels'
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6c757d',
                    font: {
                        size: 12,
                    }
                }
            },
            y: {
                
                beginAtZero: true,
                grid: {
                    color: '#e9ecef',
                },
                ticks: {
                    color: '#6c757d',
                    stepSize: 10,
                }
            },
        },
    };

    return (
        <div className={chartCard}>
            <div className={header}>
                <h3 className={title}>Top 5 Most Booked Hotels</h3>
            </div>
            
            <div className={chartContainer}>
                <Bar
                    ref={chartRef}
                    data={getChartData()} 
                    options={options}
                />
            </div>
        </div>
    );
};

export default MostBookedChart;