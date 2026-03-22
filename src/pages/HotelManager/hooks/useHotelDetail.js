import { hotelDetail } from "../Mock/hotelDetailData";

export const useHotelDetail = () => {
    console.log(hotelDetail);

  return {
    hotel: hotelDetail
  };
};