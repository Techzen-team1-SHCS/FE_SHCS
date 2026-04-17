import { useState } from "react";
import styles from "./Hotel.module.css";
import { renderStars } from "../../Helpers/HotelHelpers";

export default function Reviews({ reviews = [] }) {
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (!comment.trim()) return;
    alert("Comment gửi thành công: " + comment.trim());
    setComment("");
  };

  return (
    <div className={styles.reviews}>
      <h3>Reviews</h3>
      <div className={styles.commentSection}>
        <h4>Your comment</h4>
        <div className={styles.commentForm}>
          <input
            type="text"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentInput}
          />
          <button className={styles.commentBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        reviews.map((r) => (
          <div key={r.id} className={styles.reviewItem}>
            <strong>{r.name}</strong>
            <p>{r.comment}</p>
            <span>{renderStars(r.rating)}</span>
          </div>
        ))
      ) : (
        <p>Không có đánh giá</p>
      )}
    </div>
  );
}