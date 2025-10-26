import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const BehaviorContext = createContext();

export const BehaviorProvider = ({ children }) => {
  const [behaviors, setBehaviors] = useState([]);
  const { user } = useContext(AuthContext);

  const behaviorsRef = useRef([]);
  
  const logBehavior = (action, metadata = {}) => {
    const behavior = {
      user_id: user?.id,
      hotel_id: metadata.hotelId || null,
      action,
      metadata,
    };
    setBehaviors((prev) => {
      const newArr = [...prev, behavior];
      behaviorsRef.current = newArr; // cập nhật ref
      return newArr;
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (behaviorsRef.current.length > 0) {
        console.log("Sending logs:", behaviorsRef.current);
        try {
          await axios.post(
            "http://localhost:8000/api/auth/user-behaviors/batch",
            { logs: behaviorsRef.current },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }
          );
          setBehaviors([]); // reset state
          behaviorsRef.current = []; // reset ref
        } catch (error) {
          console.error("❌ Error sending behaviors:", error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []); // chỉ chạy 1 lần khi mount

  return (
    <BehaviorContext.Provider value={{ logBehavior }}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
