import { useEffect, useState } from "react";
import { wishListService } from "../../../../services/wishListService";
import { toast } from "react-toastify";
import { filterWishlistByRating } from "../Helpers/wishlistHelpers";
import { RATING_FILTER_OPTIONS } from "../Constants/wishlistConstants";

export const useWishlist = () => {
  const [selected, setSelected] = useState(0);
  const [wishList, setWishList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishList = async () => {
    setLoading(true);
    try {
      const response = await wishListService.getWishList();
      setWishList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.error("Failed to fetch wish list:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeWishList = async (wishListId) => {
    try {
      await wishListService.deleteWishList(wishListId);

      const updated = wishList.filter((item) => item.id !== wishListId);

      setWishList(updated);
      setFilteredList(updated);

      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  useEffect(() => {
    const filtered = filterWishlistByRating(
      wishList,
      selected,
      RATING_FILTER_OPTIONS
    );
    setFilteredList(filtered);
  }, [selected, wishList]);

  return {
    selected,
    setSelected,
    wishList,
    filteredList,
    loading,
    removeWishList,
  };
};