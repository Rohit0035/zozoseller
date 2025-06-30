// WidgetsGeneral.jsx
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const WidgetsGeneral = () => {
  const slides = [
    'https://picsum.photos/seed/1/1200/500',
    'https://picsum.photos/seed/2/1200/500',
    'https://picsum.photos/seed/3/1200/500',
  ];

  return (
    <div className="page text-start">
      <Card>
        <CardBody>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            navigation={true}
            style={{ minHeight: '520px' }}
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

export default WidgetsGeneral;
