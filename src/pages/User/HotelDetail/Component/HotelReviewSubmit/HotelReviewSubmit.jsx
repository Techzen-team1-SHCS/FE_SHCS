import React, { useState } from 'react';
import styles from './HotelReviewSubmit.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const HotelReviewSubmit = ({ hotelId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.warning('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!review.trim()) {
      toast.warning('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        hotelId,
        rating,
        comment: review.trim(),
        createdAt: new Date().toISOString()
      };

      console.log('Review data:', reviewData);

      // Gọi callback function từ parent component
      if (onReviewSubmit) {
        await onReviewSubmit(reviewData);
      }

      // Reset form sau khi gửi thành công
      setRating(0);
      setReview('');
      setHoverRating(0);

      toast.success('Đánh giá đã được gửi thành công!');

    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const {
    reviewSubmit,
    title,
    starRating,
    starBtn,
    active,
    submitBtn,
    input,
    form,
    group
  } = styles;

  const stars = [1, 2, 3, 4, 5];

  return (
    <>
      <h3
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#1a1a1a',
        }}
      >
        Đánh giá của bạn
      </h3>
      <div className={reviewSubmit}>
        <form onSubmit={handleSubmit} className={form}>
          <div className={group}>
            {/* Review Textarea */}
            <div className={input}>
              <input
                value={review}
                onChange={({ target: { value } }) => setReview(value)}
                placeholder="Share details of your own experience at this place"
              />
            </div>
            {/* Star Rating */}
          </div>
          <div className={starRating}>
            {stars.map((star) => (
              <button
                key={star}
                type="button"
                className={`${starBtn} ${star <= (hoverRating || rating) ? active : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          {/* Submit Button */}
          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </>
  );
};

export default HotelReviewSubmit;