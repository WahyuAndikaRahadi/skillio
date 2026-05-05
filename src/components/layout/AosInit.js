"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  useEffect(() => {
    // Delay initialization slightly to ensure all DOM elements and styles are loaded
    // and wait for potential preloader to finish
    const initAOS = () => {
      AOS.init({
        duration: 800, // Duration of the animation
        once: false, // Whether animation should happen only once - while scrolling down
        easing: "ease-in-out", // Default easing for AOS animations
        offset: 100, // Offset (in px) from the original trigger point
        delay: 50, // values from 0 to 3000, with step 50ms
      });
      
      // Refresh after a short delay to recalculate offsets in case of layout shifts
      setTimeout(() => {
        AOS.refresh();
      }, 500);
    };

    // Use setTimeout to push to the next tick
    setTimeout(initAOS, 100);

    // Refresh on window load if it hasn't fired yet
    window.addEventListener('load', AOS.refresh);
    
    return () => {
      window.removeEventListener('load', AOS.refresh);
    };
  }, []);

  return null;
}
