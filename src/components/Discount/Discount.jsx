import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from "./Discount.module.css";
const Discount = () => {
    const promotions = [
        {
            id: 1,
            image: "assets/images/discount/discount-1.jpg"
        },
        {
            id: 2,
            image: "assets/images/discount/discount-2.jpg"
        },
        {
            id: 3,
            image: "assets/images/discount/discount-3.jpg"
        },
        {
            id: 4,
            image: "assets/images/discount/discount-4.jpg"
        },
        {
            id: 5,
            image: "assets/images/discount/discount-5.jpg"
        },
    ];

    const { discountCard, sectionTitle } = styles
    return (
        <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div
                            className="section-title text-white text-center counter-text-wrap mb-70"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                            data-aos-offset="50"
                        >
                            <h1 className={sectionTitle}>Discount Coupons</h1>
                            <div className="hotel-more-btn text-center mt-40">
                                <a className="theme-btn style-four" href='/discounts' style={{ cursor: "pointer" }}>
                                    <span data-hover="Explore More Discount">Explore More Discount</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hotel-swiper-container">
                    <Swiper
                        key={`swiper-${promotions.length}-${Date.now()}`} // Unique key
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.discount-prev',
                            nextEl: '.discount-next',
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={promotions.length > 1}
                        watchSlidesProgress={true}
                        observer={true}
                        observeParents={true}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 }
                        }}
                        className="hotel-swiper w-100"
                        onInit={(swiper) => {
                            console.log('Swiper initialized with slides:', swiper.slides.length);
                        }}
                    >
                        {promotions.slice(0, 5).map((promo, index) => (
                            <SwiperSlide key={`${promo.id}-${index}`} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 'auto'
                            }}
                            >
                                <div className={styles.discountCard}>
                                    <img src={promo.image} alt={`Discount ${promo.id}`} />
                                </div>

                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={styles.navWrapper}>
                        {/* PREV */}
                        <button className={`discount-prev ${styles.navBtn}`}>
                            <svg width="60" height="60" viewBox="0 0 24 24">
                                <path
                                    d="M15 18l-6-6 6-6"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* NEXT */}
                        <button className={`discount-next ${styles.navBtn}`}>
                            <svg width="60" height="60" viewBox="0 0 24 24">
                                <path
                                    d="M9 6l6 6-6 6"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Discount
