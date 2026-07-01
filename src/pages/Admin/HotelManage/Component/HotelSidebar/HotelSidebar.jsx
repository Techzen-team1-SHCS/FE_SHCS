import styles from '../../HotelManage.module.css';
import HotelEditForm from '../HotelEditForm/HotelEditForm';
import HotelViewMode from '../HotelViewMode/HotelViewMode';
const HotelSidebar = ({ state, actions, utils }) => {
    const {
        isSidebarOpen,
        isEditMode,
        selectedHotel,
        amenities,
        editForm,
        newAmenity
    } = state;

    const {
        handleCloseSidebar,
        handleInputChange,
        handleAddAmenity,
        handleRemoveAmenity,
        handleCancelEdit,
        handleUpdate,
        handleDelete,
        setNewAmenity,
        setIsEditMode
    } = actions;

    const {
        formatCurrency,
        formatDate,
        getRoomStats,
        getStatusText,
        getStatusClass,
        getStarValue,
        getStarText
    } = utils;
    if (!isSidebarOpen || !selectedHotel) return null;
    const {
        sidebar,
        sidebarOpen,
        editMode,
        viewMode,
        sidebarHeader,
        sidebarTitle,
        closeButton,
        sidebarContent,

        formContainer,
        formGroup,
        formLabel,
        formControl,
        formTextarea,
        formActions,

        btnPrimary,
        btnSecondary,
        btnDanger,

        image2Container,
        hotelImage,

        detailSection,
        detailTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,

        textContent,

        amenitiesList,
        amenityItem,

        statusBadge,
        timestamp
    } = styles;
    return (
        <>
            <div className={`${sidebar} ${isSidebarOpen ? sidebarOpen : ''} ${isEditMode ? editMode : viewMode}`}>
                <div className={sidebarHeader}>
                    <h2 className={sidebarTitle}>
                        {isEditMode ? 'Chỉnh sửa khách sạn' : 'Chi tiết khách sạn'}
                    </h2>
                    <button
                        className={closeButton}
                        onClick={handleCloseSidebar}
                    >
                        ×
                    </button>
                </div>
                <div className={sidebarContent}>
                    {isEditMode ? (
                        // FORM CHỈNH SỬA
                        <HotelEditForm
                            editForm={editForm}
                            newAmenity={newAmenity}
                            handleInputChange={handleInputChange}
                            handleAddAmenity={handleAddAmenity}
                            handleRemoveAmenity={handleRemoveAmenity}
                            handleCancelEdit={handleCancelEdit}
                            handleUpdate={handleUpdate}
                            setNewAmenity={setNewAmenity}
                        />
                    ) : (
                        // XEM CHI TIẾT
                        <>
                            <HotelViewMode
                                selectedHotel={selectedHotel}
                                amenities={amenities}
                                setIsEditMode={setIsEditMode}
                                handleDelete={handleDelete}
                                {...utils}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default HotelSidebar;