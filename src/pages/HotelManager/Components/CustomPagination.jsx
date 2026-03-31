import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Box from '@mui/material/Box';

// Tối ưu lại chữ, dùng thẻ span để dễ style font
const PreviousText = () => <span style={{ fontFamily: 'inherit' }}>Quay lại</span>;
const NextText = () => <span style={{ fontFamily: 'inherit' }}>Tiếp theo</span>;

const CustomPagination = ({ 
  count, 
  page, 
  onChange, 
}) => {
  return (
    <Box sx={{ width: '100%', my: 5 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        shape="circular"
        variant="outlined"
        sx={{
            width: '100%',
            '& .MuiPagination-ul': {
              display: 'flex',
              width: '100%',
              alignItems: 'center', // Căn giữa theo chiều dọc
            },
            
            // Ép 2 nút ra 2 góc
            '& .MuiPagination-ul li:first-of-type': { marginRight: 'auto' },
            '& .MuiPagination-ul li:last-of-type': { marginLeft: 'auto' },
            
            /* =========================================
               🎨 THIẾT KẾ DÀNH CHO WEB KHÁCH SẠN
               ========================================= */
               
            // 1. Style chung cho TẤT CẢ các nút
            '& .MuiPaginationItem-root': {
              fontSize: '1rem',
              fontWeight: 500,
              minWidth: '40px',
              height: '40px',
              color: '#475569', // Xám thanh lịch
              borderColor: '#E2E8F0', // Viền xám nhạt
              backgroundColor: '#FFFFFF',
              transition: 'all 0.3s ease', // Hiệu ứng chuyển đổi mượt mà
              
              '&:hover': {
                backgroundColor: '#F8FAFC', // Nền sáng nhẹ khi đưa chuột vào
                borderColor: '#CBD5E1',
                transform: 'translateY(-1px)', // Nảy nhẹ lên
              },
            },

            // 2. Style RIÊNG cho trang đang ĐƯỢC CHỌN (Active)
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#0F4C81', // Xanh Navy cao cấp (Trust Blue)
              color: '#FFFFFF',
              borderColor: '#0F4C81',
              boxShadow: '0 4px 10px rgba(15, 76, 129, 0.3)', // Đổ bóng sang trọng
              fontWeight: 'bold',
              
              '&:hover': {
                backgroundColor: '#0B3A63', // Xanh đậm hơn khi hover
              }
            },

            // 3. Style RIÊNG cho 2 nút Quay lại / Tiếp theo
            '& .MuiPaginationItem-previousNext': {
              minWidth: '110px',      // Nút dài ra
              height: '44px',         // Cao hơn nút số một chút
              padding: '0 24px',
              borderRadius: '30px',   // Bo tròn dạng viên thuốc
              textTransform: 'uppercase', // In hoa chữ
              fontSize: '0.85rem',
              letterSpacing: '1px',   // Khoảng cách chữ thưa ra cho sang
              fontWeight: 600,
              color: '#0F4C81',       // Chữ màu xanh cùng tone
              borderColor: '#0F4C81',
              
              '&:hover': {
                backgroundColor: '#0F4C81',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(15, 76, 129, 0.2)',
              },
              
              // Style khi ở trang đầu/trang cuối không bấm được nữa (Disabled)
              '&.Mui-disabled': {
                borderColor: '#E2E8F0',
                color: '#94A3B8',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                transform: 'none',
              }
            }
          }}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: PreviousText, next: NextText }}
            {...item}
          />
        )}
      />
    </Box>
  );
};

export default CustomPagination;