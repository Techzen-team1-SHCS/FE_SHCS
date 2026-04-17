import { useEffect, useState } from "react";

export const useRecommendLogic = (hotelsRecommendPage) => {
  const [hasInteraction, setHasInteraction] = useState(false);
  const [source, setSource] = useState("");

  useEffect(() => {
    const hasInteracted =
      localStorage.getItem("hasHotelInteraction") === "true";

    setHasInteraction(hasInteracted);

    const dataSource = localStorage.getItem("token")
      ? "AI/History"
      : "Top Hotels";

    setSource(dataSource);

    if (hotelsRecommendPage.length > 0 && !hasInteracted) {
      setHasInteraction(true);
    }
  }, [hotelsRecommendPage]);

  return {
    hasInteraction,
    source,
    setHasInteraction,
  };
};