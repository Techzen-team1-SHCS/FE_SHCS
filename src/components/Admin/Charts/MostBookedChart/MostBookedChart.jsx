import React, { useRef, useMemo, useCallback } from 'react';
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
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from "./MostBookedChart.module.css";
import { dashboardService } from '../../../../services/dashBoardService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Tạo QueryClient instance riêng cho component này
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10 * 60 * 1000, // 10 phút
      cacheTime: 30 * 60 * 1000, // 30 phút
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
      refetchOnReconnect: false,
    },
  },
});

// Cache riêng ở service level (in-memory cache)
let hotelBookingCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút cache tại service

const getHotelBookingData = async () => {
  // Kiểm tra cache ở service level trước
  if (hotelBookingCache && Date.now() - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached data from service layer');
    return hotelBookingCache;
  }

  try {
    const response = await dashboardService.getHotelBookingCharts();
    
    // Lưu vào cache service
    hotelBookingCache = response;
    lastFetchTime = Date.now();
    
    return response;
  } catch (error) {
    console.error('Service fetch error:', error);
    throw error;
  }
};

// Component Loading Skeleton
const ChartSkeleton = () => (
  <div className={styles.skeletonContainer}>
    <div className={styles.skeletonHeader}></div>
    <div className={styles.skeletonChart}>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.skeletonBar}>
          <div className={styles.skeletonBarFill}></div>
        </div>
      ))}
    </div>
  </div>
);

// Main Chart Component
const MostBookedChartContent = () => {
  const { chartCard, header, title, chartContainer } = styles;
  const chartRef = useRef(null);

  // Sử dụng TanStack Query
  const { 
    data: hotelBooking = [], 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['hotelBookingCharts'], // Cache key duy nhất
    queryFn: getHotelBookingData,
    staleTime: 10 * 60 * 1000, // 10 phút
    cacheTime: 30 * 60 * 1000, // 30 phút
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
    refetchInterval: false,
    select: (data) => {
      // Chỉ lấy top 5 và sắp xếp
      const sortedData = [...data]
        .sort((a, b) => b.booking_count - a.booking_count)
        .slice(0, 5);
      return sortedData;
    }
  });

  // Memoize gradient creation
  const createGradient = useCallback((ctx) => {
    if (!ctx) return 'rgba(223, 161, 68, 0.8)';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 123, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 123, 255, 0.4)');
    return gradient;
  }, []);

  // Memoize chart data
  const chartData = useMemo(() => {
    const ctx = chartRef.current?.ctx;
    const labels = hotelBooking.map(h => h.name || 'Unknown');
    const data = hotelBooking.map(h => h.booking_count || 0);

    // Tự động cắt bớt label nếu quá dài
    const truncatedLabels = labels.map(label => 
      label.length > 15 ? label.substring(0, 15) + '...' : label
    );

    return {
      labels: truncatedLabels,
      datasets: [{
        label: 'Bookings',
        data,
        backgroundColor: ctx ? createGradient(ctx) : 'rgba(223, 161, 68, 0.8)',
        borderColor: 'rgba(223, 161, 68, 0.8)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
      }],
    };
  }, [hotelBooking, createGradient]);

  // Tính toán max value cho y-axis
  const getMaxValue = useCallback(() => {
    if (!hotelBooking.length) return 100;
    const maxBooking = Math.max(...hotelBooking.map(h => h.booking_count || 0));
    return Math.ceil(maxBooking / 10) * 10 + 10;
  }, [hotelBooking]);

  // Tính toán step size
  const getStepSize = useCallback(() => {
    const maxValue = getMaxValue();
    return Math.ceil(maxValue / 5);
  }, [getMaxValue]);

  // Memoize chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: hotelBooking.length > 0 ? 750 : 0, // Tắt animation khi không có data
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const hotelName = hotelBooking[context.dataIndex]?.name || 'Unknown';
            return `${hotelName}: ${value.toLocaleString()} bookings`;
          },
          title: function() {
            return ''; // Ẩn title mặc định
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hotels',
          color: '#495057',
          font: {
            size: 14,
            weight: '600'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12,
          },
          maxRotation: 45,
          minRotation: 0,
          callback: function(value, index) {
            // Hiển thị full name trong tooltip, chỉ hiển thị tên rút gọn ở axis
            const label = this.getLabelForValue(value);
            return label;
          }
        }
      },
      y: {
        beginAtZero: true,
        max: getMaxValue(),
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6c757d',
          stepSize: getStepSize(),
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        border: {
          display: false
        },
        title: {
          display: true,
          text: 'Number of Bookings',
          color: '#495057',
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  }), [hotelBooking, getMaxValue, getStepSize]);

  // Hiển thị loading skeleton
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Hiển thị lỗi
  if (isError) {
    return (
      <div className={chartCard}>
        <div className={header}>
          <h3 className={title}>Top 5 Most Booked Hotels</h3>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            {error?.message || 'Failed to load chart data'}
          </p>
          <div className={styles.errorActions}>
            <button 
              className={styles.retryButton}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? 'Retrying...' : 'Retry'}
            </button>
            <button 
              className={styles.cacheButton}
              onClick={() => {
                // Thử dùng cache nếu có
                if (hotelBookingCache) {
                  queryClient.setQueryData(['hotelBookingCharts'], hotelBookingCache);
                }
              }}
            >
              Use Cached Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={chartCard}>
      <div className={header}>
        <h3 className={title}>Top 5 Most Booked Hotels</h3>
        <div className={styles.chartInfo}>
          <span className={styles.dataCount}>
            Showing {hotelBooking.length} hotels
          </span>
          {hotelBooking.length > 0 && (
            <span className={styles.totalBookings}>
              Total: {hotelBooking.reduce((sum, h) => sum + (h.booking_count || 0), 0).toLocaleString()} bookings
            </span>
          )}
          <button 
            className={styles.refreshButton}
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh data"
          >
            {isFetching ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
      
      <div className={chartContainer}>
        <Bar
          ref={chartRef}
          data={chartData}
          options={chartOptions}
          key={`chart-${hotelBooking.length}-${Date.now()}`}
        />
      </div>
      
      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugInfo}>
          <small>
            Status: {isFetching ? 'Fetching...' : 'Ready'} | 
            Cache: {hotelBookingCache ? 'Available' : 'Empty'} | 
            Data points: {hotelBooking.length}
          </small>
        </div>
      )}
    </div>
  );
};

// Wrapper component với QueryClientProvider
const MostBookedChart = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MostBookedChartContent />
    </QueryClientProvider>
  );
};

export default MostBookedChart;