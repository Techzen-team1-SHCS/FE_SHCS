const RejectModal = ({ hotel, reason, onReasonChange, onSubmit, onCancel }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "90%"
      }}>
        <h3 style={{ marginBottom: "12px" }}>Reject Hotel</h3>
        <p style={{ marginBottom: "12px", color: "#666" }}>
          Please provide a reason for rejecting {hotel.name}:
        </p>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(hotel.id, e.target.value)}
          placeholder="Reason for rejection..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "12px",
            fontFamily: "inherit"
          }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onSubmit(hotel.id)}
            style={{
              flex: 1,
              padding: "10px",
              background: "#E74C3C",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Confirm Rejection
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              background: "#95A5A6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
