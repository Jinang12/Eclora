import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const ImageCarousel = () => {
  return (
    <div className="w-full" style={{ maxHeight: '100vh' }}>
      <Carousel className="w-full">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/img1.jpg"
            alt="Latest Fashion Trends"
            style={{ maxHeight: '100vh', objectFit: 'cover' }}
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/img2.jpg"
            alt="Affordable and Stylish"
            style={{ maxHeight: '100vh', objectFit: 'cover' }}
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/img3.jpg"
            alt="Shop the Best Deals"
            style={{ maxHeight: '100vh', objectFit: 'cover' }}
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
