// services/paymentService.js
import api from './api';

class PaymentService {
  async createPayment(bookingId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Gọi API BE để tạo link thanh toán
      const response = await api.post('auth/vnpay/create-payment',
        { booking_id: bookingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Nếu BE trả về link thanh toán
      if (response.data && response.data.payment_url) {
        window.location.href = response.data.payment_url; // redirect qua VNPay
      } else {
        throw new Error('Không nhận được URL thanh toán từ server');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPay:', error);
      throw error;
    }
  }
}

// Tạo instance và export
const paymentService = new PaymentService();
export default paymentService;