import { useState } from "react";
import { cityData } from "../../Constants/RegisterHotel/CityData";

export function usePropertyForm() {

  const [city, setCity] = useState("Da Nang");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

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
    districts,
    setDistrict,
    setAddress,
    setZip,
    handleCityChange
  };
}