import HotelManageMain from './Main/HotelManageMain';
import { useHotelManage } from './hooks/useHotelManage';

const HotelManage = () => {
    const hotelManageContext = useHotelManage();
    return <HotelManageMain {...hotelManageContext} />;
};

export default HotelManage;