import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DiscountList.module.css';

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

    const discountData = [
        {
            id: 1,
            title: "Giảm giá mùa hè",
            code: "SUMMER2026",
            value: "20%",
            description: "Giảm 20% cho tất cả các khách sạn trong mùa hè",
            image: "assets/images/discount/discount-1.jpg",
            expiryDate: "2026-08-31",
            isActive: true,
            minOrder: 2000000,
            category: "summer"
        },
        {
            id: 2,
            title: "Ưu đãi đầu tuần",
            code: "WEEKEND15",
            value: "15%",
            description: "Giảm 15% cho đặt phòng cuối tuần",
            image: "assets/images/discount/discount-2.jpg",
            expiryDate: "2025-12-31",
            isActive: true,
            minOrder: 1500000,
            category: "weekend"
        },
        {
            id: 3,
            title: "Khách hàng thân thiết",
            code: "LOYALTY25",
            value: "30%",
            description: "Dành cho khách hàng đã từng đặt phòng",
            image: "assets/images/discount/discount-3.jpg",
            expiryDate: "2025-11-11",
            isActive: true,
            minOrder: 3000000,
            category: "summer"
        },
        {
            id: 4,
            title: "Đặt sớm giảm sâu",
            code: "EARLYBIRD30",
            value: "25%",
            description: "Giảm 30% khi đặt trước 30 ngày",
            image: "assets/images/discount/discount-4.jpg",
            expiryDate: "2026-02-01",
            isActive: true,
            minOrder: 2500000,
            category: "earlybird"
        },
        {
            id: 5,
            title: "Combo gia đình",
            code: "FAMILY20",
            value: "20%",
            description: "Ưu đãi đặc biệt cho gói gia đình",
            image: "assets/images/discount/discount-5.jpg",
            expiryDate: "2026-12-31",
            isActive: true,
            minOrder: 3500000,
            category: "family"
        }
    ];

    const filteredDiscounts = discountData.filter(discount => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'active') return discount.isActive;
        return discount.category === activeFilter;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const isExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

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