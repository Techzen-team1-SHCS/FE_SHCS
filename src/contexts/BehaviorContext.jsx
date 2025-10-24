import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BehaviorContext = createContext();

export const BehaviorProvider = ({ children }) => {
  const [behaviors, setBehaviors] = useState([]);

  const logBehavior = (action, metadata = {}) => {
    const behavior = {
      user_id: localStorage.getItem("user_id") || null,
      hotel_id: metadata.hotelId || null,
      action,
      metadata,
    };
    setBehaviors((prev) => [...prev, behavior]);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (behaviors.length > 0) {
        console.log("Sending logs:", behaviors);
        try {
          await axios.post("http://localhost:8000/api/behaviors/batch", { logs: behaviors }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
          setBehaviors([]); // reset sau khi gửi thành công
        } catch (error) {
          console.error("❌ Error sending behaviors:", error);
        }
      }
    }, 30000); // gửi mỗi 30s

    return () => clearInterval(interval);
  }, [behaviors]);

  return (
    <BehaviorContext.Provider value={{ logBehavior }}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
