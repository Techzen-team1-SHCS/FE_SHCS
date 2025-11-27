import React, { useState } from 'react';
import paymentService from '../../services/paymentService';
import LoaderButton from '../Loading/LoaderButton';
import { toast } from 'react-toastify';
import styles from './Payment.module.css';

const PaymentButtonVnPay = ({ bookingId, amount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePayment = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await paymentService.createPayment(bookingId);
    } catch (error) {
      console.error(error);
      toast.warning('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={styles.slice}
      style={{width:"30%",fontSize:"16px", marginBottom:"20px"}}
    >
      <span className={styles.text}>
        {isLoading ? <LoaderButton color='black'/> : 'Thanh toán qua VNPay'}
      </span>
    </button>
  );
};

export default PaymentButtonVnPay;
