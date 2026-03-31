import api from './api';
export const discountService={
    async applyDiscount(bookingId, discount_code) {
    const response = await api.post(`auth/booking/${bookingId}/apply-discount`, {
        discount_code
    });
    return response.data;
}

}