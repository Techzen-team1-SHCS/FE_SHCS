import { useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useRecommendedHotels } from "../../../../queries/useRecommendedHotels";

import AIHeader from "../Component/AIHeader/AIHeader";
import LoadingState from "../Component/LoadingState/LoadingState";
import ErrorState from "../Component/ErrorState/ErrorState";
import RecommendationGrid from "../Component/RecommendationGrid/RecommendationGrid";

import { useRecommendLogic } from "../Hooks/useRecommendLogic";

import TopHotelSlider from "../../../../components/TopHotelSlider/TopHotelSlider";

import "../style.css";

const HotelsRecommend = () => {

  const { user } = useContext(AuthContext);

  const {
    data: hotelsRecommendPage = [],
    isLoading,
    isError,
    isFetching,
    refetch
  } = useRecommendedHotels();

  const {
    hasInteraction,
    source
  } = useRecommendLogic(hotelsRecommendPage);

  const refreshing = isFetching && !isLoading;

  return (
    <div className="page-wrapper ai-recommend-page">

      <AIHeader
        user={user}
        source={source}
        refreshing={refreshing}
        refetch={refetch}
        hasInteraction={hasInteraction}
      />

      <section className="ai-recommendations-section">

        <div className="container_fluid">

          {isLoading && <LoadingState />}

          {isError && !isLoading && (
            <ErrorState refetch={refetch} />
          )}

          {!isLoading && !isError && hasInteraction && (
            <RecommendationGrid hotels={hotelsRecommendPage} />
          )}

        </div>

        {/* Top Hotels Slider - Luôn hiển thị */}
        <div className="ai-slider-section">
          <div className="ai-slider-header">
            <h2>{hasInteraction ? "You Might Also Like" : "Popular Hotels to Start With"}</h2>
            <p>{hasInteraction ? "More suggestions based on similar profiles" : "Explore these popular hotels to begin your journey"}</p>
          </div>
          <TopHotelSlider />
        </div>

      </section>

    </div>
  );
};

export default HotelsRecommend;