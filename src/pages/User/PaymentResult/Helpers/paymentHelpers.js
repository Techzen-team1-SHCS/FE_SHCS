export const parsePaymentResult = (search) => {
    const queryParams = new URLSearchParams(search);

    const status = queryParams.get("status");
    const transactionId = queryParams.get("transactionId");
    const bookingId = queryParams.get("bookingId");

    if (status === "success") {
        return {
            success: true,
            message: "Thanh toán thành công!",
            transactionId,
            bookingId
        };
    }

    return {
        success: false,
        message: "Thanh toán thất bại. Vui lòng thử lại.",
        transactionId,
        bookingId
    };
};