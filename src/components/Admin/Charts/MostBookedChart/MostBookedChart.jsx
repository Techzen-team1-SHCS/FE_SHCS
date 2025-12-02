import React, { useEffect, useRef, useState } from 'react';
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
import { dashboardService } from '../../../../services/dashBoardService';

// Register Bar chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MostBookedChart = () => {
    const {
        chartCard,
        header,
        title,
        chartContainer
    } = styles;
    const [hotelBooking,setHotelBooking]=useState([]);
    const chartRef = useRef(null);
    useEffect(()=>{
        const fetchHotelBooking=async()=>{
            try {
                const hotelData=await dashboardService.getHotelBookingCharts();
                 setHotelBooking(hotelData);
            } catch (error) {
                console.error(error.response?.data?.message || 'Failed to fetch dashboard revenue');
 
            }
        }
        fetchHotelBooking();
    },[])
    // Dữ liệu fallback
    const getChartData = () => {
        const ctx = chartRef.current?.ctx;

        // Tạo gradient cho tất cả các cột
        const createGradient = (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 123, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 123, 255, 0.4)');
            return gradient;
        };

        // Lấy labels và data từ hotelBooking
        const labels = hotelBooking.map(h => h.name);        // tên khách sạn
        const data = hotelBooking.map(h => h.booking_count); // số lượt đặt

        return {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: data,
                    backgroundColor: ctx ? createGradient(ctx) : 'rgba(223, 161, 68, 0.8)',
                    borderColor: 'rgba(223, 161, 68, 0.8)',
                    borderWidth: 1,
                    borderRadius: 0,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.6,
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