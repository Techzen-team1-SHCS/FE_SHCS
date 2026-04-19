import styles from '../HotelManage.module.css';
import PartLoading from '../../../../components/Loading/PartLoading';
import HotelRow from '../components/HotelRow';
import HotelPagination from '../components/HotelPagination';
import HotelSidebar from '../components/HotelSidebar';

const HotelManageMain = ({
    hotelsData,
    selectedHotel,
    isSidebarOpen,
    loading,
    isEditMode,
    setIsEditMode,
    paginationData,
    editForm,
    newAmenity,
    setNewAmenity,
    handlePageChange,
    handleView,
    handleEdit,
    handleDelete,
    handleInputChange,
    handleAddAmenity,
    handleRemoveAmenity,
    handleUpdate,
    handleCancelEdit,
    handleCloseSidebar
}) => {

    if (loading) {
        return <div className='mt-40'><PartLoading /></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.th}>Khách sạn</th>
                            <th className={styles.th}>Địa điểm</th>
                            <th className={styles.th}>Thông tin</th>
                            <th className={styles.th}>Trạng thái</th>
                            <th className={styles.th}>Đánh giá</th>
                            <th className={styles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {hotelsData.length > 0 ? (
                            hotelsData.map((hotel) => (
                                <HotelRow
                                    key={hotel.id}
                                    hotel={hotel}
                                    handleView={handleView}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không có khách sạn nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <HotelPagination 
                    paginationData={paginationData}
                    handlePageChange={handlePageChange}
                    loading={loading}
                />
            </div>

            <HotelSidebar 
                isSidebarOpen={isSidebarOpen}
                isEditMode={isEditMode}
                selectedHotel={selectedHotel}
                editForm={editForm}
                newAmenity={newAmenity}
                setNewAmenity={setNewAmenity}
                handleCloseSidebar={handleCloseSidebar}
                handleInputChange={handleInputChange}
                handleAddAmenity={handleAddAmenity}
                handleRemoveAmenity={handleRemoveAmenity}
                handleUpdate={handleUpdate}
                handleCancelEdit={handleCancelEdit}
                setIsEditMode={setIsEditMode}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default HotelManageMain;
