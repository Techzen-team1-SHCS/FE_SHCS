import React from 'react';
import paymentService from '../../services/paymentService';


const PaymentButtonVnPay = ({ bookingId, amount }) => {
  const handlePayment = async () => {
    try {
      await paymentService.createPayment(bookingId);
    } catch (error) {
      console.error(error);
      alert('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        backgroundColor: '#0a7cff',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Thanh toán qua VNPay
    </button>
  );
};

export default PaymentButtonVnPay;
