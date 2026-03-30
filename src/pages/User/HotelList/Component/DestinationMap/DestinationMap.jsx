function DestinationMap({ destination }) {
  if (!destination) return null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    destination
  )}&output=embed`;

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "15px",
      }}
    >
      <iframe
        src={mapSrc}
        width="100%"
        height="300px"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        title={`Map of ${destination}`}
      />
    </div>
  );
}

export default DestinationMap;