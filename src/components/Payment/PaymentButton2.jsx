// components/Payment/VNPayPayment.jsx
import { useState } from 'react';
import styles from './Payment.module.css';
import paymentService from '../../services/paymentService';
const PaymentButton2 = ({ hotelData,amount  }) => {
  const [loading, setLoading] = useState(false);

  const handleVNPayPayment = async () => {
    setLoading(true);
    try {
      const payload = {
        amount: amount,
        orderInfo: `Thanh toán booking ${hotelData?.name || 'Khách sạn'}`,
        orderType: 'billpayment',
        bankCode: '', // Để trống để user chọn trên VNPAY
      };

      const response = await paymentService.createVNPayPayment(payload);

      if (response.paymentUrl) {
        // QUAN TRỌNG: Redirect đến VNPAY Gateway
        window.location.href = response.paymentUrl;
      } else {
        alert('Không thể tạo link thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Lỗi khi khởi tạo thanh toán: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.buttonContainer}>
      <button 
        className={styles.paymentButton}
        onClick={handleVNPayPayment}
        disabled={loading || !amount}
      >
        <div className='d-flex'>
          {loading ? 'Đang xử lý...' : 'Ví điện tử'}
          <div className={styles.paymentImg}><img src="/assets/images/logos/vnpay-logo2.png?url" alt="vnpay"></img></div>
        </div>
        <div className={styles.paymentImg}><img src='/assets/images/logos/vnpay-logo1.png?url'></img></div>
      </button>
    </div>
  );
};

export default PaymentButton2;