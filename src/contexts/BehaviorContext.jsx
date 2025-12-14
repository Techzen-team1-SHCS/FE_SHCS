import { createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const BehaviorContext = createContext();

let queue = [];
let timer = null;

const BATCH_TIME = 3000;   // 3 giây
const MAX_BATCH = 20;      // hoặc đủ 20 log thì gửi ngay

export const BehaviorProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const logBehavior = (action, metadata = {}) => {
    if (!user?.id) return;

    queue.push({
      user_id: user.id,
      hotel_id: metadata.hotelId || null,
      action,
      metadata,
      created_at: Date.now(),
    });

    // đủ batch → gửi ngay
    if (queue.length >= MAX_BATCH) {
      flush();
      return;
    }

    // debounce
    if (!timer) {
      timer = setTimeout(flush, BATCH_TIME);
    }
  };

  const flush = async () => {
    if (queue.length === 0) return;

    const batch = [...queue];
    queue = [];
    clearTimeout(timer);
    timer = null;

    try {
      await axios.post(
        "http://localhost:8000/api/auth/user-behaviors/batch",
        { logs: batch },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ Behavior batch error:", error);
      // ❗ nếu muốn retry: queue.unshift(...batch);
    }
  };

  return (
    <BehaviorContext.Provider value={{ logBehavior }}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
