import { useState } from "react";
import { cityData } from "../../Constants/RegisterHotel/CityData";

export function usePropertyForm(initial = {}) {
  const [city, setCity] = useState(() => initial.province || "Da Nang");
  const [district, setDistrict] = useState(() => initial.name_nearby_place || "");
  const [address, setAddress] = useState(() => initial.address || "");
  const [zip, setZip] = useState(() => initial.zip || "");
  const [latitude, setLatitude] = useState(() =>
    initial.latitude != null ? Number(initial.latitude) : null
  );
  const [longitude, setLongitude] = useState(() =>
    initial.longitude != null ? Number(initial.longitude) : null
  );

  const districts = cityData[city];

  const handleCityChange = (value) => {
    setCity(value);
    setDistrict("");
  };

  return {
    city,
    district,
    address,
    zip,
    latitude,
    longitude,
    districts,
    setDistrict,
    setAddress,
    setZip,
    setLatitude,
    setLongitude,
    handleCityChange
  };
}