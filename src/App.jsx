import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home/Main/Home";
import "./App.css";
import HotelList from "./pages/User/HotelList/Main/HotelList";
import MainLayout from "./layouts/MainLayout/MainLayout";
import About from "./pages/User/About/Main/About";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import BlogList from "./pages/User/BlogList/Main/BlogList";
import HotelDetail from "./pages/User/HotelDetail/Main/HotelDetail";
import HotelManagerHotelDetail from "./pages/HotelManager/Main/Hotel/HotelDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/User/ResetPassword/Main/ResetPassword";
import { BehaviorProvider } from "./contexts/BehaviorContext";
import HotelsRecommend from "./pages/User/HotelsRecommend/Main/HotelsRecommend";
import Booking from "./pages/User/Booking/Main/Booking";
import PaymentResult from "./pages/User/PaymentResult/Main/PaymentResult";
import ManageBooking from "./pages/User/ManageBooking/Main/ManageBooking";
import Profile from "./pages/User/Profile/Main/Profile";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import BookingManage from "./pages/Admin/BookingManage/BookingManage";
import WishList from "./pages/User/WishList/Main/WishList";
import Notification from "./pages/Admin/Notification/Notification";
import HotelManage from "./pages/Admin/HotelManage/HotelManage";
import UserManage from "./pages/Admin/UserManage/UserManage";
import LoginPage from "./pages/Admin/LoginPage/LoginPage";
import Help from "./pages/User/Help/Main/Help";
import DiscountList from "./pages/User/Discount/Main/DiscountList";
import DiscountDetail from "./pages/User/Discount/Main/DiscountDetail";
import SettingPage from "./pages/Admin/Setting/SettingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HotelManagerLayout from "./layouts/HotelManagerLayout/HotelManagerLayout";
import Hotel from "./pages/HotelManager/Main/Hotel/Hotel";
import Notifications from "./pages/HotelManager/Main/Notification/Notifcation";
import Analysis from "./pages/HotelManager/Main/Analysis/Analysis";
import RegisterHotel from "./pages/HotelManager/Main/RegisterHotel/RegisterHotel";
import HotelManagerChatDashboard from "./pages/HotelManager/Main/Chat/HotelManagerChatDashboard";
import AddRoom from "./pages/HotelManager/Main/Room/AddRoom";
import EditRoom from "./pages/HotelManager/Main/Room/EditRoom";
import AuthPage from "./pages/HotelManager/Main/Auth/AuthPage";
import Register from "./pages/HotelManager/Components/Auth/Register/Register";
import RoomManagement from "./pages/HotelManager/Main/Room/RoomManagement";
import Housekeeping from "./pages/HotelManager/Main/Housekeeping/Housekeeping";
import StaffManagement from "./pages/HotelManager/Main/Staff/StaffManagement";
import RequireHotelManagerAuth from "./components/RequireHotelManagerAuth";

import Maintenance from "./pages/Maintenance/Maintenance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BehaviorProvider>
        <Router>
          <Routes>
            <Route path="/maintenance" element={<Maintenance />} />
            {/* Routes có dùng MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/HotelList" element={<HotelList />} />
              <Route path="/About" element={<About />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/BlogList" element={<BlogList />} />
              <Route path="/hotel/:hotelId" element={<HotelDetail />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/HotelsRecommend" element={<HotelsRecommend />} />
              <Route path="/booking/:bookingId" element={<Booking />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/my-bookings" element={<ManageBooking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishList" element={<WishList />} />
              <Route path="/help" element={<Help />} />
              <Route path="/discounts" element={<DiscountList />} />
              <Route path="/discount/:id" element={<DiscountDetail />} />
            </Route>

            {/* Route admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/booking-manage" element={<BookingManage />} />
              <Route path="/admin/notification" element={<Notification />} />
              <Route path="/admin/hotels-manage" element={<HotelManage />} />
              <Route path="/admin/users-manage" element={<UserManage />} />
              <Route path="/admin/settings" element={<SettingPage />} />
            </Route>

            {/* Route hotel manager — cần đăng nhập role hotel manager */}
            <Route element={<RequireHotelManagerAuth />}>
              <Route element={<HotelManagerLayout />}>
                <Route path="/hotel-manager/hotel" element={<Hotel />} />
                <Route path="/hotel-manager/rooms" element={<RoomManagement />} />
                <Route path="/hotel-manager/rooms/add" element={<AddRoom />} />
                <Route
                  path="/hotel-manager/rooms/edit/:id"
                  element={<EditRoom />}
                />
                <Route
                  path="/hotel-manager/housekeeping"
                  element={<Housekeeping />}
                />
                <Route
                  path="/hotel-manager/hotel/:id"
                  element={<HotelManagerHotelDetail />}
                />
                <Route
                  path="/hotel-manager/registerhotel"
                  element={<RegisterHotel />}
                />
                <Route path="/hotel-manager/analysis" element={<Analysis />} />
                <Route
                  path="/hotel-manager/notification"
                  element={<Notifications />}
                />
                <Route
                  path="/hotel-manager/chat"
                  element={<HotelManagerChatDashboard />}
                />
                <Route path="/hotel-manager/staff" element={<StaffManagement />} />
              </Route>
            </Route>

            <Route path="/hotel-manager/login" element={<AuthPage />} />
            <Route path="/hotel-manager/register" element={<Register />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </BehaviorProvider>
    </QueryClientProvider>
  );
}

export default App;
