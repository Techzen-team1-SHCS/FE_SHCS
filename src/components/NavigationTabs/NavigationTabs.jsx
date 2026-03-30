// NavigationTabs.jsx
import { useNavigate } from 'react-router-dom';
import styles from './NavigationTabs.module.css';

const NavigationTabs = ({ hotelId,currentStep = 1 }) => {
    const navigate = useNavigate();
    const activeTab = currentStep;

    const handleTabClick = (index, path) => {
        if (index < activeTab) {
            navigate(path);
        }
    };

    return (
        <div className={styles.navigationTabs}>
            <div className={styles.tabContainer}>
                {/* Tab 1 - Bạn chọn */}
                <div
                    className={`${styles.tab} ${activeTab === 0 ? styles.active : ''} ${0 < activeTab ? styles.completed : ''
                        } ${0 > activeTab ? styles.disabled : ''}`}
                    onClick={() => 0 <= activeTab && handleTabClick(0, `/hotel/${hotelId}`)}
                >
                    <span className={`${styles.tabIcon} ${activeTab === 0 ? styles.activeIcon : ''} ${0 < activeTab ? styles.completedIcon : ''}`}>
                        {0 < activeTab ? '✓' : '1'}
                    </span>
                    <div className={styles.tabContent}>
                        <span className={styles.tabText}>Bạn chọn</span>
                    </div>
                </div>
                 {/* Loader 1 */}
                <div className={`${styles.loader} ${
                    activeTab >= 0 ? styles.active : styles.disabled
                } ${activeTab === 0 ? styles.paused : ''}`}></div>
                {/* Tab 2 - Chi tiết về bạn */}
                <div
                    className={`${styles.tab} ${activeTab === 1 ? styles.active : ''} ${1 < activeTab ? styles.completed : ''
                        } ${1 > activeTab ? styles.disabled : ''}`}
                    onClick={() => 1 <= activeTab && handleTabClick(1, `/booking/${hotelId}`)}
                >
                    <span className={`${styles.tabIcon} ${activeTab === 1 ? styles.activeIcon : ''} ${1 < activeTab ? styles.completedIcon : ''}`}>
                        {1 < activeTab ? '✓' : '2'}
                    </span>
                    <div className={styles.tabContent}>
                        <span className={styles.tabText}>Chi tiết về bạn</span>
                    </div>
                </div>
                {/* Loader 2 */}
                <div className={`${styles.loader} ${
                    activeTab >= 2 ? styles.active : styles.disabled
                } ${activeTab === 2 ? styles.active : styles.paused}`}></div>
                {/* Tab 3 - Hoàn tất đặt phòng */}
                <div
                    className={`${styles.tab} ${activeTab === 2 ? styles.active : ''} ${2 < activeTab ? styles.completed : ''
                        } ${2 > activeTab ? styles.disabled : ''}`}
                    onClick={() => 2 <= activeTab && handleTabClick(2, `/booking/complete/${hotelId}`)}
                >
                    <span className={`${styles.tabIcon} ${activeTab === 2 ? styles.activeIcon : ''} ${2 < activeTab ? styles.completedIcon : ''}`}>
                        {2 < activeTab ? '✓' : '3'}
                    </span>
                    <div className={styles.tabContent}>
                        <span className={styles.tabText}>Hoàn tất đặt phòng</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationTabs;