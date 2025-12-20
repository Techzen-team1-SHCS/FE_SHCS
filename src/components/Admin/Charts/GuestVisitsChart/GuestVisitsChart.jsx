// components/GuestVisitsChart/GuestVisitsChart.jsx
import React, { useRef } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import styles from "./GuestVisitsChart.module.css";
import { dashboardService } from '../../../../services/dashBoardService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Định nghĩa hàm fetch bên ngoài component để tránh tạo lại mỗi lần render
const fetchChartData = async (period) => {
    try {
        const res = await dashboardService.getBookingCharts(period);
        return {
            labels: res.labels,
            data: res.data
        };
    } catch (error) {
        console.log("Chart load failed", error);
        throw error;
    }
};

const GuestVisitsChart = () => {
    const {
        chartCard,
        header,
        title,
        sortBy,
        chartContainer
    } = styles;

    const [selectedPeriod, setSelectedPeriod] = React.useState('monthly');
    const chartRef = useRef(null);

    // Sử dụng TanStack Query với các tối ưu hóa
    const { 
        data: chartData = { labels: [], data: [] }, 
        isLoading, 
        isError,
        refetch 
    } = useQuery({
        queryKey: ['bookingCharts', selectedPeriod], // Key phụ thuộc vào selectedPeriod
        queryFn: () => fetchChartData(selectedPeriod),
        staleTime: 5 * 60 * 1000, // Dữ liệu vẫn "tươi" trong 5 phút
        cacheTime: 10 * 60 * 1000, // Cache trong 10 phút
        refetchOnWindowFocus: false, // Không refetch khi focus window
        refetchOnMount: false, // Chỉ fetch khi mounted nếu dữ liệu stale
        refetchOnReconnect: false, // Không refetch khi reconnect
        retry: 1, // Chỉ retry 1 lần khi fail
        // Tối ưu cho dữ liệu chart: không cần background refetch
        refetchInterval: false,
        // Keep previous data khi đang fetch data mới
        keepPreviousData: true,
    });

    // Tối ưu: Memoize các hàm tính toán
    const getMaxValue = React.useCallback(() => {
        const data = chartData.data || [];
        if (data.length === 0) return 400;
        const maxDataValue = Math.max(...data);
        return Math.ceil(maxDataValue / 10) * 10 + 10;
    }, [chartData.data]);

    const getStepSize = React.useCallback(() => {
        const maxValue = getMaxValue();
        return Math.ceil(maxValue / 4);
    }, [getMaxValue]);

    // Tạo gradient với useMemo để tránh tạo lại
    const createGradient = React.useCallback((ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(0, 123, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0.05)');
        return gradient;
    }, []);

    // Memoize chart data để tránh tạo lại object mỗi lần render
    const chartDataConfig = React.useMemo(() => {
        const ctx = chartRef.current?.ctx;
        
        return {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Guest Visits',
                    data: chartData.data,
                    backgroundColor: ctx ? createGradient(ctx) : 'rgba(223, 161, 68, 0.8)',
                    borderColor: 'rgba(223, 161, 68, 0.8)',
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
    }, [chartData.labels, chartData.data, createGradient]);

    // Memoize chart options
    const chartOptions = React.useMemo(() => ({
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
                        return `Booking: ${context.parsed.y}`;
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
                max: getMaxValue(),
                grid: {
                    color: '#e9ecef',
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    color: '#6c757d',
                    stepSize: getStepSize(),
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
    }), [getMaxValue, getStepSize]);

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    return (
        <div className={chartCard}>
            <div className={header}>
                <h3 className={title}>Guest Visits</h3>
                <div className={styles.periodSelector}>
                    <select 
                        className={sortBy} 
                        value={selectedPeriod} 
                        onChange={handlePeriodChange}
                        disabled={isLoading}
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                    </select>
                    {isLoading && (
                        <span className={styles.loadingIndicator}>Loading...</span>
                    )}
                </div>
            </div>
            
            <div className={chartContainer}>
                {isError ? (
                    <div className={styles.errorContainer}>
                        <p>Failed to load chart data</p>
                        <button onClick={() => refetch()}>Retry</button>
                    </div>
                ) : (
                    <Line 
                        ref={chartRef}
                        data={chartDataConfig} 
                        options={chartOptions}
                        plugins={[]}
                        redraw={isLoading} // Chỉ redraw khi loading để giữ UI ổn định
                    />
                )}
            </div>
        </div>
    );
};

export default GuestVisitsChart;