import { useEffect, useState } from "react";
import styles from "./YourStyle.module.css"; // nếu bạn có css

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = now.toLocaleDateString("vi-VN");
      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateDateTime(); // chạy 1 lần ban đầu
    const timer = setInterval(updateDateTime, 1000); // cập nhật mỗi giây

    return () => clearInterval(timer); // clear khi unmount
  }, []);

  return (
    <>
      <div className={styles.time}>{currentTime}</div>
      <div className={styles.date}>{currentDate}</div>
    </>
  );
}
