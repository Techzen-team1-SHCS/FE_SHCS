import styles from '../HotelManage.module.css';
import PartLoading from '../../../../components/Loading/PartLoading';
import {
    formatCurrency,
    formatDate,
    getRoomStats,
    getStatusText,
    getStarText,
    getStarValue,
    getStatusClass
} from '../Helpers/hotelHelpers';
import StarRating from '../Component/StarRating/StarRating';
import { useHotels } from '../Hooks/useHotels';
import { useHotelActions } from '../Hooks/useHotelActions';
import HotelTable from '../Component/HotelTable/HotelTable';
import Pagination from '../Component/Pagination/Pagination';
import HotelSidebar from '../Component/HotelSidebar/HotelSidebar';
const HotelManage = () => {
    const {
        container,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        deleteButton,
        buttonGroup,
        buttonIcon,
        statusBadge,
        statusAvailable,
        statusOccupied,
        hotelImage,
        imageContainer,
        hotelInfo,
        hotelName,
        hotelLocation,
        statsContainer,
        statItem,
        statValue,
        statLabel,
        sidebar,
        sidebarOpen,
        sidebarOverlay,
        sidebarHeader,
        sidebarTitle,
        closeButton,
        sidebarContent,
        image2Container,
        detailSection,
        detailTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,
        amenitiesList,
        amenityItem,
        textContent,
        timestamp,
        // Thêm các style mới cho form
        formContainer,
        formGroup,
        formLabel,
        formControl,
        formTextarea,
        formActions,
        btnPrimary,
        btnSecondary,
        btnDanger,
        editMode,
        viewMode
    } = styles;
    const {
        hotelsData,
        loading,
        currentPage,
        paginationData,
        handlePageChange,
        fetchHotels
    } = useHotels();

    const {
        selectedHotel,
        isSidebarOpen,
        isEditMode,
        editForm,
        newAmenity,
        setNewAmenity,
        handleView,
        handleEdit,
        handleDelete,
        handleUpdate,
        handleInputChange,
        handleAddAmenity,
        handleRemoveAmenity,
        handleCloseSidebar,
        setIsEditMode
    } = useHotelActions(fetchHotels, currentPage);
    // ========== PAGINATION LOGIC ==========
    // Use pagination data from API
    const totalPages = paginationData.last_page || 1;
    const totalResults = paginationData.total || 0;

    const amenities = Array.isArray(selectedHotel?.amenities)
        ? selectedHotel.amenities
        : (() => {
            try {
                return JSON.parse(selectedHotel?.amenities || "[]");
            } catch (e) {
                return [];
            }
        })();

    // Handle Cancel Edit
    const handleCancelEdit = () => {
        setIsEditMode(false);
    };
    if (loading) {
        return <div className='mt-40'><PartLoading /></div>;
    }
    return (
        <div className={container}>
            <div className={tableContainer}>
                <HotelTable
                    hotelsData={hotelsData}
                    loading={loading}
                    styles={styles}
                    handleView={handleView}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    getStatusClass={getStatusClass}
                    getStatusText={getStatusText}
                    getStarValue={getStarValue}
                    getStarText={getStarText}
                    formatCurrency={formatCurrency}
                />

                <Pagination
                    paginationData={paginationData}
                    totalResults={totalResults}
                    loading={loading}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* Sidebar chi tiết */}
            {isSidebarOpen && selectedHotel && (
                <>
                    <div
                        className={sidebarOverlay}
                        onClick={handleCloseSidebar}
                    />
                    <HotelSidebar
                        state={{
                            isSidebarOpen,
                            isEditMode,
                            selectedHotel,
                            amenities,
                            editForm,
                            newAmenity
                        }}

                        actions={{
                            handleCloseSidebar,
                            handleInputChange,
                            handleAddAmenity,
                            handleRemoveAmenity,
                            handleCancelEdit,
                            handleUpdate,
                            handleDelete,
                            setNewAmenity,
                            setIsEditMode
                        }}

                        utils={{
                            formatCurrency,
                            formatDate,
                            getRoomStats,
                            getStatusText,
                            getStatusClass,
                            getStarValue,
                            getStarText
                        }}

                        components={{
                            StarRating
                        }}

                        
                    />
                </>
            )}
        </div>
    );
};

export default HotelManage;