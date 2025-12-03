import api from './api';
export const dashboardService = {
    async getDashboardRevenue(){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found');
            }
            const response=await api.get('auth/dashboard/revenue', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard revenue');
        }
    },
    async getBookingsByMonth(month, year) {
        try {
        const token = localStorage.getItem('token');
        if(!token){
                throw new Error('Authentication token not found');
        }
        const response = await api.get('auth/dashboard/by_month', {
            headers: { Authorization: `Bearer ${token}` },
            params: { month, year } // nếu không truyền -> API lấy tháng mới nhất
        });
        return response.data.total; // {status, month, year, total, data}
        } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    },
    async getBookingCharts(type="monthly"){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found')
            }
            const response=await api.get('auth/dashboard/bookings-chart',{
                headers:{Authorization:`Bearer ${token}`},
                params:{type},
            });
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');

        }
    },
    async getHotelBookingCharts(){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found')
            }
            const response=await api.get('auth/dashboard/topHotelChart',{
                headers:{Authorization:`Bearer ${token}`},
            });
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    },
    async getHotelBookingToday(){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found')
            }
            const response=await api.get('auth/dashboard/todayBooking',{
                headers:{Authorization:`Bearer ${token}`},
            })
            return response.data.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    },
    async getRoomData(){
       try {
        const token=localStorage.getItem('token');
        if(!token){
            throw new Error('Authentication token not found')
        }
        const response=await api.get('auth/dashboard/getRoom',{
            headers:{Authorization:`Bearer ${token}`},
        })
        return response.data;        
       } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch bookings');

       }
    },
    async getBookingStats(){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found');
            }
            const response=await api.get('auth/dashboard/getStats',{
                headers:{Authorization:`Bearer ${token}`},
            })
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
};