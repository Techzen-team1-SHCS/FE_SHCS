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
            xpiryDate: "2025-12-31",
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
        },
        {
            "id": 3,
            "title": "Khách hàng thân thiết",
            "code": "LOYALTY25",
            "value": "30%",
            "description": "Dành cho khách hàng đã từng đặt phòng",
            "detailedDescription": "Tri ân khách hàng thân thiết với ưu đãi giảm 30% cho các đặt phòng trước đây của bạn. Áp dụng cho khách hàng đã từng đặt phòng ít nhất 1 lần.",
            "minOrder": 3000000,
            "maxDiscount": 1500000,
            "image": "/assets/images/discount/discount-3.jpg",
            "isActive": true,
            "expiryDate": "2025-11-11",
            "applicableHotels": ["Tất cả khách sạn"],
            "category": "loyalty",
            "terms": [
                "Áp dụng cho khách hàng đã từng đặt phòng ít nhất 1 lần",
                "Giảm tối đa 1,500,000 VND",
                "Đơn hàng tối thiểu 3,000,000 VND",
                "Không áp dụng đồng thời với các chương trình khuyến mãi khác",
                "Chỉ áp dụng cho đặt phòng trong khoảng thời gian ưu đãi"
            ]
        },
        {
            "id": 4,
            "title": "Đặt sớm giảm sâu",
            "code": "EARLYBIRD30",
            "value": "25%",
            "description": "Giảm 25% khi đặt phòng trước 30 ngày",
            "detailedDescription": "Ưu đãi đặc biệt cho khách hàng đặt phòng sớm: giảm 25% nếu đặt trước ít nhất 30 ngày so với ngày check-in.",
            "minOrder": 2500000,
            "maxDiscount": 1200000,
            "image": "/assets/images/discount/discount-4.jpg",
            "isActive": true,
            "expiryDate": "2026-02-01",
            "applicableHotels": ["Tất cả khách sạn"],
            "category": "earlybird",
            "terms": [
                "Áp dụng khi đặt phòng trước ít nhất 30 ngày",
                "Giảm tối đa 1,200,000 VND",
                "Đơn hàng tối thiểu 2,500,000 VND",
                "Không áp dụng đồng thời với các chương trình khuyến mãi khác",
                "Chỉ áp dụng cho các khách sạn tham gia chương trình"
            ],
        },
        {
            "id": 5,
            "title": "Combo gia đình",
            "code": "FAMILY20",
            "value": "20%",
            "description": "Ưu đãi đặc biệt cho gói gia đình",
            "detailedDescription": "Dành cho các gia đình: giảm 20% khi đặt các gói phòng gia đình, giúp cả nhà có kỳ nghỉ tiết kiệm và thoải mái.",
            "minOrder": 3500000,
            "maxDiscount": 800000,
            "image": "/assets/images/discount/discount-5.jpg",
            "isActive": true,
            "expiryDate": "2026-12-31",
            "applicableHotels": ["Tất cả khách sạn"],
            "category": "family",
            "terms": [
                "Áp dụng cho đặt phòng theo gói gia đình",
                "Giảm tối đa 800,000 VND",
                "Đơn hàng tối thiểu 3,500,000 VND",
                "Không áp dụng đồng thời với các chương trình khuyến mãi khác",
                "Áp dụng cho khách sạn tham gia chương trình"
            ],
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