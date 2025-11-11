
import api from './api';
export const commentService = {
    async postComment(commentData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const response = await api.post('auth/comments', commentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error posting comment:', error);
            throw error;
        }
    },
    async getComments(params = {}) {
        try {
            // Cho phép truyền params như { maHotel }
            const response = await api.get('auth/comments', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },
};