import { useEffect, useState } from "react";
import { parseAmenities } from "../Helpers/parseAmenities";

export const useAmenities = (hotelData) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelData?.room?.hotel?.amenities) {
      const parsed = parseAmenities(hotelData.room.hotel.amenities);
      setServices(parsed);
    } else {
      setServices([]);
    }

    setLoading(false);
  }, [hotelData]);

  return { services, loading };
};