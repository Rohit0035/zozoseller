

// WidgetsGeneral.jsx
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import HomeBanner from '../assets/images/common/home-banner.png'
import HomeBanner2 from '../assets/images/common/home-baner-2.png'


const SimpleSwiper = () => {
  const slides = [
    HomeBanner,
    HomeBanner2,
    HomeBanner,
  ];

  return (
    <div className="page text-start ">
      <Card className=' border-0'>
        <CardBody>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation={true}
            // style={{ minHeight: '520px' }}
          >
            {slides.map((src, index) => (
              <SwiperSlide key={index}>
                <img src={src} alt={`Slide ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </CardBody>
      </Card>
    </div>
  );
};

export default SimpleSwiper;

