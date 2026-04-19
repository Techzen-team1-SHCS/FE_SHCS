import { toast } from 'react-toastify';

const HotelPagination = ({ paginationData, handlePageChange, loading }) => {
    const totalResults = paginationData.total || 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px', padding: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
                Hiển thị {(paginationData.current_page - 1) * paginationData.per_page + 1} - {Math.min(paginationData.current_page * paginationData.per_page, totalResults)} của {totalResults} kết quả
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                    onClick={() => handlePageChange(paginationData.current_page - 1)}
                    disabled={paginationData.current_page === 1 || loading}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: paginationData.current_page === 1 ? '#f0f0f0' : '#fff',
                        cursor: paginationData.current_page === 1 ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    ← Trước
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: paginationData.last_page }, (_, i) => i + 1).map(page => {
                        const isCurrentPage = page === paginationData.current_page;
                        const isNearby = Math.abs(page - paginationData.current_page) <= 2;
                        const isFirstOrLast = page === 1 || page === paginationData.last_page;

                        if (!isNearby && !isFirstOrLast) {
                            if (page === 2 || page === paginationData.last_page - 1) {
                                return <span key={`dots-${page}`} style={{ color: '#999', padding: '0 4px' }}>...</span>;
                            }
                            return null;
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                disabled={loading}
                                style={{
                                    padding: '8px 12px',
                                    border: isCurrentPage ? '2px solid #0085ff' : '1px solid #ddd',
                                    backgroundColor: isCurrentPage ? '#0085ff' : '#fff',
                                    color: isCurrentPage ? '#fff' : '#333',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: isCurrentPage ? 'bold' : 'normal',
                                    minWidth: '36px'
                                }}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => handlePageChange(paginationData.current_page + 1)}
                    disabled={paginationData.current_page === paginationData.last_page || loading}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: paginationData.current_page === paginationData.last_page ? '#f0f0f0' : '#fff',
                        cursor: paginationData.current_page === paginationData.last_page ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    Sau →
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '20px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Đến trang:</span>
                <input
                    type="number"
                    min="1"
                    max={paginationData.last_page}
                    defaultValue={paginationData.current_page}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= paginationData.last_page) {
                                handlePageChange(page);
                            } else {
                                toast.error(`Vui lòng nhập trang từ 1 đến ${paginationData.last_page}`);
                            }
                        }
                    }}
                    style={{
                        padding: '6px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '60px',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={(event) => {
                        const input = event.target.parentElement.querySelector('input');
                        const page = parseInt(input.value);
                        if (page >= 1 && page <= paginationData.last_page) {
                            handlePageChange(page);
                        } else {
                            toast.error(`Vui lòng nhập trang từ 1 đến ${paginationData.last_page}`);
                        }
                    }}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#0085ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Đi
                </button>
            </div>
        </div>
    );
};

export default HotelPagination;
