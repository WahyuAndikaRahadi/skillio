"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
}) {
  const hidden = {
    opacity: 0,
    y: direction === "up" ? 32 : direction === "down" ? -32 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    scale: direction === "zoom" ? 0.94 : 1,
  };

  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{ hidden, visible }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
