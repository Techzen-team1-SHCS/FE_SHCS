import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AddRoomForm from "../../Components/RoomManagement/AddRoomForm";
import RoomNumberModal from "../../Components/RoomManagement/RoomNumberModal";
import { useAddRoom } from "../../hooks/useAddRoom";
import styles from "./AddRoom.module.css";

const AddRoom = () => {
  const navigate = useNavigate();
  const {
    form,
    errors,
    loading,
    hotels,
    hotelsLoading,
    showRoomNumberModal,
    createdRoom,
    roomAmenities,
    handleInputChange,
    toggleCheckbox,
    handleSubmit,
    handleCreateRoomNumbers,
    closeModal,
  } = useAddRoom();

  const handleGenerateSuccess = async (quantity) => {
    const success = await handleCreateRoomNumbers(quantity);
    if (success) {
      navigate("/hotel-manager/rooms");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/hotel-manager/rooms")}
          title="Back to Room Management"
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className={styles.title}>Add a new room</h2>
      </div>

      <AddRoomForm
        form={form}
        errors={errors}
        loading={loading}
        hotels={hotels}
        hotelsLoading={hotelsLoading}
        roomAmenities={roomAmenities}
        handleInputChange={handleInputChange}
        toggleCheckbox={toggleCheckbox}
        handleSubmit={handleSubmit}
        onCancel={() => navigate("/hotel-manager/rooms")}
      />

      {showRoomNumberModal && (
        <RoomNumberModal
          room={createdRoom}
          onGenerate={handleGenerateSuccess}
          onClose={() => {
            closeModal();
            navigate("/hotel-manager/rooms");
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AddRoom;
