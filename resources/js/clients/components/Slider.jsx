import React from 'react'
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderImage1 from '../image/SliderImage/Banner Design.png'
import SliderImage2 from '../image/SliderImage/Banner Design.png'
import SliderImage3 from '../image/SliderImage/Banner Design.png'
import './Slider.scss';

const Slider = () => {
    const sliderItems = [
        {
          id: 1,
          img: SliderImage1,
          title: "Mens Style",
          desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
          bg: "ffffff",
          bgimg:'linear-gradient(0deg, #ffffff 0%, #9ab2e7 100%)',

        },
        {
          id: 2,
          img: SliderImage2,
          title: "Women Style",
          desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
          bg: "fff3c3",
          bgimg:'linear-gradient(180deg, #fff3c3 0%, #ffffff 100%)',
        },
        {
          id: 3,
          img: SliderImage3,
          title: "Kids Style",
          desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
          bg: "ffffff",
          bgimg:'linear-gradient(0deg, #ffffff 0%, #94d58c 100%)',

        },
    ];

  return (
    <div className='slidecontainer'>
        <Swiper
        slidesPerView={1}
        // spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="swiper"
        >
            {sliderItems.map(item => {
                return (
                    <SwiperSlide key={item.id} className='slideimage'>
                        <img src={item.img}/>

                    </SwiperSlide>
                );
            })}

        </Swiper>

    </div>
  )
}

export default Slider
