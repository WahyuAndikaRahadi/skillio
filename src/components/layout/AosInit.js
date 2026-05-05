"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        duration: 800,
        once: false,
        easing: "ease-in-out",
        offset: 100,
        delay: 50,
      });
      
      setTimeout(() => {
        AOS.refresh();
      }, 500);
    };

    setTimeout(initAOS, 100);

    window.addEventListener('load', AOS.refresh);
    window.addEventListener('preloader-finished', AOS.refresh);
    
    return () => {
      window.removeEventListener('load', AOS.refresh);
      window.removeEventListener('preloader-finished', AOS.refresh);
    };
  }, []);

  return null;
}
