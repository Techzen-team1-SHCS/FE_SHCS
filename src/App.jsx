import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home/Main/Home';
import './App.css'
import HotelList from './pages/User/HotelList/Main/HotelList';
import MainLayout from './layouts/MainLayout/MainLayout';
import About from './pages/User/About/Main/About';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import BlogList from './pages/User/BlogList/Main/BlogList';
import HotelDetail from './pages/User/HotelDetail/Main/HotelDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/User/ResetPassword/Main/ResetPassword';
import { BehaviorProvider } from './contexts/BehaviorContext';
import HotelsRecommend from './pages/User/HotelsRecommend/Main/HotelsRecommend';
import Booking from './pages/User/Booking/Main/Booking';
import PaymentResult from './pages/User/PaymentResult/Main/PaymentResult';
import ManageBooking from './pages/User/ManageBooking/Main/ManageBooking';
import Profile from './pages/User/Profile/Main/Profile';
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import BookingManage from './pages/Admin/BookingManage/BookingManage';
import WishList from './pages/User/WishList/Main/WishList';
import Notification from './pages/Admin/Notification/Notification';
import HotelManage from './pages/Admin/HotelManage/HotelManage';
import UserManage from './pages/Admin/UserManage/UserManage';
import LoginPage from './pages/Admin/LoginPage/LoginPage';
import Help from './pages/User/Help/Main/Help';
import DiscountList from './pages/User/Discount/Main/DiscountList';
import DiscountDetail from './pages/User/Discount/Main/DiscountDetail';
import SettingPage from './pages/Admin/Setting/SettingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HotelManagerLayout from './layouts/HotelManagerLayout/HotelManagerLayout';
import Hotel from './pages/HotelManager/Main/Hotel/Hotel';
import Notifications from './pages/HotelManager/Main/Notification/Notifcation';
import Analysis from './pages/HotelManager/Main/Analysis/Analysis';
import RegisterHotel from './pages/HotelManager/Main/RegisterHotel/RegisterHotel';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BehaviorProvider>
      <Router>
        <Routes>
          {/* Routes có dùng MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/HotelList" element={<HotelList />} />
            <Route path="/About" element={<About />} />
            <Route path='*' element={<NotFoundPage />}></Route>
            <Route path='/BlogList' element={<BlogList />}></Route>
            <Route path='/hotel/:hotelId' element={<HotelDetail />}></Route>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/HotelsRecommend' element={<HotelsRecommend />}></Route>
            <Route path='/booking/:bookingId' element={<Booking />}></Route>
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/my-bookings" element={<ManageBooking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishList" element={<WishList />} />
            <Route path="/help" element={<Help />} />
            <Route path="/discounts" element={<DiscountList />} />
            <Route path="/discount/:id" element={<DiscountDetail />} />
          </Route>
          {/* Route admin */}
          <Route path='/admin/login' element={<LoginPage />} />
          <Route element={
            //<AdminPrivateRoute>
              <AdminLayout />
            //</AdminPrivateRoute>
          }>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/booking-manage" element={<BookingManage />} />
            <Route path="/admin/notification" element={<Notification />} />
            <Route path="/admin/hotels-manage" element={<HotelManage />} />
            <Route path="/admin/users-manage" element={<UserManage />} />
            <Route path="/admin/settings" element={<SettingPage />} />
          </Route>
          {/* Route hotel manager */}
          <Route element={
            //<AdminPrivateRoute>
              <HotelManagerLayout />
            //</AdminPrivateRoute>
          }>
            <Route path="/hotel-manager/hotel" element={<Hotel />} />
            <Route path="/hotel-manager/registerhotel" element={<RegisterHotel />} />
            <Route path="/hotel-manager/analysis" element={<Analysis />} />
            <Route path="/hotel-manager/notification" element={<Notifications />} />
            
          </Route>
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
  )
}

export default App
