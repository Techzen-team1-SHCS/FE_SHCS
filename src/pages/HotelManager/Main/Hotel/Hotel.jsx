import styles from "./HotelManagement.module.css";
import { HOTEL_TABS } from "../../Constants/Hotel/hotelTabs";
import { HOTEL_TABLE_COLUMNS } from "../../Constants/Hotel/hotelTableColumns";
import { useHotelManagement } from "../../hooks/useHotelManagement";
import { disableButton} from "../../Helpers/HotelHelpers";
import PartLoading from "../../../../components/Loading/PartLoading";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService } from "../../../../services/hotelService";
import Swal from "sweetalert2";
import getStatusStyles from "../../Constants/Hotel/hotelStatus";
import { formatDateTime, formatVND } from "../../../../utils/dateUtils";
import { toast } from "react-toastify";
import CustomPagination from "../../Components/CustomPagination";
export default function HotelManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteHotelMutation = useMutation({
    mutationFn: (hotelId) => hotelService.deleteHotelManagerHotel(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries(["hotel-manager-list"]);
      toast.success("xóa khách sạn thành công");
    },
    onError: () => {
      toast.error("Xóa khách sạn thất bại. Vui lòng thử lại.");
    },
  });

  const {
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    currentHotels,
    totalPages,
  } = useHotelManagement(5);

  const handleHotelRowClick = (hotel) => {
    const hotelId = hotel.id || hotel.hotelId;
    if (!hotelId) return;
    navigate(`/hotel-manager/hotel/${hotelId}`);
  };

  if (loading) {
    return (
      <div>
        <PartLoading />
      </div>
    );
  }
  const statusStyles = getStatusStyles(styles);
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {HOTEL_TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input
            placeholder="Search by room number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {HOTEL_TABLE_COLUMNS.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentHotels.map((hotel) => (
              <tr
                key={hotel.id}
                className={styles.clickableRow}
                onClick={() => handleHotelRowClick(hotel)}
              >
                <td>{hotel.name}</td>
                <td>{hotel.hotelId || hotel.id}</td>
                <td>{hotel.hotel_class || "-"}</td>
                <td>{hotel.revenue ? formatVND(hotel.revenue) : 0}</td>
                <td>{hotel.totalRooms || 0}</td>
                <td>{hotel.rooms.available_status? hotel.rooms.available_status : 'available'}</td>
                <td>{formatDateTime(hotel.created_at) || 0}</td>
                <td>
                  <div
                    className={`${styles.status} ${statusStyles[hotel.status] || ""}`}
                  >
                    {hotel.status}
                  </div>
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      Swal.fire({
                        title: "Bạn có chắc chắn?",
                        text: `Muốn xóa khách sạn "${hotel.name}" không thể hoàn tác!`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Có, xóa ngay!",
                        cancelButtonText: "Hủy",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteHotelMutation.mutate(hotel.id);
                        }
                      });
                    }}
                    disabled={
                      deleteHotelMutation.isLoading ||
                      disableButton(hotel.status)
                    }
                  >
                    {deleteHotelMutation.isLoading ? "Đang xóa..." : "Xóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
          <CustomPagination 
            count={totalPages} 
            page={currentPage} 
            onChange={(event, value) => setCurrentPage(value)} 
          />
      </div>
    </div>
  );
}
