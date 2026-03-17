import { useEffect, useRef } from "react";
import { behaviorService } from "../../../../services/behaviorService";

export function useApproveUser(user) {
  const userRef = useRef(null);
  const hasSentRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    return () => {
      if (!userRef.current || hasSentRef.current) return;

      hasSentRef.current = true;
      behaviorService.approveUser(userRef.current.id);
    };
  }, []);
}