import React from "react";
import styles from "../../PaymentResult.module.css";

const PaymentResultCard = ({ result, onGoHome }) => {
  return (
    <div
      className={`${styles.resultCard} ${
        result.success ? styles.success : styles.error
      }`}
    >
      <h2 className={styles.title}>
        {result.success
          ? "✅ Thanh toán thành công"
          : "❌ Thanh toán thất bại"}
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

      <button className={styles.homeButton} onClick={onGoHome}>
        Quay về trang chủ
      </button>
    </div>
  );
};

export default React.memo(PaymentResultCard);