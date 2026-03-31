import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER = [16.0544, 108.2022];

function MapViewSync({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center?.length === 2) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function Step1PropertyMap({
  position,
  onMarkerDragEnd,
  height = 420,
}) {
  const center = position?.length === 2 ? position : DEFAULT_CENTER;
  const zoom = position?.length === 2 ? 15 : 12;

  return (
    <div style={{ height, width: "100%", borderRadius: 10, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync center={position} zoom={zoom} />
        {position?.length === 2 && (
          <Marker
            position={position}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onMarkerDragEnd?.({ lat, lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
