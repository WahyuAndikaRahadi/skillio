"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 800, // Duration of the animation
      once: false, // Whether animation should happen only once - while scrolling down
      easing: "ease-in-out", // Default easing for AOS animations
      offset: 100, // Offset (in px) from the original trigger point
      delay: 50, // values from 0 to 3000, with step 50ms
    });
  }, []);

  return null;
}
