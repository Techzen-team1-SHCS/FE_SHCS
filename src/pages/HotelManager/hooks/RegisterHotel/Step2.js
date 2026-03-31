import { useState } from "react";

export function useAmenitiesForm() {

  const [amenities, setAmenities] = useState({
    tv: false,
    pool: false,
    bathroom: false,
    drink: false
  });

  const toggleAmenity = (name) => {
    setAmenities((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return {
    amenities,
    toggleAmenity
  };
}