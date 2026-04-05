import { useState } from "react";
import { ISSUE_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./MaintenanceIssuesTable.module.css";
import { FiTool, FiAlertTriangle, FiCheckCircle, FiImage } from "react-icons/fi";

const MaintenanceIssuesTable = ({
  issues,
  loadingIssues,
  issueFilters,
  setIssueFilters,
  onUpdateStatus,
  onCreateIssue,
}) => {
  const [confirmId, setConfirmId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    await onUpdateStatus(id, { issue_status: newStatus });
    setConfirmId(null);
  };

  const statusKeys = Object.keys(ISSUE_STATUS_CONFIG);

  return (
    <div className={styles.container}>
      {/* Filter tabs */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterTab} ${issueFilters.status === "" ? styles.activeTab : ""}`}
          onClick={() => setIssueFilters((p) => ({ ...p, status: "" }))}
        >
          Tất cả ({issues.length > 0 ? issues.length + "+" : 0})
        </button>
        {statusKeys.map((s) => {
          const cfg = ISSUE_STATUS_CONFIG[s];
          return (
            <button
              key={s}
              className={`${styles.filterTab} ${issueFilters.status === s ? styles.activeTab : ""}`}
              style={
                issueFilters.status === s
                  ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                  : {}
              }
              onClick={() => setIssueFilters((p) => ({ ...p, status: s }))}
            >
              {cfg.labelVi}
            </button>
          );
        })}

        <div className={styles.spacer} />
        <button className={styles.reportBtn} onClick={onCreateIssue}>
          <FiAlertTriangle size={14} /> Báo cáo sự cố mới
        </button>
      </div>

      {/* Table */}
      {loadingIssues ? (
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      ) : issues.length === 0 ? (
        <div className={styles.empty}>
          <FiCheckCircle size={32} color="#10b981" />
          <p>Không có sự cố nào{issueFilters.status ? ` (${ISSUE_STATUS_CONFIG[issueFilters.status]?.labelVi})` : ""}</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Phòng</th>
                <th>Loại phòng</th>
                <th>Mô tả sự cố</th>
                <th>Báo bởi</th>
                <th>Trạng thái</th>
                <th>Ảnh</th>
                <th>Ngày báo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, idx) => {
                const cfg = ISSUE_STATUS_CONFIG[issue.issue_status] || {};
                return (
                  <tr key={issue.id}>
                    <td className={styles.indexCell}>{idx + 1}</td>
                    <td>
                      <span className={styles.roomTag}>
                        {issue.room_number?.room_number || "—"}
                      </span>
                    </td>
                    <td>{issue.room_number?.room?.room_type || "—"}</td>
                    <td>
                      <p className={styles.description} title={issue.description}>
                        {issue.description}
                      </p>
                    </td>
                    <td>
                      <div className={styles.staffCell}>
                        {issue.reported_by?.avatar ? (
                          <img src={issue.reported_by.avatar} alt="" className={styles.staffAvatar} />
                        ) : (
                          <div className={styles.staffInitial}>
                            {issue.reported_by?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span>{issue.reported_by?.name || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.labelVi}
                      </span>
                    </td>
                    <td>
                      {issue.image_url ? (
                        <a href={issue.image_url} target="_blank" rel="noopener noreferrer">
                          <FiImage size={18} color="#3b82f6" />
                        </a>
                      ) : (
                        <span className={styles.noImage}>—</span>
                      )}
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(issue.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        {issue.issue_status === "open" && (
                          <button
                            className={styles.fixBtn}
                            onClick={() => handleStatusChange(issue.id, "fixing")}
                          >
                            <FiTool size={12} /> Bắt đầu sửa
                          </button>
                        )}
                        {issue.issue_status === "fixing" && (
                          <button
                            className={styles.resolveBtn}
                            onClick={() => handleStatusChange(issue.id, "resolved")}
                          >
                            <FiCheckCircle size={12} /> Đã xử lý
                          </button>
                        )}
                        {issue.issue_status === "resolved" && (
                          <span className={styles.resolvedTag}>✓ Xong</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaintenanceIssuesTable;
