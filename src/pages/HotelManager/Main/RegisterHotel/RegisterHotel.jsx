import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Step1Property from "../../Components/registerHotel/Step1Property/Step1Property"
import Step2Amenities from "../../Components/registerHotel/Step2Amenities/Step2Amenities"
import Step3Photo from "../../Components/registerHotel/Step3Photo/Step3Infor"
import styles from "./RegisterHotel.module.css"
import { hotelService } from "../../../../services/hotelService"
function RegisterHotel() {

  const [step, setStep] = useState(1)
  const navigate = useNavigate();
  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    description: '',
    price: '',
    name_nearby_place: '',
    hotel_class: '',
    styles: [],
    amenities: [],
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleNext = (partial) => setFormData(prev => ({ ...prev, ...partial }));
  const handleCreateHotel = async (partial) => {
    const merged = { ...formData, ...partial };

    // Gom dữ liệu từ Step 1 vào description (plain text, không dùng HTML)
    const addressInfo = [merged.address, merged.name_nearby_place, merged.province]
      .filter(item => item)
      .join(', ');
    const zipInfo = merged.zip ? ` (Mã ZIP: ${merged.zip})` : '';
    
    const locationText = `Địa chỉ khách sạn: ${addressInfo}${zipInfo}`;
    // Loại bỏ HTML tags từ CKEditor description nhưng giữ lại xuống dòng
    const plainDescription = (merged.description || "")
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>\s*<p>/gi, '\n')
      .replace(/<[^>]*>/g, ' ')
      .trim();

    merged.description = locationText + '\n\n' + plainDescription;

    // Loại bỏ HTML tags từ CKEditor text (Detailed Information)
    if (merged.text) {
      merged.text = merged.text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p>/gi, '\n')
        .replace(/<[^>]*>/g, ' ')
        .trim();
    }

    const { images, ...hotelPayload } = merged;

    setLoading(true);
    setError("");

    try {
      const createdHotel = await hotelService.createHotelManagerHotel(hotelPayload);

      const hotelId = createdHotel?.id || createdHotel?._id || createdHotel?.hotel_id;
      if (!hotelId) {
        throw new Error('Không tìm thấy hotelId sau khi tạo khách sạn');
      }

      if (Array.isArray(images) && images.length > 0) {
        const imageFiles = images
          .filter((img) => img?.file)
          .map((img) => img.file);

        if (imageFiles.length > 0) {
          await hotelService.uploadHotelImages(hotelId, imageFiles);
        }
      }

      toast.success("Tạo khách sạn thành công");
      navigate("/hotel-manager/hotel");
    } catch (e) {
      const message = e.response?.data?.message || e.message || "Lỗi tạo khách sạn";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>

      {error && (
        <div style={{ marginBottom: 12, color: "#dc3545", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: 12, color: "#007bff", fontWeight: 600 }}>
          Đang tạo khách sạn...
        </div>
      )}

      {step === 1 && <Step1Property nextStep={nextStep} setData={handleNext} data={formData} />}

      {step === 2 && (
        <Step2Amenities
          nextStep={nextStep}
          prevStep={prevStep}
          setData={handleNext}
          data={formData}
        />
      )}

      {step === 3 && (
        <Step3Photo
          prevStep={prevStep}
          data={formData} onSubmit={handleCreateHotel}
        />
      )}

    </div>
  )

}

export default RegisterHotel