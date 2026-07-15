"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger index; delay = index * var(--stagger) equivalent (80ms). */
  index?: number;
  /** Rise distance in px (12-22 per spec). */
  rise?: number;
  className?: string;
};

/**
 * Scroll reveal: rise + fade, once, honoring prefers-reduced-motion
 * with a dignified static fallback.
 */
export function Reveal({ children, index = 0, rise = 18, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
    >
      {children}
    </motion.div>
  );
}
