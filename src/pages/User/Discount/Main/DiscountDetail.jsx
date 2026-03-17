import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../DiscountDetail.module.css';
import { discounts } from '../Constants/discountData';
import { formatCurrency, formatDate, isExpired } from '../Helpers/discountUtils';

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

    const discount = discounts.find(item => item.id === parseInt(id, 10));

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

    const handleCopyCode = () => {
        navigator.clipboard.writeText(discount.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUseDiscount = () => {
        localStorage.setItem('selectedDiscount', JSON.stringify(discount));
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
                        <img
                            src={discount.image}
                            alt={discount.title}
                            onError={(e) => {
                                e.target.src = '/default-hotel.jpg';
                            }}
                        />
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

