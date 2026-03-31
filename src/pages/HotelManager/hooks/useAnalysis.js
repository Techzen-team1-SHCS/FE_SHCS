import { useState } from "react";

export function useAnalysis() {
  const [selectedReason, setSelectedReason] = useState(null);

  return {
    selectedReason,
    setSelectedReason
  };
}