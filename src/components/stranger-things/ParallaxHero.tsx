"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Navbar } from "./Navbar";
import { CountdownTimer } from "./CountdownTimer";
import { CustomCursor } from "./CustomCursor";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);
    const leftTreesRef = useRef<HTMLDivElement>(null);
    const rightTreesRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<HTMLImageElement>(null);
    const brandingRef = useRef<HTMLDivElement>(null);
    const countdownRef = useRef<HTMLDivElement>(null);
    const navLogoRef = useRef<HTMLDivElement>(null);
    const abesitLogoRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Main parallax animation
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        tl.to(bgRef.current, { y: -100, filter: "blur(5px)", duration: 1 }, 0);
        tl.to(leftTreesRef.current, { x: -500, filter: "blur(8px)", duration: 1 }, 0);
        tl.to(rightTreesRef.current, { x: 500, filter: "blur(8px)", duration: 1 }, 0);
        tl.to(fgRef.current, { y: -120, scale: 2.5, duration: 1 }, 0);
        tl.to(countdownRef.current, { y: -120, scale: 0.9, duration: 1 }, 0); // Sync with fgRef scroll
        tl.to(brandingRef.current, { y: -600, scale: 0.7, opacity: 0, duration: 1, ease: "none" }, 0);
    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        // Subtly move background layers based on mouse
        gsap.to(bgRef.current, {
            x: x * 15,
            y: y * 15,
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.to(leftTreesRef.current, {
            xPercent: -35, // Maintain original CSS percentage-based offset
            x: x * 40,     // Add mouse movement on top
            y: y * 25,
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.to(rightTreesRef.current, {
            xPercent: 35,  // Maintain original CSS percentage-based offset
            x: x * 40,     // Add mouse movement on top
            y: y * 25,
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.to(fgRef.current, {
            xPercent: -50, // Keep centered while animating x
            x: x * 30,
            y: 10 + y * 20, // 10 is the base translate-y-10
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.to(countdownRef.current, {
            x: x * 30,
            y: y * 20,
            duration: 1.5,
            ease: "power2.out",
        });

        gsap.to(brandingRef.current, {
            x: x * 20,
            y: y * 20,
            duration: 1.5,
            ease: "power2.out",
        });
    };

    // Entrance Animation on Load
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Hide elements initially and set xPercent for fgRef
        gsap.set([brandingRef.current, countdownRef.current, navLogoRef.current, abesitLogoRef.current], { opacity: 0 });
        gsap.set(fgRef.current, { opacity: 0, xPercent: -50 });

        tl.fromTo(brandingRef.current,
            { opacity: 0, scale: 1.5, y: 50 },
            { opacity: 0.6, scale: 1, y: 0, duration: 1.5, delay: 0.5 }
        )
            .fromTo([navLogoRef.current, abesitLogoRef.current],
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
                "-=1"
            )
            .fromTo(fgRef.current,
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 1.2 },
                "-=0.8"
            )
            .fromTo(countdownRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1 },
                "-=0.8"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} onMouseMove={handleMouseMove} className="relative h-screen w-full overflow-hidden bg-black cursor-none">
            <CustomCursor />
            {/* Corner Logos - Responsive Positions and Scales */}
            <div ref={navLogoRef} className="absolute top-0 left-0 pl-4 md:pl-6 pt-2 md:pt-4 z-50 pointer-events-auto transition-all" data-cursor-flip="true">
                <img
                    src="/navlogo.png"
                    alt="Navigation Logo"
                    className="h-16 md:h-32 lg:h-44 w-auto"
                />
            </div>
            <div ref={abesitLogoRef} className="hidden md:block absolute top-0 right-0 p-4 md:p-6 z-50 pointer-events-auto transition-all" data-cursor-flip="true">
                <img
                    src="/abesit.png"
                    alt="Abesit Logo"
                    className="h-6 md:h-12 lg:h-16 w-auto"
                />
            </div>

            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            {/* Background */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[1586px]">
                    <img
                        ref={bgRef}
                        src="/assets/images/strange-bg-sans-trees.png"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Tree Layers - Hidden on mobile to clear view */}
            <div
                ref={leftTreesRef}
                className="hidden md:block absolute inset-y-0 left-0 h-full z-5 pointer-events-none"
                style={{ transform: 'translateX(-35%)' }}
            >
                <img
                    src="/assets/images/trees-left.png"
                    alt=""
                    className="h-full w-auto"
                />
            </div>

            <div
                ref={rightTreesRef}
                className="hidden md:block absolute inset-y-0 right-0 h-full z-5 pointer-events-none"
                style={{ transform: 'translateX(35%)' }}
            >
                <img
                    src="/assets/images/trees-right.png"
                    alt=""
                    className="h-full w-auto"
                />
            </div>

            {/* Foreground Kids - Responsive scaling and padding to avoid timer overlap */}
            <div className="absolute inset-x-0 bottom-[-20px] md:bottom-0 w-full z-10 pointer-events-none">
                {/* Foreground elements */}
                <img
                    ref={fgRef}
                    src="/assets/images/strange-kids.png"
                    alt="Characters"
                    className="absolute bottom-0 left-1/2 w-full h-auto min-w-[150%] md:min-w-0 z-20 pointer-events-none translate-y-10"
                />
            </div>

            {/* HACKNOVATE 7.0 Branding - Dynamic Size and Animation Target */}
            <div
                ref={brandingRef}
                className="absolute inset-0 z-30 pointer-events-none"
            >
                <img
                    data-cursor-flip="true"
                    src="/website_logo_final.png"
                    alt="Website Logo"
                    className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] md:w-1/3 md:max-w-200 min-w-[250px] object-contain opacity-60 pointer-events-auto"
                />
            </div>

            <div data-cursor-flip="true" className="contents">
                <CountdownTimer ref={countdownRef} isMenuOpen={isMenuOpen} />
            </div>
        </div>
    );
}