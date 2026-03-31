import styles from "../../Booking.module.css";
import { formatDateTime, getCancelPolicy } from "../../../../../utils/dateUtils";

const CancelPolicyCard = ({ hotel }) => {

    const cancelPolicy = getCancelPolicy(hotel);

    if (!cancelPolicy) return null;

    return (
        <>
            <div className={styles.card}>
                <h4 className={styles.cardTitle}>Chi phí huỷ là bao nhiêu?</h4>

                {cancelPolicy.hasFreeCancel ? (
                    <>
                        <div className={styles.cancelFree}>
                            Miễn phí huỷ đến{" "}
                            <strong>
                                {formatDateTime(cancelPolicy.freeCancelDeadline)}
                            </strong>
                        </div>

                        <div className={styles.cancelFee}>
                            Sau thời điểm đó:{" "}
                            <strong>
                                {cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND
                            </strong>
                        </div>
                    </>
                ) : (
                    <div className={styles.cancelFee}>
                        <span>{cancelPolicy.message}</span>
                        <br />
                        <strong>
                            Phí huỷ: {cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND
                        </strong>
                    </div>
                )}
            </div>
            {/* Điều kiện */}
            <div className={styles.card}>
                <h4 className={styles.cardTitle}>Xem lại điều kiện đặt phòng</h4>
                <div className={styles.subTitle}>Ưu Đãi Từ Đối Tác</div>

                <ul className={styles.list}>
                    <li>Bạn sẽ thanh toán bảo mật hôm nay với SHCS.com</li>
                    <li>Các thay đổi liên quan đến thông tin cá nhân hay thông tin đặt phòng đều không khả thi sau khi đặt phòng đã hoàn tất</li>
                    <li>Công ty đối tác của chúng tôi sẽ là bên xuất hoá đơn</li>
                </ul>
            </div>
        </>
    );
};

export default CancelPolicyCard;