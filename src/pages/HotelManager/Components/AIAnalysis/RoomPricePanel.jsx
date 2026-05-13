import {
  LABEL_PRICE_ADVICE,
  LABEL_OCCUPANCY_TARGET,
  LABEL_PRICE_CTA,
} from "../../Constants/Analysis/aiAnalysisConstants";
import styles from "./RoomPricePanel.module.css";

function parseDynamicPricingPercent(dynamicPricing = "") {
  const text = String(dynamicPricing || "").toLowerCase();

  const increaseMatch = text.match(/(?:tăng|tang)[^\d]*(\d+(?:[.,]\d+)?)\s*%/i);
  if (increaseMatch) {
    return {
      type: "increase",
      percent: Number(increaseMatch[1].replace(",", ".")) || 0,
    };
  }

  const decreaseMatch = text.match(/(?:giảm|giam)[^\d]*(\d+(?:[.,]\d+)?)\s*%/i);
  if (decreaseMatch) {
    return {
      type: "decrease",
      percent: Number(decreaseMatch[1].replace(",", ".")) || 0,
    };
  }

  const genericMatch = text.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (genericMatch) {
    return {
      type: "increase",
      percent: Number(genericMatch[1].replace(",", ".")) || 0,
    };
  }

  return null;
}

function formatVnd(value = 0) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}
function calculateRecommendedPrice(normalPrice = 0, dynamicPricing = "") {
  console.log(normalPrice, dynamicPricing);
  const basePrice = Number(normalPrice);
  if (!Number.isFinite(basePrice) || basePrice <= 0) return null;

  const parsed = parseDynamicPricingPercent(dynamicPricing);
  if (!parsed || !Number.isFinite(parsed.percent) || parsed.percent <= 0)
    return null;

  const ratio = parsed.percent / 100;
  const result =
    parsed.type === "decrease"
      ? basePrice * (1 - ratio)
      : basePrice * (1 + ratio);

  return result > 0 ? result : null;
}

export default function RoomPricePanel({
  dynamicPricing = "",
  normalPrice = 0,
}) {
  const recommendedPrice = calculateRecommendedPrice(
    normalPrice,
    dynamicPricing,
  );
  const displayedTarget = recommendedPrice ? formatVnd(recommendedPrice) : "";
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.labelTop}>{LABEL_PRICE_ADVICE}</span>
        <span className={styles.tagIcon}>🏷️</span>
      </div>
      <p className={styles.value}>{displayedTarget}</p>
      <p className={styles.subLabel}>{LABEL_OCCUPANCY_TARGET}</p>
      <button className={styles.ctaBtn}>
        {dynamicPricing || LABEL_PRICE_CTA}
      </button>
    </div>
  );
}
