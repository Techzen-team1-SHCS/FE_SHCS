import styles from './DetailSidebar.module.css';

const DetailSidebar = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    type = 'default' // 'hotel', 'user', 'booking', 'default'
}) => {
    const {
        sidebarOverlay,
        sidebar,
        sidebarOpen,
        sidebarHeader,
        sidebarTitle,
        closeButton,
        sidebarContent,
        sidebarHotel,
        sidebarUser,
        sidebarBooking,
        sidebarDefault
    } = styles;

    const getSidebarTypeClass = () => {
        switch (type) {
            case 'hotel': return sidebarHotel;
            case 'user': return sidebarUser;
            case 'booking': return sidebarBooking;
            default: return sidebarDefault;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className={sidebarOverlay}
                onClick={onClose}
                aria-hidden="true"
            />
            <div className={`${sidebar} ${sidebarOpen} ${getSidebarTypeClass()}`}>
                <div className={sidebarHeader}>
                    <h2 className={sidebarTitle}>{title}</h2>
                    <button 
                        className={closeButton}
                        onClick={onClose}
                        aria-label="Đóng sidebar"
                    >
                        ×
                    </button>
                </div>
                
                <div className={sidebarContent}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default DetailSidebar;