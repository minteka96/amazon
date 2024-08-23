import React from 'react'
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import {img} from "./img/Data";
import classes from "./carousel.module.css"
import "react-responsive-carousel/lib/styles/carousel.min.css";
function Carousel() {
  return (
    <div className={classes.hero}>
      <ResponsiveCarousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
      >
        {img.map((imageLink) => (
          <div key={imageLink} className={classes.hero_img}>
            console.log(imageLink)
            <img src={imageLink} alt="" />
          </div>
        ))}
      </ResponsiveCarousel>
    </div>
  );
}

export default Carousel;