import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styles from "./Step1Property.module.css";
import { cityData } from "../../../Constants/RegisterHotel/CityData";
import { usePropertyForm } from "../../../hooks/RegisterHotel/Step1Property";
import Step1PropertyMap from "./Step1PropertyMap";

async function geocodeNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data?.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

export default function Step1Property({ nextStep, setData, data = {} }) {
  const {
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
    handleCityChange,
  } = usePropertyForm(data);

  const [geocoding, setGeocoding] = useState(false);

  const mapPosition = useMemo(() => {
    if (latitude == null || longitude == null) return null;
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return [latitude, longitude];
  }, [latitude, longitude]);

  const buildSearchQuery = useCallback(() => {
    return [address, district, city, "Vietnam"].filter(Boolean).join(", ");
  }, [address, district, city]);

  const handleShowOnMap = useCallback(async () => {
    const q = buildSearchQuery().trim();
    if (!q) {
      toast.warn("Nhập địa chỉ hoặc chọn khu vực trước khi tìm trên bản đồ.");
      return;
    }
    setGeocoding(true);
    try {
      const coords = await geocodeNominatim(q);
      if (!coords) {
        toast.error("Không tìm thấy vị trí. Thử nhập địa chỉ chi tiết hơn.");
        return;
      }
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    } catch {
      toast.error("Không lấy được tọa độ. Thử lại sau vài giây.");
    } finally {
      setGeocoding(false);
    }
  }, [buildSearchQuery, setLatitude, setLongitude]);

  const handleMarkerDrag = useCallback(
    ({ lat, lng }) => {
      setLatitude(lat);
      setLongitude(lng);
    },
    [setLatitude, setLongitude]
  );

  const handleContinue = () => {
    if (typeof setData === "function") {
      setData({
        province: city,
        name_nearby_place: district,
        address,
        zip,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
      });
    }
    nextStep();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your property</h2>

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <div className={styles.card}>
            <label className={styles.label}>Your Address</label>
            <input
              type="text"
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleShowOnMap();
                }
              }}
              placeholder="Số nhà, đường..."
            />

            <div className={styles.field}>
              <label className={styles.label}>City</label>
              <select
                className={styles.input}
                value={city}
                onChange={(e) => {
                  handleCityChange(e.target.value);
                }}
              >
                {Object.keys(cityData).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>District/County</label>
                <select
                  className={styles.input}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Select district</option>
                  {districts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className={styles.col}>
                <label className={styles.label}>Zip code</label>
                <input
                  type="text"
                  className={styles.input}
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className={styles.mapSearchBtn}
              onClick={handleShowOnMap}
              disabled={geocoding}
            >
              {geocoding ? "Đang tìm…" : "Hiển thị trên bản đồ"}
            </button>
            <p className={styles.mapHint}>
              Bản đồ dùng OpenStreetMap + Nominatim (miễn phí). Kéo marker để chỉnh vị trí.
            </p>
          </div>

          <button className={styles.continueBtn} onClick={handleContinue}>
            continue
          </button>
        </div>

        <div className={styles.mapColumn}>
          <div className={styles.mapTitle}>Vị trí</div>
          <Step1PropertyMap position={mapPosition} onMarkerDragEnd={handleMarkerDrag} />
        </div>
      </div>
    </div>
  );
}
