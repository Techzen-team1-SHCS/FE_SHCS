function ErrorMessage({ error, onRetry }) {
  return (
    <div
      style={{
        background: "#fee",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #fcc"
      }}
    >
      <strong>❌ Lỗi tải dữ liệu:</strong> {error?.message}

      <button
        onClick={onRetry}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Thử lại
      </button>
    </div>
  );
}

export default ErrorMessage;