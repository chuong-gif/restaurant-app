// packages/web-client/src/pages/Home.tsx

import React from 'react';

// Import các component con của trang chủ
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import AboutSection from '../components/home/AboutSection';
import NewProductsSection from '../components/home/NewProductsSection';

const Home: React.FC = () => {
    // Tất cả giao diện phải nằm trong lệnh return của component
    return (
        <div>
            <HeroSection />
            <ServicesSection />
            <AboutSection />
            <NewProductsSection />
        </div>
    );
};

export default Home;