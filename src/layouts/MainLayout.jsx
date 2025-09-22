import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import initScripts from '../utils/initScripts';
import { Outlet } from 'react-router-dom';
const MainLayout = ({ children }) => {
    useEffect(() => {
        // Initialize scripts after component mounts
        const timer = setTimeout(() => {
            initScripts();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout; 