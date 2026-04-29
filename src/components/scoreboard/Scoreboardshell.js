"use client";

import { useRef, useEffect } from "react";

export default function ScoreboardShell({ banner, table }) {
  const bannerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const card = cardRef.current;
    if (!banner || !card) return;

    const bannerH = banner.offsetHeight;

    const onScroll = () => {
      const scrollY = window.scrollY;

      banner.style.transform = `translateY(${scrollY * 0.4}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full min-h-screen relative">
      {}
      <div
        ref={bannerRef}
        className="w-full will-change-transform"
        style={{ position: "sticky", top: 0, zIndex: 0 }}
      >
        {banner}
      </div>

      {}
      <div
        ref={cardRef}
        className="relative z-10 bg-white rounded-t-3xl"
        style={{ marginTop: "-40px" }}
      >
        {table}
      </div>
    </div>
  );
}