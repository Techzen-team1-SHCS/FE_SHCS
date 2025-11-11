import React, { useState } from 'react';
import styles from './HotelReviewsList.module.css';
import { commentService } from '../../services/commentService';
import { toast } from 'react-toastify';

const HotelReviewsList = ({ reviews, loading, hotelId, onCommentPosted }) => {
    // Tính điểm rating trung bình của tất cả bình luận gốc
    const rootReviews = (reviews || []).filter(r => !r.parent_id);
    const avgRating = rootReviews.length > 0
        ? (rootReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / rootReviews.length).toFixed(1)
        : null;
    const [replyTo, setReplyTo] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        reviewsList,
        loadingText,
        emptyState,
        reviewItem,
        reviewHeader,
        userAvatar,
        userInfo,
        userName,
        reviewDate,
        reviewRating,
        ratingStars,
        reviewComment,
        reviewICard,
        replyContainer,
        replyButton,
        commentInput,
        submitButton,
        replySection
    } = styles;
    const displayReviews = reviews && reviews.length > 0 ? reviews : [];
    if (loading) {
        return (
            <div className={reviewsList}>
                <div className={loadingText}>Đang tải đánh giá...</div>
            </div>
        );
    }

    const handleReply = (reviewId) => {
        setReplyTo(reviewId);
        setNewComment('');
    };

    const handleSubmitReply = async () => {
        if (!newComment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await commentService.postComment({
                comment: newComment.trim(),
                parent_id: replyTo,
                maHotel: hotelId
            });

            if (response.status === 201) {
                toast.success('Đã đăng bình luận thành công');
                setNewComment('');
                setReplyTo(null);
                // Notify parent component to refresh comments
                if (onCommentPosted) onCommentPosted();
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng bình luận');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderReplyForm = (parentId) => (
        <form
            className={replyContainer}
            style={{ animation: 'fadeInUp 0.3s' }}
            onSubmit={e => { e.preventDefault(); handleSubmitReply(); }}
        >
            <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Nhập phản hồi..."
                rows={2}
                style={{
                    resize: 'none',
                    fontSize: 15,
                    padding: 10,
                    borderRadius: 10,
                    border: '1.5px solid #d0d7de',
                    width: '100%',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    outline: 'none',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #007bff'}
                onBlur={e => e.target.style.border = '1.5px solid #d0d7de'}
                disabled={isSubmitting}
            />
            <div className={replySection} style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                    type="submit"
                    className={replyButton}
                    style={{
                        fontWeight: 600,
                        color: '#fff',
                        background: 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)',
                        border: 'none',
                        borderRadius: 20,
                        padding: '7px 24px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px 0 rgba(0,123,255,0.10)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        opacity: isSubmitting || !newComment.trim() ? 0.6 : 1,
                    }}
                    disabled={isSubmitting || !newComment.trim()}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{ display: 'inline-block', transition: 'transform 0.2s' }}>{isSubmitting ? 'Đang gửi...' : 'Gửi'}</span>
                </button>
                <button
                    type="button"
                    className={replyButton}
                    style={{
                        fontWeight: 600,
                        color: '#007bff',
                        background: '#f4f8fb',
                        border: '1.5px solid #d0d7de',
                        borderRadius: 20,
                        padding: '7px 24px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s, color 0.2s, transform 0.15s',
                        opacity: isSubmitting ? 0.6 : 1,
                    }}
                    onClick={() => setReplyTo(null)}
                    disabled={isSubmitting}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseOver={e => {
                        e.currentTarget.style.background = '#e6f0fa';
                        e.currentTarget.style.color = '#0056b3';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = '#f4f8fb';
                        e.currentTarget.style.color = '#007bff';
                    }}
                >
                    <span style={{ display: 'inline-block', transition: 'transform 0.2s' }}>Hủy</span>
                </button>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </form>
    );

    // Đệ quy render bình luận và replies
    const renderComments = (comments, level = 0) => {
        if (!comments || comments.length === 0) return null;
        return (
            <div style={{ marginLeft: level * 32 }}>
                {comments.map((comment) => (
                    <div className={reviewICard} key={comment.id} style={{ marginBottom: 16, background: level === 0 ? '#fff' : '#f8f9fa', borderLeft: level > 0 ? '3px solid #e0e0e0' : 'none', position: 'relative' }}>
                        <div className={reviewItem}>
                            <div className={reviewHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        src={comment.userAvatar || '/assets/images/avatar/avatar_default.png'}
                                        alt={comment.userName}
                                        className={userAvatar}
                                    />
                                    <div className={userInfo}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span className={userName}>{comment.userName}</span>
                                            {/* Hiện rating ở bình luận gốc */}
                                            {(!comment.parent_id || comment.parent_id === null) && comment.rating && (
                                                <span style={{ color: '#ffc107', fontSize: 18, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span key={i}>
                                                            {i < comment.rating ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </div>
                                        <div className={reviewDate}>
                                            {comment.time ? new Date(comment.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                                        </div>
                                    </div>
                                </div>
                                {/* Nút Sửa/Xóa luôn hiển thị cho mọi bình luận */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#007bff',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            transition: 'background 0.2s',
                                        }}
                                        onClick={() => {/* TODO: handleEdit(comment) */}}
                                        title="Sửa bình luận"
                                        onMouseOver={e => e.currentTarget.style.background = '#e6f0fa'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#dc3545',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            transition: 'background 0.2s',
                                        }}
                                        onClick={() => {/* TODO: handleDelete(comment) */}}
                                        title="Xóa bình luận"
                                        onMouseOver={e => e.currentTarget.style.background = '#fae6e6'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                            <div className={reviewComment} style={{ fontSize: 16, marginBottom: 8 }}>{comment.comment}</div>
                            {/* Reply button */}
                            {replyTo === comment.id ? (
                                renderReplyForm(comment.id)
                            ) : (
                                <button
                                    className={replyButton}
                                    style={{ fontSize: 14, padding: '4px 12px', marginBottom: 4 }}
                                    onClick={() => handleReply(comment.id)}
                                >
                                    Phản hồi
                                </button>
                            )}
                            {/* Đệ quy hiển thị replies */}
                            {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={reviewsList}>
            {/* Hiển thị điểm rating tổng hợp */}
            {avgRating && (
                <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>Điểm trung bình:</span>
                    <span style={{ color: '#ffc107', fontSize: 22, fontWeight: 700 }}>{avgRating}</span>
                    <span style={{ color: '#ffc107', fontSize: 20 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.round(avgRating) ? '★' : '☆'}</span>
                        ))}
                    </span>
                    <span style={{ color: '#666', fontSize: 15 }}>({rootReviews.length} đánh giá)</span>
                </div>
            )}
            {displayReviews.length > 0 ? (
                <div className="reviews-container">
                    {renderComments(displayReviews)}
                </div>
            ) : (
                <div className={emptyState}>
                    <h4>Chưa có đánh giá nào</h4>
                    <p>Hãy là người đầu tiên đánh giá khách sạn này!</p>
                </div>
            )}
        </div>
    );
};

export default HotelReviewsList;