import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import styles from "./BookingInfo.module.css";
import PaymentButtonVnPay from "../../../../../components/Payment/PaymentButtonVnPay";
import PartLoading from "../../../../../components/Loading/PartLoading";
import { useAmenities } from "../../Hooks/useAmenities";
import { useBookingForm } from "../../Hooks/useBookingForm";
import { useDiscount } from "../../Hooks/useDiscount";
const BookingInfo = ({
  hotelData,
  onBookingSubmit,
  onBackToForm,
  onPriceChange,
}) => {
  const { services, loading } = useAmenities(hotelData);

  const { formData, handleInputChange } = useBookingForm(
    hotelData?.discount_code,
  );

  const {
    finalPrice,
    discountAmount,
    appliedCoupon,
    discountError,
    isApplying,
    applyDiscount,
  } = useDiscount(hotelData, onPriceChange);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // QR Code States
  const [qrData, setQrData] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrError, setQrError] = useState("");
  const {
    container,
    section,
    sectionTitle,
    serviceContainer,
    serviceItem,
    serviceName,
    divider,
    noServices,
    reviewSection,
    taxSection,
    taxItem,
    paymentSection,
    buttonGroup,
    formSection,
    formRow,
    formGroup,
    formStyle,
    required,
    inputGroup,
    label,
    textArea,
    editButton,
    submitButton,
    infoGrid,
    infoItem,
    infoLabel,
    infoValue,
    priceSummary,
    originalPrice,
    discountText,
    finalPriceText,
    paymentAmount,
    discountSuccess,
  } = styles;
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onBookingSubmit) {
      onBookingSubmit(formData);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    if (onBackToForm) {
      onBackToForm();
    }
  };

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    setQrError("");
    try {
      const response = await api.post("auth/booking/generate-qr", {
        booking_id: hotelData?.id,
      });
      if (response.data && response.data.data && response.data.data.qrDataURL) {
        setQrData({
          qrDataURL: response.data.data.qrDataURL,
          ...response.data.payment_info,
        });
      } else {
        setQrError("Không thể tạo mã QR, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error generating QR:", error);
      setQrError(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo mã QR.",
      );
    } finally {
      setIsGeneratingQR(false);
    }
  };

  // Polling to detect webhook changes automatically
  useEffect(() => {
    let intervalId;
    if (qrData && hotelData?.id) {
      intervalId = setInterval(async () => {
        try {
          const res = await api.get(`auth/booking/${hotelData.id}`);
          const bookingInfo = res.data?.data || res.data;
          
          if (bookingInfo?.payment_status === 'paid' || bookingInfo?.status === 'completed') {
            clearInterval(intervalId);
            window.location.href = `/payment-result?status=success&transactionId=BANK_TRANSFER&bookingId=${hotelData.id}`;
          }
        } catch (error) {
          console.error("Error polling booking status:", error);
        }
      }, 4000); // Poll every 4 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrData, hotelData?.id]);

  // FIX: Tính toán giá hiển thị
  const displayOriginalPrice = Number(hotelData?.total_price || 0);
  const displayDiscountAmount = Number(discountAmount || 0);
  const displayFinalPrice = Number(finalPrice || displayOriginalPrice);

  if (loading) {
    return (
      <div className={container}>
        <div className={noServices}>
          <PartLoading />
        </div>
      </div>
    );
  }

  return (
    <div className={container}>
      {/* Extra Services Section */}
      <div className={section}>
        <h3 className={sectionTitle}>Dịch vụ khách sạn</h3>
        <div className={serviceContainer}>
          {services.length === 0 ? (
            <div className={noServices}>Không có dịch vụ nào</div>
          ) : (
            services.map((service) => (
              <div key={service.id} className={serviceItem}>
                <span className={serviceName}>{service.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <hr className={divider} />

      {/* Review Section */}
      {isSubmitted ? (
        <div className={reviewSection}>
          <h3 className={sectionTitle}>Thông tin đặt phòng</h3>

          <div className={infoGrid}>
            <div className={infoItem}>
              <div className={infoLabel}>Họ</div>
              <div className={infoValue}>{formData.surname || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Tên</div>
              <div className={infoValue}>{formData.name || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Email</div>
              <div className={infoValue}>{formData.email || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Số điện thoại</div>
              <div className={infoValue}>
                {formData.telephone || "Chưa nhập"}
              </div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Địa chỉ</div>
              <div className={infoValue}>{formData.address || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Thành phố</div>
              <div className={infoValue}>{formData.city || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Thời gian đến</div>
              <div className={infoValue}>{formData.arrival || "Chưa nhập"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Yêu cầu đặc biệt</div>
              <div className={infoValue}>{formData.request || "Không có"}</div>
            </div>
            <div className={infoItem}>
              <div className={infoLabel}>Mã giảm giá</div>
              <div className={infoValue}>
                {appliedCoupon || formData.coupon || "Không sử dụng"}
                {appliedCoupon && (
                  <span
                    style={{
                      color: "#51cf66",
                      marginLeft: "8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Đã áp dụng
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tax Information with Price Summary */}
          <div className={taxSection}>
            <h4 className={sectionTitle}>Chi tiết thanh toán:</h4>

            <div className={priceSummary}>
              {/* Giá gốc */}
              <div className={originalPrice}>
                <span>Giá gốc:</span>
                <span>{displayOriginalPrice.toLocaleString("vi-VN")} VND</span>
              </div>

              {/* Thuế */}
              <div className={taxItem}>
                <span>Thuế thành phố:</span>
                <span>Đã bao gồm 3$</span>
              </div>
              <div className={taxItem}>
                <span>VAT:</span>
                <span>Đã bao gồm 22%</span>
              </div>

              {/* Giảm giá nếu có */}
              {displayDiscountAmount > 0 && (
                <div className={discountText}>
                  <span>Giảm giá ({appliedCoupon}):</span>
                  <span style={{ color: "#ff6b6b", fontWeight: "bold" }}>
                    -{displayDiscountAmount.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              )}

              {/* Tổng cuối */}
              <div className={finalPriceText}>
                <span>Tổng thanh toán:</span>
                <span
                  style={{
                    color: "#51cf66",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {displayFinalPrice.toLocaleString("vi-VN")} VND
                </span>
              </div>
            </div>
          </div>

          <hr className={divider} />

          {/* Payment Options */}
          <div className={paymentSection}>
            <h4 className={sectionTitle}>Phương thức thanh toán:</h4>

            {/* Hiển thị số tiền cần thanh toán */}
            <div className={paymentAmount}>
              <span style={{ fontSize: "14px", opacity: 0.9 }}>
                Số tiền thanh toán:
              </span>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "5px",
                }}
              >
                {displayFinalPrice.toLocaleString("vi-VN")} VND
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              <PaymentButtonVnPay
                bookingId={hotelData?.id}
                amount={displayFinalPrice}
              />

              <button
                type="button"
                onClick={handleGenerateQR}
                disabled={isGeneratingQR}
                style={{
                  padding: "0 28px",
                  height: "50px",
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                  color: "#fff",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 6px rgba(0, 176, 155, 0.2)",
                  transition: "all 0.3s ease",
                  opacity: isGeneratingQR ? 0.7 : 1,
                }}
              >
                {isGeneratingQR ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "3px solid rgba(255,255,255,0.3)",
                        borderRadius: "50%",
                        borderTopColor: "#fff",
                        animation: "spin 1s ease-in-out infinite",
                      }}
                    ></div>
                    Đang tạo mã QR...
                  </>
                ) : (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H10V10H4V4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 4H20V10H14V4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 14H10V20H4V14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 14H17V17H14V14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 17H20V20H17V17Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 20H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 14V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Thanh toán bằng QR
                  </>
                )}
              </button>
            </div>

            <style>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>

            {qrError && (
              <div
                style={{
                  color: "#fa5252",
                  marginTop: "15px",
                  fontSize: "15px",
                  fontWeight: "500",
                  background: "#ffe3e3",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #fa5252",
                }}
              >
                {qrError}
              </div>
            )}

            {qrData && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "25px",
                  border: "1px solid #e9ecef",
                  borderRadius: "16px",
                  background: "#fff",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "30px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px dashed #dee2e6",
                  }}
                >
                  <img
                    src={qrData.qrDataURL}
                    alt="QR Code Thanh Toán"
                    style={{
                      width: "320px",
                      height: "320px",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <h5
                    style={{
                      margin: "0 0 15px 0",
                      fontSize: "18px",
                      color: "#343a40",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#228be6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    Thông tin chuyển khoản
                  </h5>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #e9ecef",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#868e96" }}>Ngân hàng:</span>
                      <strong style={{ color: "#495057" }}>VIETQR</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #e9ecef",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#868e96" }}>Số tài khoản:</span>
                      <strong style={{ color: "#228be6", fontSize: "16px" }}>
                        {qrData.accountNo}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #e9ecef",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#868e96" }}>Chủ tài khoản:</span>
                      <strong style={{ color: "#495057" }}>
                        {qrData.accountName}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #e9ecef",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#868e96" }}>Số tiền (VND):</span>
                      <strong style={{ color: "#e03131", fontSize: "18px" }}>
                        {Number(qrData.amount).toLocaleString("vi-VN")}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "5px",
                      }}
                    >
                      <span style={{ color: "#868e96" }}>Nội dung CK:</span>
                      <strong style={{ color: "#495057" }}>
                        {qrData.addInfo}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "15px",
                      fontSize: "13px",
                      color: "#3b5bdb",
                      background: "#edf2ff",
                      padding: "10px",
                      borderRadius: "6px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ marginTop: "2px" }}>ℹ️</span>
                    <span>
                      Mở ứng dụng ngân hàng và quét mã QR để thanh toán. Vui
                      lòng kiểm tra kỹ số tiền và nội dung chuyển khoản.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {displayDiscountAmount > 0 && (
              <div className={discountSuccess}>
                <span style={{ color: "#51cf66", fontSize: "18px" }}>✓</span>
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    Áp dụng mã giảm giá thành công!
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "4px" }}>
                    Bạn đã tiết kiệm được{" "}
                    {displayDiscountAmount.toLocaleString("vi-VN")} VND với mã
                    &quot;{appliedCoupon}&quot;
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={buttonGroup}>
            <button className={editButton} onClick={handleEdit}>
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      ) : (
        /* Form Section */
        <form className={formSection} onSubmit={handleSubmit}>
          <h3 className={sectionTitle}>Thông tin liên hệ</h3>

          <div className={formRow}>
            <div className={formGroup}>
              <label className={`${label} ${required}`}>Họ</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ của bạn"
                />
              </div>
            </div>

            <div className={formGroup}>
              <label className={`${label} ${required}`}>Tên</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên của bạn"
                />
              </div>
            </div>
          </div>

          <div className={formRow}>
            <div className={formGroup}>
              <label className={`${label} ${required}`}>Email</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className={formGroup}>
              <label className={`${label} ${required}`}>Số điện thoại</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  placeholder="0912345678"
                />
              </div>
            </div>
          </div>

          <div className={formRow}>
            <div className={formGroup}>
              <label className={label}>Địa chỉ</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Số nhà, đường, phường..."
                />
              </div>
            </div>
            <div className={formGroup}>
              <label className={label}>Thành phố</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Hà Nội, TP.HCM,..."
                />
              </div>
            </div>
          </div>

          <div className={formRow}>
            <div className={formGroup}>
              <label className={label}>Thời gian đến</label>
              <div className={inputGroup}>
                <input
                  className={formStyle}
                  type="datetime-local"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={formGroup}>
              <label className={label}>Mã giảm giá</label>
              <div className={inputGroup}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    className={formStyle}
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleInputChange}
                    placeholder="Nhập mã giảm giá"
                    style={{ flex: 1 }}
                  />

                  <button
                    type="button"
                    onClick={applyDiscount}
                    disabled={isApplying}
                    style={{
                      padding: "10px 20px",
                      background: "#007bff",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isApplying ? "Đang áp dụng..." : "Áp dụng"}
                  </button>
                </div>

                {/* Thông báo lỗi */}
                {discountError && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      padding: "5px",
                      background: "#ffeaea",
                      borderRadius: "4px",
                    }}
                  >
                    {discountError}
                  </div>
                )}

                {/* Thông báo thành công */}
                {appliedCoupon && displayDiscountAmount > 0 && (
                  <div
                    style={{
                      color: "#51cf66",
                      fontSize: "13px",
                      marginTop: "4px",
                      padding: "8px",
                      background: "#ebfbee",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      border: "1px solid #51cf66",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>✓</span>
                      <div>
                        <div>Đã áp dụng mã &quot;{appliedCoupon}&quot;</div>
                        <div style={{ fontSize: "12px", marginTop: "2px" }}>
                          Giảm {displayDiscountAmount.toLocaleString("vi-VN")}{" "}
                          VND
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hiển thị tổng giá */}
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Giá gốc:</span>
                    <span>
                      {displayOriginalPrice.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                  {displayDiscountAmount > 0 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "5px",
                          color: "#ff6b6b",
                        }}
                      >
                        <span>Giảm giá:</span>
                        <span>
                          -{displayDiscountAmount.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "5px",
                          fontWeight: "bold",
                          color: "#51cf66",
                        }}
                      >
                        <span>Tổng cần thanh toán:</span>
                        <span>
                          {displayFinalPrice.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={formRow}>
            <div className={formGroup} style={{ flex: "1 0 100%" }}>
              <label className={label}>Yêu cầu đặc biệt</label>
              <div className={inputGroup}>
                <textarea
                  className={`${formStyle} ${textArea}`}
                  placeholder="Nhập yêu cầu đặc biệt của bạn (nếu có)..."
                  name="request"
                  value={formData.request}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className={buttonGroup}>
            <button type="submit" className={submitButton}>
              Tiếp theo
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingInfo;
