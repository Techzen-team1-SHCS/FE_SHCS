import RenderEditField from "../renderEditField/renderEditField";
export default function ProfileContent({
    styles,
    activeTab,
    handleHeaderTabChange,
    preview,
    avatar,
    handleEditAvatar,
    formData,
    editingField,
    EditFieldActions,
    EditButton,
    loading,
    saveChanges,
    cancelEditing,
    startEditing,
    handleInputChange
}) {
    return (
        <div className={styles.profileContainer}>
            {/* Header */}
            <div className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.headerText}>
                        <h1 className={styles.headerTitle}>Profile Settings</h1>
                        <p className={styles.headerSubtitle}>Manage your personal information and preferences</p>
                    </div>
                    <div className={styles.headerActions}>

                        <div className={styles.userAvatar}>
                            <img
                                src={preview || avatar}
                                alt="avatar"
                                className={styles.avatarImg}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.headerTabs}>
                    <div
                        className={`${styles.headerTab} ${activeTab === 'profile' ? styles.activeHeaderTab : ''}`}
                        onClick={() => handleHeaderTabChange('general')}
                    >
                        <span className={styles.tabDot}></span>
                        General
                    </div>
                    <div
                        className={`${styles.headerTab} ${activeTab === 'payment' ? styles.activeHeaderTab : ''}`}
                        onClick={() => handleHeaderTabChange('balance')}
                    >
                        <span className={styles.tabDot}></span>
                        Balance
                    </div>
                    <div
                        className={`${styles.headerTab} ${activeTab === 'security' ? styles.activeHeaderTab : ''}`}
                        onClick={() => handleHeaderTabChange('security')}
                    >
                        <span className={styles.tabDot}></span>
                        Security
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className={styles.profileContent}>
                {/* Avatar Section */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarCard}>
                        <div className={styles.avatarContent}>
                            <div className={styles.avatarImageContainer}>
                                <img
                                    src={preview || avatar}
                                    alt="avatar"
                                    className={styles.avatarLarge}
                                />
                                <div className={styles.avatarOverlay} onClick={handleEditAvatar}>
                                    <span>📷</span>
                                </div>
                            </div>
                            <div className={styles.userInfo}>
                                <h2 className={styles.userName}>{formData.name}</h2>
                                <p className={styles.userEmail}>{formData.email}</p>
                                <p className={styles.userSince}>Member since 2024</p>
                            </div>
                        </div>
                        <button className={styles.editAvatarBtn} onClick={handleEditAvatar}>
                            Edit Photo
                        </button>
                    </div>
                </div>

                {/* Profile Details */}
                <div className={styles.detailsGrid}>
                    {/* Personal Information */}
                    <div className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>👤</div>
                            <h3 className={styles.sectionTitle}>Personal Information</h3>
                        </div>
                        <div className={styles.sectionContent}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Full Name</label>
                                <div className={styles.formField}>
                                    <RenderEditField
                                        field="name"
                                        label="name"
                                        editingField={editingField}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        loading={loading}
                                        styles={styles}
                                    />
                                    {editingField === 'name' ? (
                                        <EditFieldActions
                                            field="name"
                                            loading={loading}
                                            onSave={saveChanges}
                                            onCancel={cancelEditing}
                                        />
                                    ) : (
                                        <EditButton onClick={() => startEditing('name')} />
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Email Address</label>
                                <div className={styles.formField}>
                                    <RenderEditField
                                        field="email"
                                        label="email"
                                        editingField={editingField}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        loading={loading}
                                        styles={styles}
                                    />
                                    {editingField === 'email' ? (
                                        <EditFieldActions
                                            field="email"
                                            loading={loading}
                                            onSave={saveChanges}
                                            onCancel={cancelEditing}
                                        />
                                    ) : (
                                        <EditButton onClick={() => startEditing('email')} />
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Phone Number</label>
                                <div className={styles.formField}>
                                    <RenderEditField
                                        field="phone"
                                        label="phone number"
                                        editingField={editingField}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        loading={loading}
                                        styles={styles}
                                    />
                                    {editingField === 'phone' ? (
                                        <EditFieldActions
                                            field="phone"
                                            loading={loading}
                                            onSave={saveChanges}
                                            onCancel={cancelEditing}
                                        />
                                    ) : (
                                        <EditButton onClick={() => startEditing('phone')} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>📅</div>
                            <h3 className={styles.sectionTitle}>Additional Information</h3>
                        </div>
                        <div className={styles.sectionContent}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Gender</label>
                                    <div className={styles.formField}>
                                        <RenderEditField
                                            field="gender"
                                            label="gender"
                                            type="select"
                                            editingField={editingField}
                                            formData={formData}
                                            handleInputChange={handleInputChange}
                                            loading={loading}
                                            styles={styles}
                                        />                                        {editingField === 'gender' ? (
                                            <EditFieldActions
                                                field="gender"
                                                loading={loading}
                                                onSave={saveChanges}
                                                onCancel={cancelEditing}
                                            />
                                        ) : (
                                            <EditButton onClick={() => startEditing('gender')} />
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Date of Birth</label>
                                    <div className={styles.formField}>
                                        <RenderEditField
                                            field="birth"
                                            label="date of birth"
                                            type="date"
                                            editingField={editingField}
                                            formData={formData}
                                            handleInputChange={handleInputChange}
                                            loading={loading}
                                            styles={styles}
                                        />
                                        {editingField === 'birth' ? (
                                            <EditFieldActions
                                                field="birth"
                                                loading={loading}
                                                onSave={saveChanges}
                                                onCancel={cancelEditing}
                                            />
                                        ) : (
                                            <EditButton onClick={() => startEditing('birth')} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className={styles.detailSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>🏠</div>
                            <h3 className={styles.sectionTitle}>Address Information</h3>
                        </div>
                        <div className={styles.sectionContent}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Residential Address</label>
                                <div className={styles.formField}>
                                    <RenderEditField
                                        field="birth"
                                        label="date of birth"
                                        type="date"
                                        editingField={editingField}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        loading={loading}
                                        styles={styles}
                                    />
                                    {editingField === 'address' ? (
                                        <EditFieldActions
                                            field="address"
                                            loading={loading}
                                            onSave={saveChanges}
                                            onCancel={cancelEditing}
                                        />
                                    ) : (
                                        <EditButton onClick={() => startEditing('address')} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
