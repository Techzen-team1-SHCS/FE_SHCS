import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentResult.module.css';
import PartLoading from '../../components/Loading/PartLoading';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Lấy status từ query string do backend gửi
    const status = queryParams.get('status'); // success hoặc failed
    const transactionId = queryParams.get('transactionId');
    const bookingId = queryParams.get('bookingId');

    if (status === 'success') {
      setResult({
        success: true,
        message: 'Thanh toán thành công!',
        transactionId,
        bookingId
      });
    } else {
      setResult({
        success: false,
        message: 'Thanh toán thất bại. Vui lòng thử lại.',
        transactionId,
        bookingId
      });
    }

    setLoading(false);
  }, [location]);

  if (loading) return <div className={styles.loading}><PartLoading/></div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.resultCard} ${result.success ? styles.success : styles.error}`}>
        <h2 className={styles.title}>
          {result.success ? '✅ Thanh toán thành công' : '❌ Thanh toán thất bại'}
        </h2>
        <p className={styles.message}>{result.message}</p>

        {result.success && (
          <>
            <p className={styles.transactionId}>
              Mã giao dịch: <strong>{result.transactionId}</strong>
            </p>
            <p className={styles.bookingId}>
              Mã booking: <strong>{result.bookingId}</strong>
            </p>
          </>
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
