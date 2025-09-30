import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import './App.css'
import AuthPage from './pages/AuthPage/AuthPage';
import HotelList from './pages/HotelList/HotelList';
import MainLayout from './layouts/MainLayout/MainLayout';

function App() {

  return (
    <Router>
      <Routes>
        {/* Routes có dùng MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/HotelList" element={<HotelList />} />
          {/* có thể thêm các page khác cần layout */}
        </Route>

        {/* Route KHÔNG dùng MainLayout */}
        <Route path="/AuthPage" element={<AuthPage />} />
      </Routes>
      <div>test cd</div>
    </Router>
  )
}

export default App
