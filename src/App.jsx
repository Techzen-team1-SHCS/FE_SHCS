import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import './App.css'
import HotelList from './pages/HotelList/HotelList';
import MainLayout from './layouts/MainLayout/MainLayout';
import About from './pages/About/About';
import Destination1 from './pages/Destination1/Destination1';
import ContactUs from './pages/ContactUs/ContactUs';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import BlogList from './pages/BlogList/BlogList';
import HotelDetail from './pages/HotelDetail/HotelDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { BehaviorProvider } from './contexts/BehaviorContext';
import HotelsRecommend from './pages/HotelsRecommend/HotelsRecommend';
import Booking from './pages/Booking/Booking';
import PaymentResult from './pages/PaymentResult/PaymentResult';
import ManageBooking from './pages/ManageBooking/ManageBooking';
// import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <BehaviorProvider>
      <Router>
        <Routes>
          {/* Routes có dùng MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/HotelList" element={<HotelList />} />
            <Route path="/About" element={<About />} />
            <Route path="/Destination1" element={<Destination1 />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path='*' element={<NotFoundPage />}></Route>
            <Route path='/BlogList' element={<BlogList />}></Route>
            <Route path='/hotel/:hotelId' element={<HotelDetail />}></Route>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/HotelsRecommend' element={<HotelsRecommend />}></Route>
            <Route path='/booking/:bookingId' element={<Booking />}></Route>
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/my-bookings" element={<ManageBooking/>}/>
            {/* có thể thêm các page khác cần layout */}
          </Route>

          {/* Route KHÔNG dùng MainLayout */}
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
  )
}

export default App
