"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  useEffect(() => {
    const startAOS = () => {
      AOS.init({
        duration: 800,
        once: false,
        easing: "ease-in-out",
        offset: 80,
        delay: 0,
      });
    };

    const onPreloaderDone = () => {
      setTimeout(startAOS, 50);
    };

    window.addEventListener("preloader-finished", onPreloaderDone);

    return () => {
      window.removeEventListener("preloader-finished", onPreloaderDone);
      AOS.refreshHard();
    };
  }, []);

  return null;
}
