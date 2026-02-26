"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FieryButtonProps {
  label?: string;
}

export default function FieryButton({ label = "Burning Button" }: FieryButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!btnRef.current || !glowRef.current || !innerGlowRef.current) return;

    const ctx = gsap.context(() => {
      // Outer glow animation
      gsap.to(glowRef.current!, {
        opacity: 0.55,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glowRef.current!, {
        scale: 1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Inner glow pulse
      gsap.to(innerGlowRef.current!, {
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle button breathing
      gsap.to(btnRef.current!, {
        scale: 1.015,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Sparks animation
      sparksRef.current.forEach((spark) => {
        if (!spark) return;
        const animateSpark = () => {
          const height = gsap.utils.random(30, 60);
          const drift = gsap.utils.random(-15, 15);
          gsap.fromTo(
            spark,
            { x: 0, y: 8, opacity: 0, scale: 0.4 },
            {
              x: drift,
              y: -height,
              opacity: 0.6,
              scale: 0.8,
              duration: gsap.utils.random(2.5, 4),
              ease: "power1.out",
              onComplete: () => {
                gsap.set(spark, { opacity: 0 });
                gsap.delayedCall(gsap.utils.random(1.5, 3), animateSpark);
              },
            }
          );
        };
        gsap.delayedCall(gsap.utils.random(1, 3), animateSpark);
      });
    }, btnRef);

    return () => ctx.revert();
  }, []);

  // Box-shadow handlers with reduced blur
  const handleMouseEnter = () => {
    if (btnRef.current) {
      btnRef.current.style.boxShadow =
        "0 0 40px 7px rgba(255,50,50,0.9), inset 0 2px 12px rgba(255,80,80,0.8)";
    }
  };

  const handleMouseLeave = () => {
    if (btnRef.current) {
      btnRef.current.style.boxShadow =
        "0 0 25px 5px rgba(204,34,0,0.65), inset 0 2px 6px rgba(255,50,50,0.6)";
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block", padding: 20 }}>
      {/* Outer glow */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(255,20,20,0.85) 0%, rgba(150,0,0,0.4) 5%, transparent 15%)",
          filter: "blur(12px)", // reduced blur
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Inner glow */}
      <div
        ref={innerGlowRef}
        style={{
          position: "absolute",
          inset: "-20px",
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,50,50,0.8) 0%, rgba(150,0,0,0.5) 10%, transparent 20%)",
          filter: "blur(14px)", // reduced blur
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Button */}
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          padding: "8px 28px",
          fontSize: 20,
          fontWeight: 600,
          color: "#ffe6e6",
          background:
            "linear-gradient(180deg, #550000 0%, #8b0000 45%, #330000 100%)",
          border: "2.5px solid #cc2200",
          borderRadius: 14,
          cursor: "pointer",
          letterSpacing: "1.2px",
          textShadow: "0 0 12px #cc2200, 0 0 25px #aa1100",
          boxShadow:
            "0 0 8px 5px rgba(204,34,0,0.65), inset 0 2px 6px rgba(255,50,50,0.6)", // normal reduced
          overflow: "hidden",
          zIndex: 3,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {label}

        {/* Sparks */}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              sparksRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              background: i % 3 === 0 ? "#ff4444" : "#cc2222",
              borderRadius: "50%",
              left: "50%",
              top: "60%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              filter: "blur(1px)", // slightly reduced
              opacity: 0,
            }}
          />
        ))}
      </button>
    </div>
  );
}