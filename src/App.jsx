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

function App() {

  return (
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
          <Route path='/HotelDetail' element={<HotelDetail />}></Route>
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
  )
}

export default App
