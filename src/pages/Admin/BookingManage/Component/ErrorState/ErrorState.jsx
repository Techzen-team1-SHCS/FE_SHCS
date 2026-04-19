const ErrorState = ({ message = "Đã xảy ra lỗi", onRetry }) => {
    return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            <p>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        padding: '10px 20px',
                        marginTop: '20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Thử lại
                </button>
            )}
        </div>
    );
};

export default ErrorState;