import api from './api';
export const notificationService = {
    async getNotifications(){
        try {
            const token=localStorage.getItem('token');
            if(!token){
                throw new Error('Authentication token not found');
            }
           const response=await api.get('auth/Allnotifications',{
            headers:{ Authorization:`Bearer ${token}` }
           });
           return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
};

