import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import MainLayout from './layouts/MainLayout';
import AuthPage from './pages/AuthPage';
import HotelList from './pages/HotelList';

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
