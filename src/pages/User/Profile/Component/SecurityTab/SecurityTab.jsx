import React from "react";


// ---------------- Security Component ----------------

export default function SecurityTab({
  styles,
  editingField,
  startEditing,
  cancelEditing,
  saveChanges,
  formData,
  setFormData
}) {
  return (
    <div className={styles.securityContainer}>
      <div className={styles.securityHeader}>
        <h1>Security Settings</h1>
        <p>Manage your password and security preferences</p>
      </div>

      <div className={styles.securityContent}>
        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>🔐</div>

          <div className={styles.securityInfo}>
            <h3>Password</h3>
            <p>Last changed 2 days ago</p>
          </div>

          {editingField !== "password" ? (
            <button
              className={styles.securityBtn}
              onClick={() => startEditing("password")}
            >
              Change Password
            </button>
          ) : (
            <div className={styles.passwordForm}>
              <div className={styles.formField}>
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={formData.currentPassword || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value
                    })
                  }
                />
              </div>

              <div className={styles.formField}>
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPassword: e.target.value
                    })
                  }
                />
              </div>

              <div className={styles.formField}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })
                  }
                />
              </div>

              <div className={styles.formActions}>
                <button
                  className={styles.saveBtn}
                  onClick={() => saveChanges("password")}
                >
                  Update Password
                </button>

                <button className={styles.cancelBtn} onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>📱</div>

          <div className={styles.securityInfo}>
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security</p>
          </div>

          <button className={styles.securityBtn}>Enable 2FA</button>
        </div>

        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>🔔</div>

          <div className={styles.securityInfo}>
            <h3>Login Alerts</h3>
            <p>Get notified of new sign-ins</p>
          </div>

          <button className={styles.securityBtn}>Manage Alerts</button>
        </div>
      </div>
    </div>
  );
}
