export const parseAmenities = (amenitiesString) => {
  if (!amenitiesString) return [];

  try {
    const amenitiesArray = JSON.parse(amenitiesString);

    return amenitiesArray.map((amenity, index) => ({
      id: index + 1,
      name: amenity
    }));
  } catch (error) {
    console.error("Error parsing amenities:", error);
    return [];
  }
};