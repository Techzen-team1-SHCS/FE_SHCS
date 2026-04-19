import styles from '../SettingPage.module.css';
import StatsSection from '../components/StatsSection';
import SettingsSection from '../components/SettingsSection';

const SettingMain = ({
    systemStats,
    settings,
    setSettings,
    maintenanceMode,
    isEditing,
    setIsEditing,
    loading,
    handleToggleMaintenance,
    handleSaveSettings
}) => {
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Cài đặt hệ thống</h1>
                <p>Quản lý cài đặt chung và xem thống kê hệ thống</p>
            </div>

            <StatsSection loading={loading} systemStats={systemStats} />

            <SettingsSection
                settings={settings}
                setSettings={setSettings}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                maintenanceMode={maintenanceMode}
                handleToggleMaintenance={handleToggleMaintenance}
                handleSaveSettings={handleSaveSettings}
            />
        </div>
    );
};

export default SettingMain;
