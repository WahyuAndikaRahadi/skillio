"use client";

import { motion, useInView } from "framer-motion";
import { useMemo } from "react";

const defaultVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      delay: index * 0.12,
      ease: "easeOut",
    },
  }),
};

export function TimelineContent({
  as = "div",
  className = "",
  children,
  animationNum = 0,
  customVariants,
  timelineRef,
}) {
  const isInView = useInView(timelineRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  const variants = useMemo(
    () => customVariants || defaultVariants,
    [customVariants]
  );

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      custom={animationNum}
      className={className}
    >
      {as === "h1" ? <h1>{children}</h1> : as === "p" ? <p>{children}</p> : children}
    </motion.div>
  );
}
