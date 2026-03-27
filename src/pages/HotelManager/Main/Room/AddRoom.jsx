import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AddRoomForm from "../../Components/RoomManagement/AddRoomForm";
import { useAddRoom } from "../../hooks/useAddRoom";
import styles from "./AddRoom.module.css";

const AddRoom = () => {
  const navigate = useNavigate();
  const {
    form,
    errors,
    successMessage,
    roomAmenities,
    roomAccessibility,
    handleInputChange,
    toggleCheckbox,
    handleSubmit,
    handleUpload,
    removeImage,
  } = useAddRoom();

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
        successMessage={successMessage}
        roomAmenities={roomAmenities}
        roomAccessibility={roomAccessibility}
        handleInputChange={handleInputChange}
        handleUpload={handleUpload}
        removeImage={removeImage}
        toggleCheckbox={toggleCheckbox}
        handleSubmit={handleSubmit}
        onCancel={() => navigate("/hotel-manager/rooms")}
      />
    </div>
  );
};

export default AddRoom;
