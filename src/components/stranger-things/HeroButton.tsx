"use client";
import React, { useState, useEffect } from 'react';

export default function CustomButton({ 
  link = "#", 
  imageSrc = "devfolio.png", 
  buttonText = "Apply with Devfolio",
  width = "260px",
  height = "56px",
  fontSize = "18px",
  iconSize = "32px", 
  borderRadius = "6px",
  applyInvert = false 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noreferrer"
      className="inline-block no-underline"
    >
      <button 
        className="
          group flex items-center justify-center gap-3
          bg-white transition-all duration-300
          active:scale-95
          border border-red-500/20 hover:border-red-500/60
          shadow-[0_2px_10px_rgba(239,68,68,0.15)]
          hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]
          hover:opacity-95
          text-[#9BA3AF] hover:text-[#ef4444]
          font-semibold
        "
        style={{
          width: width,
          height: height,
          fontSize: fontSize,
          borderRadius: borderRadius,
        }}
      >
        <span className="flex items-center justify-center">
          <img 
            alt="icon" 
            src={imageSrc}
            className={`
              transition-all duration-300
              grayscale opacity-60
              group-hover:grayscale-0 group-hover:opacity-100
              ${applyInvert ? 'invert' : ''}
            `}
            style={{ 
              width: iconSize,
              height: iconSize,
            }}
          />
        </span> 
        {buttonText}
      </button>
    </a>
  );
}