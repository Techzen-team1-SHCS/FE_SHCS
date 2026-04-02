export const parseAmenities = (data) => {
  if (!data) return [];
  
  let amenitiesArray = [];
  
  if (Array.isArray(data)) {
    amenitiesArray = data;
  } else if (typeof data === "string") {
    const trimmedData = data.trim();
    if (trimmedData.length === 0) return [];
    
    try {
      if (trimmedData.startsWith("[") && trimmedData.endsWith("]")) {
        amenitiesArray = JSON.parse(trimmedData);
      } else {
        amenitiesArray = trimmedData.split(",").map(i => i.trim()).filter(Boolean);
      }
    } catch (e) {
      // Logic for fallback
      amenitiesArray = trimmedData.split(",").map(i => i.trim()).filter(Boolean);
    }
  }

  return amenitiesArray.map((amenity, index) => ({
    id: index + 1,
    name: amenity || ""
  }));
};