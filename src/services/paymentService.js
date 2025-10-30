// services/paymentService.js
import axios from 'axios';

const API_BASE_URL =  'http://localhost:8000/api';

class PaymentService {
  // Tạo payment URL cho VNPAY
  async createVNPayPayment(paymentData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/create-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cập nhật trạng thái đơn hàng sau khi thanh toán
  async updatePaymentStatus(orderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/update-status`, orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy thông tin giao dịch
  async getTransactionInfo(transactionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Hủy giao dịch
  async cancelTransaction(transactionId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/cancel`, { transactionId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy lịch sử giao dịch
  async getPaymentHistory(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/history/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Kiểm tra trạng thái giao dịch
  async checkPaymentStatus(orderId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Xử lý lỗi thống nhất
  handleError(error) {
    if (error.response) {
      // Server trả về lỗi
      return new Error(error.response.data.message || 'Lỗi server');
    } else if (error.request) {
      // Không nhận được response
      return new Error('Không thể kết nối đến server');
    } else {
      // Lỗi khác
      return new Error('Lỗi không xác định');
    }
  }
}

// Tạo instance và export
const paymentService = new PaymentService();
export default paymentService;