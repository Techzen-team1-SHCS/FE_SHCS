import styles from '../SettingPage.module.css';

const SettingsSection = ({
    settings,
    setSettings,
    isEditing,
    setIsEditing,
    maintenanceMode,
    handleToggleMaintenance,
    handleSaveSettings
}) => {
    return (
        <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>⚙️ Cài đặt chung</h2>
                {!isEditing && (
                    <button
                        className={styles.editButton}
                        onClick={() => setIsEditing(true)}
                    >
                        ✏️ Chỉnh sửa
                    </button>
                )}
            </div>

            <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tên website:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email hỗ trợ:</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại:</label>
                    <input
                        type="tel"
                        className={styles.input}
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Kích thước upload tối đa (MB):</label>
                    <input
                        type="number"
                        className={styles.input}
                        value={settings.maxUploadSize}
                        onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                        disabled={!isEditing}
                        min="1"
                        max="100"
                    />
                </div>

                <div className={styles.formGroup} style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                    <h3 style={{ marginBottom: '15px', color: maintenanceMode ? '#d33' : '#333' }}>
                        Trạng thái hệ thống: {maintenanceMode ? 'ĐANG BẢO TRÌ' : 'HOẠT ĐỘNG BÌNH THƯỜNG'}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                        Lưu ý: Tính năng này thay đổi ngay trạng thái website. Quản trị viên (Admin) vẫn có thể truy cập hệ thống để kiểm tra trong suốt quá trình cài đặt.
                    </p>
                    <button
                        className={styles.button}
                        style={{
                            background: maintenanceMode ? '#d33' : '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                        onClick={handleToggleMaintenance}
                    >
                        {maintenanceMode ? 'Tắt Bảo Trì (Mở Lại Web)' : 'Bật Bảo Trì Hệ Thống'}
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSaveSettings}
                    >
                        💾 Lưu Thông Tin
                    </button>
                    <button
                        className={styles.cancelButton}
                        onClick={() => setIsEditing(false)}
                    >
                        ❌ Hủy
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsSection;
