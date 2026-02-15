import React, { useState, useContext } from 'react';
import styles from './HotelReviewsList.module.css';
import { commentService } from '../../services/commentService';
import { AuthContext } from '../../contexts/AuthContext'; // ← THÊM IMPORT
import { toast } from 'react-toastify';
import LoaderButton from '../Loading/LoaderButton';
import PartLoading from '../Loading/PartLoading';

const HotelReviewsList = ({ reviews = [], loading, hotelId, onCommentPosted }) => {
    const [replyTo, setReplyTo] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    // 🎯 THÊM: Lấy user từ context để có data mới nhất
    const { user: currentUser } = useContext(AuthContext);

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
        reviewComment,
        reviewICard,
        replyContainer,
        replyButton,
        replySection
    } = styles;

    // Calculate average rating from root comments
    const rootReviews = reviews.filter(r => !r.parent_id);
    const avgRating = rootReviews.length > 0
        ? (rootReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / rootReviews.length)
        : null;

    // 🎯 HÀM MỚI: Lấy avatar URL mới nhất cho comment
    const getCurrentUserAvatar = (commentUserId, commentUserAvatar) => {
        // Nếu comment thuộc về user hiện tại, dùng avatar mới nhất từ context
        if (currentUser && commentUserId === currentUser.id) {
            return currentUser.image || '/assets/images/avatar/avatar_default.png';
        }
        // Nếu không, dùng avatar từ comment data
        return commentUserAvatar || '/assets/images/avatar/avatar_default.png';
    };

    if (loading) {
        return (
            <div className={reviewsList}>
                <div className={loadingText}><PartLoading /></div>
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
            toast.success('Đã đăng bình luận thành công');
            setNewComment('');
            setReplyTo(null);
            if (onCommentPosted) onCommentPosted();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Đăng bình luận thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.comment || '');
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const handleEditSave = async (commentId) => {
        if (!editingContent.trim()) {
            toast.error('Nội dung không được rỗng');
            return;
        }
        setIsSubmitting(true);
        try {
            await commentService.updateComment(commentId, { comment: editingContent.trim() });
            toast.success('Đã cập nhật bình luận');
            setEditingCommentId(null);
            setEditingContent('');
            if (onCommentPosted) onCommentPosted();
        } catch (err) {
            console.error('Error updating comment:', err);
            toast.error(err?.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async (commentId) => {
        const ok = window.confirm('Bạn có chắc muốn xóa bình luận này?');
        if (!ok) return;
        setDeletingCommentId(commentId);
        setIsSubmitting(true);
        try {
            await commentService.deleteComment(commentId);
            toast.success('Đã xóa bình luận');
            if (onCommentPosted) onCommentPosted();
        } catch (err) {
            console.error('Error deleting comment:', err);
            toast.error(err?.response?.data?.message || 'Xóa thất bại');
        } finally {
            setIsSubmitting(false);
            setDeletingCommentId(null);
        }
    };

    const renderReplyForm = (parentId) => (
        <form className={replyContainer} onSubmit={e => { e.preventDefault(); handleSubmitReply(); }}>
            <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Nhập phản hồi..."
                rows={2}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d0d7de' }}
                disabled={isSubmitting}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" className={replyButton} disabled={isSubmitting || !newComment.trim()} style={{ padding: '6px 12px', borderRadius: 8 }}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                </button>
                <button type="button" className={replyButton} onClick={() => setReplyTo(null)} disabled={isSubmitting} style={{ padding: '6px 12px', borderRadius: 8 }}>
                    Hủy
                </button>
            </div>
        </form>
    );

    const renderComments = (comments, level = 0) => {
        if (!comments || comments.length === 0) return null;
        return (
            <div style={{ marginLeft: level * 24 }}>
                {comments.map(comment => {
                    // 🎯 LẤY AVATAR MỚI NHẤT
                    const currentAvatar = getCurrentUserAvatar(comment.userId, comment.userAvatar);

                    return (
                        <div key={comment.id} className={reviewICard} style={{ marginBottom: 12, padding: 12, background: level === 0 ? '#fff' : '#f8f9fa', borderRadius: 8 }}>
                            <div className={reviewHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {/* 🎯 SỬ DỤNG AVATAR MỚI NHẤT */}
                                    <img
                                        src={currentAvatar}
                                        alt={comment.userName}
                                        className={userAvatar}
                                        onError={(e) => {
                                            e.target.src = '/assets/images/avatar/avatar_default.png';
                                        }}
                                    />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div className={userName}>{comment.userName}</div>
                                            {(!comment.parent_id || comment.parent_id === null) && comment.rating && (
                                                <div style={{ color: '#ffc107' }}>{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < comment.rating ? '★' : '☆'}</span>)}</div>
                                            )}
                                        </div>
                                        <div className={reviewDate} style={{ fontSize: 12, color: '#666' }}>{comment.time ? new Date(comment.time).toLocaleString() : ''}</div>
                                    </div>
                                </div>

                                {/* 🎯 CHỈ HIỆN NÚT SỬA/XÓA NẾU LÀ COMMENT CỦA USER HIỆN TẠI */}
                                {currentUser && comment.userId === currentUser.id && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => handleEditClick(comment)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Sửa</button>
                                        <button onClick={() => handleDeleteClick(comment.id)} style={{
                                            background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            minWidth: '40px'
                                        }} disabled={deletingCommentId === comment.id}>{deletingCommentId === comment.id ? <LoaderButton /> : 'Xóa'}</button>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 8 }}>
                                {editingCommentId === comment.id ? (
                                    <div>
                                        <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6 }} />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                            <button onClick={() => handleEditSave(comment.id)} disabled={isSubmitting || !editingContent.trim()} style={{ padding: '6px 12px', borderRadius: 6, background: '#007bff', color: '#fff' }}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
                                            <button onClick={handleEditCancel} disabled={isSubmitting} style={{ padding: '6px 12px', borderRadius: 6 }}>Hủy</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={reviewComment} style={{ whiteSpace: 'pre-wrap' }}>{comment.comment}</div>
                                )}
                            </div>

                            <div style={{ marginTop: 8 }}>
                                {replyTo === comment.id ? renderReplyForm(comment.id) : <button className={replyButton} onClick={() => handleReply(comment.id)} style={{ padding: '6px 10px' }}>Phản hồi</button>}
                            </div>

                            {/* replies */}
                            {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={reviewsList}>
            {avgRating !== null && (
                <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 700 }}>Điểm trung bình:</div>
                    <div style={{ color: '#ffc107', fontSize: 18, fontWeight: 700 }}>{avgRating.toFixed(1)}</div>
                    <div style={{ color: '#ffc107' }}>{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < Math.round(avgRating) ? '★' : '☆'}</span>)}</div>
                    <div style={{ color: '#666' }}>({rootReviews.length} đánh giá)</div>
                </div>
            )}

            {reviews.length > 0 ? (
                <div className="reviews-container">{renderComments(reviews.filter(r => !r.parent_id))}</div>
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