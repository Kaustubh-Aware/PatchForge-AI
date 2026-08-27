import { useEffect, useRef, useCallback } from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import "./CyberBackground.css";

// Particle configuration
const PARTICLES = [
  { x: "5%",  dur: "9s",  delay: "0s",   color: "#06b6d4" },
  { x: "12%", dur: "12s", delay: "-2s",  color: "#8b5cf6" },
  { x: "20%", dur: "8s",  delay: "-5s",  color: "#06b6d4" },
  { x: "27%", dur: "14s", delay: "-1s",  color: "#ec4899" },
  { x: "35%", dur: "10s", delay: "-7s",  color: "#8b5cf6" },
  { x: "42%", dur: "7s",  delay: "-3s",  color: "#06b6d4" },
  { x: "50%", dur: "11s", delay: "-9s",  color: "#ec4899" },
  { x: "57%", dur: "13s", delay: "0s",   color: "#06b6d4" },
  { x: "63%", dur: "9s",  delay: "-4s",  color: "#8b5cf6" },
  { x: "70%", dur: "15s", delay: "-6s",  color: "#06b6d4" },
  { x: "75%", dur: "8s",  delay: "-2s",  color: "#ec4899" },
  { x: "80%", dur: "12s", delay: "-10s", color: "#8b5cf6" },
  { x: "85%", dur: "10s", delay: "-1s",  color: "#06b6d4" },
  { x: "90%", dur: "7s",  delay: "-8s",  color: "#ec4899" },
  { x: "95%", dur: "11s", delay: "-3s",  color: "#8b5cf6" },
  { x: "8%",  dur: "16s", delay: "-5s",  color: "#22c55e" },
  { x: "32%", dur: "9s",  delay: "-11s", color: "#06b6d4" },
  { x: "48%", dur: "13s", delay: "-4s",  color: "#ec4899" },
  { x: "68%", dur: "11s", delay: "-7s",  color: "#8b5cf6" },
  { x: "88%", dur: "8s",  delay: "-13s", color: "#22c55e" },
];

export default function CyberBackground() {
  const mouseGlowRef = useRef(null);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  // Mouse tracking for radial glow
  const handleMouseMove = useCallback((e) => {
    if (!mouseGlowRef.current) return;
    mouseGlowRef.current.style.left = e.clientX + "px";
    mouseGlowRef.current.style.top  = e.clientY + "px";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX, width: "100%" }}
      />

      {/* Background Layer */}
      <div className="cyber-bg" aria-hidden="true">

        {/* Mouse glow */}
        <div ref={mouseGlowRef} className="mouse-glow" />

        {/* Ambient blobs */}
        <div className="cyber-blob cyber-blob--1" />
        <div className="cyber-blob cyber-blob--2" />
        <div className="cyber-blob cyber-blob--3" />

        {/* Perspective grid */}
        <div className="cyber-grid" />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="cyber-particle"
            style={{
              "--p-x":     p.x,
              "--p-dur":   p.dur,
              "--p-delay": p.delay,
              "--p-color": p.color,
            }}
          />
        ))}

      </div>
    </>
  );
}
