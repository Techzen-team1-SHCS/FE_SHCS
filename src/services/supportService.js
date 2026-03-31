import api from './api';

export const supportService = {
    // Gửi yêu cầu hỗ trợ (không cần token)
    async submitSupportTicket(ticketData) {
        try {
            const response = await api.post('/auth/support-tickets', ticketData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                // Validation errors từ Laravel
                const errors = error.response.data.errors;
                const errorMessage = Object.values(errors).flat().join(', ');
                throw new Error(errorMessage);
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(error.message || 'Gửi yêu cầu thất bại');
            }
        }
    },

    // Lấy danh sách ticket (cho admin - cần token)
    async getSupportTickets() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await api.get('/support-tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized - Vui lòng đăng nhập lại');
            } else {
                throw new Error(error.response?.data?.message || 'Failed to fetch support tickets');
            }
        }
    },

    // Lấy chi tiết ticket (cho admin - cần token)
    async getSupportTicket(id) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await api.get(`/support-tickets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized - Vui lòng đăng nhập lại');
            } else if (error.response?.status === 404) {
                throw new Error('Ticket không tồn tại');
            } else {
                throw new Error(error.response?.data?.message || 'Failed to fetch ticket details');
            }
        }
    },

    // Cập nhật trạng thái ticket (cho admin)
    async updateTicketStatus(id, status) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await api.put(`/support-tickets/${id}`, {
                status: status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized - Vui lòng đăng nhập lại');
            } else {
                throw new Error(error.response?.data?.message || 'Failed to update ticket status');
            }
        }
    }
};