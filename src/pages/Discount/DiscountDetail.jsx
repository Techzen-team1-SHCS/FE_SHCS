import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DiscountDetail.module.css';

const DiscountDetail = () => {
    const {
        container,
        header,
        title,
        discountDetail,
        discountHero,
        discountImage,
        discountContent,
        codeSection,
        codeDisplay,
        copyButton,
        discountInfo,
        infoGrid,
        infoItem,
        infoLabel,
        infoValue,
        actionSection,
        useButton,
        backButton,
        termsList,
        termItem,
        expiredAlert,
        activeBadge
    } = styles;

    const { id } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Dữ liệu mẫu - trong thực tế bạn sẽ fetch từ API
    const discountData = [
        {
            id: 1,
            title: "Giảm giá mùa hè",
            code: "SUMMER2024",
            value: "20%",
            description: "Giảm 20% cho tất cả các khách sạn trong mùa hè",
            detailedDescription: "Tận hưởng kỳ nghỉ mùa hè tuyệt vời với ưu đãi giảm 20% cho tất cả các khách sạn trên toàn hệ thống. Áp dụng cho mọi loại phòng và dịch vụ đi kèm.",
            image: "/assets/images/discount/discount-1.jpg",
            expiryDate: "2026-08-31",
            isActive: true, 
            minOrder: 2000000,
            maxDiscount: 1000000,
            applicableHotels: ["Tất cả khách sạn"],
            category: "summer",
            terms: [
                "Áp dụng cho tất cả các khách sạn trên hệ thống",
                "Giảm tối đa 1,000,000 VND",
                "Đơn hàng tối thiểu 2,000,000 VND",
                "Không áp dụng đồng thời với các khuyến mãi khác",
                "Áp dụng từ ngày 01/06/2024 đến 31/08/2024"
            ]
        },
        {
            id: 2,
            title: "Ưu đãi đầu tuần",
            code: "WEEKEND15",
            value: "15%",
            description: "Giảm 15% cho đặt phòng cuối tuần",
            detailedDescription: "Thư giãn cuối tuần với ưu đãi đặc biệt giảm 15% cho các đặt phòng từ thứ 6 đến chủ nhật.",
            image: "/assets/images/discount/discount-2.jpg",
            expiryDate: "2024-12-31",
            isActive: true,
            minOrder: 1500000,
            maxDiscount: 500000,
            applicableHotels: ["Tất cả khách sạn"],
            category: "weekend",
            terms: [
                "Áp dụng cho đặt phòng từ thứ 6 đến chủ nhật",
                "Giảm tối đa 500,000 VND",
                "Đơn hàng tối thiểu 1,500,000 VND",
                "Áp dụng cho check-in từ thứ 6 đến chủ nhật",
                "Có thể áp dụng với một số chương trình khuyến mãi khác"
            ]
        }
    ];
    const discount = discountData.find(item => item.id === parseInt(id));


    if (!discount) {
        return (
            <div className={container}>
                <div className={header}>
                    <h1 className={title}>Mã giảm giá không tồn tại</h1>
                    <button className={backButton} onClick={() => navigate('/discounts')}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

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

    const handleCopyCode = () => {
        navigator.clipboard.writeText(discount.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUseDiscount = () => {
        // Lưu mã giảm giá vào localStorage hoặc context
        localStorage.setItem('selectedDiscount', JSON.stringify(discount));
        // Chuyển hướng đến trang đặt phòng
        navigate('/hotelList');
    };

    return (
        <div className={container}>
            <div className={header}>
                <button className={backButton} onClick={() => navigate('/discounts')}>
                    ← Quay lại danh sách
                </button>
                <h1 className={title}>Chi tiết ưu đãi</h1>
            </div>

            <div className={discountDetail}>
                <div className={discountHero}>
                    <div className={discountImage}>
                        <img src={discount.image} alt={discount.title} onError={(e) => {
                                e.target.src = '/default-hotel.jpg'; // Fallback image
                            }}/>
                        {discount.isActive && !isExpired(discount.expiryDate) && (
                            <div className={activeBadge}>Đang áp dụng</div>
                        )}
                    </div>

                    <div className={discountContent}>
                        <h2>{discount.title}</h2>
                        <p>{discount.detailedDescription}</p>

                        <div className={codeSection}>
                            <div className={codeDisplay}>
                                <strong>{discount.code}</strong>
                                <button
                                    className={copyButton}
                                    onClick={handleCopyCode}
                                >
                                    {copied ? 'Đã sao chép!' : 'Sao chép'}
                                </button>
                            </div>
                        </div>

                        <div className={discountInfo}>
                            <div className={infoGrid}>
                                <div className={infoItem}>
                                    <div className={infoLabel}>Giá trị</div>
                                    <div className={infoValue}>{discount.value}</div>
                                </div>
                                <div className={infoItem}>
                                    <div className={infoLabel}>HSD</div>
                                    <div className={infoValue}>{formatDate(discount.expiryDate)}</div>
                                </div>
                                <div className={infoItem}>
                                    <div className={infoLabel}>Đơn tối thiểu</div>
                                    <div className={infoValue}>{formatCurrency(discount.minOrder)}</div>
                                </div>
                                <div className={infoItem}>
                                    <div className={infoLabel}>Giảm tối đa</div>
                                    <div className={infoValue}>{formatCurrency(discount.maxDiscount)}</div>
                                </div>
                            </div>
                        </div>

                        {isExpired(discount.expiryDate) && (
                            <div className={expiredAlert}>
                                Mã giảm giá đã hết hạn sử dụng
                            </div>
                        )}

                        <div className={actionSection}>
                            <button
                                className={useButton}
                                onClick={handleUseDiscount}
                                disabled={isExpired(discount.expiryDate) || !discount.isActive}
                            >
                                Sử dụng mã ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Điều khoản và điều kiện */}
                <div className={termsList}>
                    <h3>Điều khoản và điều kiện</h3>
                    {discount.terms.map((term, index) => (
                        <div key={index} className={termItem}>
                            • {term}
                        </div>
                    ))}
                </div>  
            </div>
        </div>
    );
};

export default DiscountDetail;