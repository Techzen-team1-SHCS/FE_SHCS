import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PaymentResult.module.css';
import paymentService from '../../services/paymentService';
const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPaymentResult = async () => {
      const queryParams = new URLSearchParams(location.search);

      const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
      const vnp_TransactionStatus = queryParams.get('vnp_TransactionStatus');
      const vnp_TxnRef = queryParams.get('vnp_TxnRef');

      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
        setResult({
          success: true,
          message: 'Thanh toán thành công!',
          transactionId: vnp_TxnRef
        });

        // SỬ DỤNG SERVICE
        await paymentService.updatePaymentStatus({
          orderId: vnp_TxnRef,
          status: 'success'
        });
      } else {
        setResult({
          success: false,
          message: 'Thanh toán thất bại. Vui lòng thử lại.'
        });
      }

      setLoading(false);
    };

    processPaymentResult();
  }, [location]);


  if (loading) return <div className={styles.loading}>Đang xử lý...</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.resultCard} ${result.success ? styles.success : styles.error}`}>
        <h2 className={styles.title}>
          {result.success ? '✅ Thanh toán thành công' : '❌ Thanh toán thất bại'}
        </h2>
        <p className={styles.message}>{result.message}</p>
        {result.success && (
          <p className={styles.transactionId}>
            Mã giao dịch: <strong>{result.transactionId}</strong>
          </p>
        )}
        <button
          className={styles.homeButton}
          onClick={() => navigate('/')}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;