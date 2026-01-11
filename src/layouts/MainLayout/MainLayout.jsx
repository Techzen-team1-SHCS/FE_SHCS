import React, { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import initScripts from '../../utils/initScripts';
import { Outlet, useLocation } from 'react-router-dom'; // 👈 thêm useLocation
import ChatWidget from '../../components/ChatAI/ChatWidget';

const MainLayout = () => {
  const location = useLocation(); // 👈 lấy location từ React Router

  useEffect(() => {
    const timer = setTimeout(() => {
      initScripts();
    }, 100);

    return () => clearTimeout(timer);
  }, [location]); // 👈 optional: chạy lại script mỗi khi route đổi

  const hideHeader = location.pathname === '/profile'; // 👈 location đúng của React Router

  return (
    <>
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget></ChatWidget>
    </>
  );
};

export default MainLayout;
