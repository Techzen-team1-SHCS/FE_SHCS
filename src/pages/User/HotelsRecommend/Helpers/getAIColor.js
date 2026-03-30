import { AI_COLORS } from "../Constants/aiColors";

export const getAIColor = (index) => {
  return AI_COLORS[index % AI_COLORS.length];
};