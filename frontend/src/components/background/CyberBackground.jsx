import { useEffect, useState } from "react";
import "./CyberBackground.css";

function CyberBackground() {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const move = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div className="cyber-background" />

      <div className="cyber-grid" />

      <div className="cyber-stars" />

      <div
        className="mouse-glow"
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </>
  );
}

export default CyberBackground;