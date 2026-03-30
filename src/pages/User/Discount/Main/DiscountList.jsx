import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../DiscountList.module.css';
import { discounts } from '../Constants/discountData';
import { formatCurrency, formatDate, isExpired } from '../Helpers/discountUtils';

const DiscountList = () => {
    const { 
        container, 
        header, 
        title, 
        discountGrid, 
        discountCard, 
        discountImage, 
        discountInfo,
        discountTitle,
        discountCode,
        discountValue,
        discountExpiry,
        expiredBadge,
        activeBadge,
        viewButton,
        filterContainer,
        filterButton,
        filterActive,
        discountDes
    } = styles;

    const [activeFilter, setActiveFilter] = useState('all');

    const filteredDiscounts = discounts.filter(discount => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return discount.isActive;
        return discount.category === activeFilter;
    });

    return (
        <div className={container}>
            <div className={header}>
                <h1 className={title}>Mã giảm giá & Khuyến mãi</h1>
                <p>Khám phá các ưu đãi đặc biệt dành riêng cho bạn</p>
            </div>

            {/* Bộ lọc */}
            <div className={filterContainer}>
                <button 
                    className={`${filterButton} ${activeFilter === 'all' ? filterActive : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    Tất cả
                </button>
                <button 
                    className={`${filterButton} ${activeFilter === 'active' ? filterActive : ''}`}
                    onClick={() => setActiveFilter('active')}
                >
                    Đang hoạt động
                </button>
                <button 
                    className={`${filterButton} ${activeFilter === 'summer' ? filterActive : ''}`}
                    onClick={() => setActiveFilter('summer')}
                >
                    Mùa hè
                </button>
                <button 
                    className={`${filterButton} ${activeFilter === 'weekend' ? filterActive : ''}`}
                    onClick={() => setActiveFilter('weekend')}
                >
                    Cuối tuần
                </button>
            </div>

            {/* Danh sách mã giảm giá */}
            <div className={discountGrid}>
                {filteredDiscounts.map(discount => (
                    <div key={discount.id} className={discountCard}>
                        <div className={discountImage}>
                            <img src={discount.image} alt={discount.title} />
                            {!discount.isActive || isExpired(discount.expiryDate) ? (
                                <div className={expiredBadge}>Hết hạn</div>
                            ) : (
                                <div className={activeBadge}>Đang áp dụng</div>
                            )}
                        </div>
                        
                        <div className={discountInfo}>
                            <h3 className={discountTitle}>{discount.title}</h3>
                            <p className={discountDes}>{discount.description}</p>
                            
                            <div className={discountCode}>
                                Mã: <strong>{discount.code}</strong>
                            </div>
                            
                            <div className={discountValue}>
                                Giảm giá: <span>{discount.value}</span>
                            </div>
                            
                            <div className={discountExpiry}>
                                HSD: {formatDate(discount.expiryDate)}
                            </div>
                            
                            <div style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
                                Đơn tối thiểu: {formatCurrency(discount.minOrder)}
                            </div>

                            <Link 
                                to={`/discount/${discount.id}`}
                                className={viewButton}
                            >
                                Xem chi tiết & Sử dụng ngay
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscountList;

