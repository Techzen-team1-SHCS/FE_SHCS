export const hotelApi = {
  // Tạo URL search cho cách 3
  createSearchUrl: (searchTerm) => {
    return `/HotelList?keyword=${encodeURIComponent(searchTerm)}`;
    //return "/HotelList";
  },

  // Helper để lấy search parameter từ URL (dùng trong HotelList)
  getSearchParams: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      keyword: urlParams.get('keyword') || ''
    };
  },
}