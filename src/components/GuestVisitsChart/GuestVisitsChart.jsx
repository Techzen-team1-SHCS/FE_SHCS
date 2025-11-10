// components/GuestVisitsChart/GuestVisitsChart.jsx
import React, { useState, useRef, useEffect } from 'react';
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
} from 'chart.js';
import styles from "./GuestVisitsChart.module.css";

// Tạo instance riêng cho Line chart - KHÔNG CÓ centerTextPlugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GuestVisitsChart = () => {
    const {
        chartCard,
        header,
        title,
        sortBy,
        chartContainer
    } = styles;

    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const chartRef = useRef(null);

    // Dữ liệu cho các period khác nhau
    const chartDataConfig = {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [180, 220, 190, 250, 280, 320, 300, 350, 380, 340, 290, 260]
        },
        weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [320, 280, 350, 380]
        },
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [45, 52, 38, 60, 75, 85, 65]
        }
    };

    // Tạo gradient cho line chart
    const createGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(0, 123, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0.05)');
        return gradient;
    };

    const getChartData = () => {
        const config = chartDataConfig[selectedPeriod];
        const ctx = chartRef.current?.ctx;

        return {
            labels: config.labels,
            datasets: [
                {
                    label: 'Guest Visits',
                    data: config.data,
                    backgroundColor: ctx ? createGradient(ctx) : 'rgba(0, 123, 255, 0.1)',
                    borderColor: '#007bff',
                    borderWidth: 3,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 1,
                    pointHoverBackgroundColor: '#0056b3',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                    tension: 0.3,
                    fill: true,
                },
            ],
        };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#007bff',
                borderWidth: 1,
                cornerRadius: 6,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Visits: ${context.parsed.y}`;
                    },
                    title: function(tooltipItems) {
                        return tooltipItems[0].label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#6c757d',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: selectedPeriod === 'monthly' ? 400 : 
                     selectedPeriod === 'weekly' ? 450 : 100,
                grid: {
                    color: '#e9ecef',
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    color: '#6c757d',
                    stepSize: selectedPeriod === 'monthly' ? 100 : 
                              selectedPeriod === 'weekly' ? 150 : 25,
                    callback: function(value) {
                        return value;
                    },
                    font: {
                        family: "'Inter', sans-serif",
                    }
                },
                border: {
                    display: false,
                }
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 10,
                left: 10,
                right: 10
            }
        },
        elements: {
            line: {
                tension: 0.3
            },
            point: {
                hoverBackgroundColor: '#0056b3',
            }
        }
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    useEffect(() => {
        console.log(`Period changed to: ${selectedPeriod}`);
    }, [selectedPeriod]);

    return (
        <div className={chartCard}>
            <div className={header}>
                <h3 className={title}>Guest Visits</h3>
                <select 
                    className={sortBy} 
                    value={selectedPeriod} 
                    onChange={handlePeriodChange}
                >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                </select>
            </div>
            
            <div className={chartContainer}>
                <Line 
                    ref={chartRef}
                    data={getChartData()} 
                    options={options}
                    plugins={[]} // ĐẢM BẢO KHÔNG CÓ PLUGIN NÀO
                />
            </div>
        </div>
    );
};

export default GuestVisitsChart;