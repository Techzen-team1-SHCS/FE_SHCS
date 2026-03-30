// components/Payment/VNPayPayment.jsx
import { useState } from 'react';
import axios from 'axios';
import styles from './Payment.module.css';
const PaymentButton = ({ amount, bookingInfo }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!phoneNumber.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    if (!password.trim()) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }

    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      // TRƯỚC TIÊN: XÁC THỰC PASSWORD
      const authResponse = await axios.post(import.meta.env.VITE_API_URL + '/payment/authenticate', {
        phoneNumber: phoneNumber,
        password: password
      });

      if (authResponse.data.success) {
        // NẾU PASSWORD ĐÚNG: GỬI OTP
        const otpResponse = await axios.post(import.meta.env.VITE_API_URL + '/payment/send-otp', {
          phoneNumber: phoneNumber,
        });

        if (otpResponse.data.success) {
          setShowOTPModal(true);
        } else {
          //setShowOTPModal(true);
          alert('Gửi OTP thất bại: ' + otpResponse.data.message);
        }
      } else {
        alert('Sai mật khẩu hoặc số điện thoại không tồn tại');
      }
    } catch (error) {
      setShowOTPModal(true);
      console.error('Authentication error:', error);
      alert('Lỗi xác thực: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setPhoneNumber('');
    setPassword('');
    setOtp('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };
  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    resetForm();
  };
  const handleOTPChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số và tối đa 6 ký tự
    if (/^[0-9]{0,6}$/.test(value)) {
      setOtp(value);
    }
  };
  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Gọi API xác thực OTP
      handleCompletePayment(otp);
    } else {
      alert('Vui lòng nhập đủ 6 số OTP');
    }
  };
  const handleCompletePayment = async (otpCode) => {
    setLoading(true);
    try {
      const payload = {
        amount: amount,
        orderInfo: `Thanh toán booking ${bookingInfo?.hotelName || 'Khách sạn'}`,
        phoneNumber: phoneNumber,
        otp: otpCode
      };
      const response = await axios.post(import.meta.env.VITE_API_URL + '/payment/verify-otp', payload);

      if (response.data.success) {
        alert('Thanh toán thành công!');
        setShowOTPModal(false);
        setShowModal(false);
        resetForm();
      }
      if (bookingInfo.onSuccess) {
        bookingInfo.onSuccess();
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.buttonContainer}>
      {/* Nút mở modal */}
      {!showModal && (
        <button
          className={styles.paymentButton}
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          <div className='d-flex'>
            {loading ? 'Đang xử lý...' : 'Ứng dụng hỗ trợ thanh toán'}
            <div className={styles.paymentImg}><img src="/assets/images/logos/vnpay-logo4.png?url" alt="vnpay"></img></div>
          </div>
          <div className={styles.paymentImg}><img src='/assets/images/logos/vnpay-logo3.png?url'></img></div>
        </button>
      )}

      {/* Modal thanh toán */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h3>Ứng dụng hỗ trợ thanh toán VNPAY[QR]</h3>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
                disabled={loading}
              >
                ×
              </button>
            </div>

            {/* QR Code Section */}
            <div className={styles.qrSection}>
              <div className={styles.qrHeader}>
                <span className={styles.qrTitle}>VNPAY[QR]</span>
              </div>

              <div className={styles.qrContainer}>
                {/* Form nhập thông tin */}
                <p>
                  Thanh toán qua ví điện tử VnMart
                </p>
                <form onSubmit={handleSubmit} className={styles.paymentForm}>
                  <div className={styles.formGroup}>
                    <input
                      id="phone"
                      type="tel"
                      className={styles.formInput}
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <input
                      id="password"
                      type="password"
                      className={styles.formInput}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.payButton}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Xác thực'}
                  </button>
                </form>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            </div>

            {/* Thông tin đơn hàng */}
            {/* <div className={styles.orderInfo}>
              <h4>Thông tin đơn hàng</h4>
              <div className={styles.orderDetails}>
                <div className={styles.orderRow}>
                  <span>Khách sạn:</span>
                  <strong>{bookingInfo?.hotelName || 'N/A'}</strong>
                </div>
                <div className={styles.orderRow}>
                  <span>Số tiền:</span>
                  <strong>{amount?.toLocaleString('vi-VN')} VND</strong>
                </div>
                {bookingInfo?.customerName && (
                  <div className={styles.orderRow}>
                    <span>Khách hàng:</span>
                    <strong>{bookingInfo.customerName}</strong>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      )}
      {showOTPModal && (
        <div>
          <div className={styles.modalOTPOverlay}>
            <div className={styles.modalOTPContent}>
              <button
                className={styles.closeButton}
                onClick={handleCloseOTPModal}
                disabled={loading}
              >
                ×
              </button>
              <div className={styles.modalOTPHeader}>Xác thực OTP</div>
              <div className={styles.modalOTPSubHeader}>OTP đã được gửi về số điện thoại đăng kí.Quý khách vui lòng nhập OTP để tiếp tục thực hiện giao dịch</div>
              <form onSubmit={handleOTPSubmit} className={styles.otpForm}>
                <div className={styles.otpContainer}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    value={otp}
                    onChange={handleOTPChange}
                    className={styles.otpInputSingle}
                    placeholder="Nhập mã OTP"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <div className={styles.otpButtons}>
                  <button
                    type="submit"
                    className={styles.otpSubmitButton}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                  </button>
                  <button
                    type="button"
                    className={styles.otpCancelButton}
                    onClick={() => setShowOTPModal(false)}
                    disabled={loading}
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;