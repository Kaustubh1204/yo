"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FieryButton from "@/components/stranger-things/FireBtn";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  type TransportMode = "WALK" | "TRAIN" | "BUS";
  const [selectedMode, setSelectedMode] = useState<TransportMode>("WALK");

  const transportInfo: Record<TransportMode, string> = {
    WALK: "From nearby residential areas, the campus is accessible via NH-24 service lane. Approx 10–15 minutes walking distance from local markets.",
    TRAIN: "Nearest Railway Station: Ghaziabad Junction (approx 8 km). Take an auto or cab directly to ABESIT via NH-24 highway.",
    BUS: "Multiple UPSRTC and local buses stop near ABESIT gate on NH-24 highway. Drop point: ABESIT Engineering College Stop.",
  };

  // Scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Mobile-friendly: simpler animations
      const isMobile = window.innerWidth < 768;

      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
        },
        opacity: 0,
        y: 30, // Changed from x to y for better mobile feel
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 1,
        delay: isMobile ? 0.2 : 0, // Slight stagger on mobile
        ease: "power3.out",
      });

      gsap.from(frameRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 1.1,
        duration: 1.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!selectedMode || !infoRef.current) return;
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
  }, [selectedMode]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden py-20 md:py-0">
      {/* Background Frame */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div
          ref={frameRef}
          className="
      relative
      w-[200vh] h-[100vw] rotate-90 scale-110
      md:w-screen md:h-[120%] md:rotate-0
      sm:w-[150vh] sm:h-[90vw] sm:rotate-90 sm:scale-100
    "
        >
          <Image
            src="/frame-background.png"
            alt="Dark fantasy frame"
            fill
            className="object-cover saturate-130 blur-[2px] contrast-120 sm:object-cover"
            priority
          />
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-6">

        {/* Left Section (Text) */}
        <div ref={contentRef} className="flex flex-col space-y-6 text-center md:text-left items-center md:items-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight tracking-tight">
            <span className="block text-white relative">
              <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                ABESIT COLLEGE
              </span>
              <span className="absolute inset-0 text-red-600 blur-md opacity-25">
                ABESIT COLLEGE
              </span>
            </span>
            <span className="block mt-2 text-[#ff3b00] tracking-wide text-2xl sm:text-3xl md:text-4xl">
              OF ENGINEERING
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 italic tracking-widest uppercase opacity-70">
            Ghaziabad, Uttar Pradesh, India
          </p>

          {/* Transport Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
            {(["WALK", "TRAIN", "BUS"] as TransportMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-5 py-2 text-xs sm:text-sm font-bold tracking-widest rounded-md uppercase transition-all duration-300
                ${selectedMode === mode
                    ? "bg-[#ff3b00]/20 border border-[#ff3b00] text-white shadow-[0_0_15px_rgba(255,60,0,0.4)]"
                    : "border border-white/20 bg-black/40 hover:bg-white/10 text-gray-300"
                  }`}
              >
                BY {mode}
              </button>
            ))}
          </div>

          {/* Transport Info Text */}
          <div
            ref={infoRef}
            className="text-sm text-gray-300 leading-relaxed min-h-[60px] max-w-lg md:max-w-none text-center md:text-left"
          >
            {selectedMode ? transportInfo[selectedMode] : ""}
          </div>
        </div>

        {/* Right Section (Form) */}
        <div
          ref={formRef}
          className="relative w-full max-w-md mx-auto md:max-w-none bg-black/60 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl border border-red-500/20 shadow-[0_0_80px_rgba(255,40,0,0.15)] overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,60,0,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase mb-2 tracking-tight">
              <span className="text-white">BECOME A </span>
              <span className="text-[#ff3b00] drop-shadow-[0_0_15px_rgba(255,60,0,0.6)]">
                SPONSOR
              </span>
            </h3>

            <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
              Join us as a sponsor and support our event. Your contribution fuels innovation and impact.
            </p>

            <form className="space-y-5">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  // 'text-base' prevents iOS zoom on focus
                  className="w-full bg-transparent border-b border-red-900/30 pb-2 text-white placeholder:text-gray-500 text-base focus:outline-none focus:border-[#ff3b00] transition-all duration-300"
                />
                <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-[#ff3b00] transition-all duration-500 group-focus-within:w-full shadow-[0_0_10px_rgba(255,60,0,0.5)]" />
              </div>

              <div className="relative group">
                <textarea
                  placeholder="Your message..."
                  rows={3}
                  className="w-full bg-transparent border-b border-red-900/30 pb-2 text-white placeholder:text-gray-500 text-base focus:outline-none focus:border-[#ff3b00] transition-all duration-300 resize-none"
                />
                <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-[#ff3b00] transition-all duration-500 group-focus-within:w-full shadow-[0_0_10px_rgba(255,60,0,0.5)]" />
              </div>

              <div className="relative w-full pt-4 flex justify-center">
                <div
                  ref={glowRef}
                  className="absolute inset-[-20px] bg-[radial-gradient(circle,rgba(255,80,0,0.4)_0%,rgba(0,0,0,0)_70%)] blur-[30px] opacity-20 pointer-events-none"
                />
                <FieryButton label="Send Message" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}