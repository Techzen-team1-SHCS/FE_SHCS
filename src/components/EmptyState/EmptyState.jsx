import React from "react";
import styles from "../../pages/Profile/Profile.module.css";

const EmptyState = () => {
  return (
    <div className={styles.empty}>
      <img src="/assets/images/cta/no-trip.png" alt="No trips" />
      <h3>Đi đâu tiếp đây?</h3>
      <p>
        Bạn chưa có chuyến đi nào cả, sau khi đặt chỗ nó sẽ hiển thị ở đây.
      </p>
    </div>
  );
};

export default EmptyState;
