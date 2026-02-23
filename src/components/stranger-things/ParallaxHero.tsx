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
        tl.to(countdownRef.current, { y: -120, scale: 0.9, duration: 1 }, 0);

        tl.to(brandingRef.current, {
            y: -400,
            scale: 0.85,
            opacity: 0,
            duration: 1,
            ease: "none",
        }, 0);

        gsap.to(brandingRef.current, {
            x: "-35%",
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);

        gsap.to(bgRef.current, { x: x * 15, y: y * 15, duration: 1.5 });
        gsap.to(leftTreesRef.current, { xPercent: -35, x: x * 40, y: y * 25, duration: 1.5 });
        gsap.to(rightTreesRef.current, { xPercent: 35, x: x * 40, y: y * 25, duration: 1.5 });
        gsap.to(fgRef.current, { xPercent: -50, x: x * 30, y: 10 + y * 20, duration: 1.5 });
        gsap.to(countdownRef.current, { x: x * 30, y: y * 20, duration: 1.5 });
        gsap.to(brandingRef.current, { x: x * 20, y: y * 20, duration: 1.5 });
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        gsap.set([brandingRef.current, countdownRef.current, navLogoRef.current, abesitLogoRef.current], { opacity: 0 });
        gsap.set(fgRef.current, { opacity: 0, xPercent: -50 });

        tl.fromTo(brandingRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.5, delay: 0.3 }
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
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-screen w-full overflow-hidden bg-black cursor-none"
        >
            <CustomCursor />

            <div ref={navLogoRef} className="absolute top-0 left-0 pl-4 md:pl-6 pt-2 md:pt-4 z-50">
                <img src="/navlogo.png" alt="Navigation Logo" className="h-16 md:h-20 w-auto" />
            </div>

            <div ref={abesitLogoRef} className="hidden md:block absolute top-0 right-0 p-4 md:p-6 z-50">
                <img src="/abesit.png" alt="Abesit Logo" className="h-6 md:h-12 lg:h-16 w-auto" />
            </div>

            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[1586px]">
                    <img ref={bgRef} src="/assets/images/strange-bg-sans-trees.png" className="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>

            <div ref={leftTreesRef} className="hidden md:block absolute inset-y-0 left-0 h-full pointer-events-none" style={{ transform: 'translateX(-35%)' }}>
                <img src="/assets/images/trees-left.png" className="h-full w-auto" />
            </div>

            <div ref={rightTreesRef} className="hidden md:block absolute inset-y-0 right-0 h-full pointer-events-none" style={{ transform: 'translateX(35%)' }}>
                <img src="/assets/images/trees-right.png" className="h-full w-auto" />
            </div>

            <div className="absolute inset-x-0 bottom-[-20px] md:bottom-0 w-full pointer-events-none">
                <img ref={fgRef} src="/assets/images/strange-kids.png" className="absolute bottom-0 left-1/2 w-full min-w-[150%] translate-y-10" />
            </div>

            {/* LEFT CONTENT */}
            <div ref={brandingRef} className="absolute inset-0 z-30 flex items-center justify-center md:justify-start pointer-events-none">
                <div className="pointer-events-auto text-center md:text-left px-2 md:pl-10 max-w-xl">

                    <h1
                        className="text-white font-bold text-4xl md:text-5xl leading-[0.95] whitespace-nowrap"
                        style={{ fontFamily: "ITC Benguiat Std" }}
                    >
                        ENTER THE UPSIDE
                        <br />
                        DOWN OF INNOVATION
                    </h1>

                    <p className="text-gray-300 mt-4 text-lg md:text-xl" style={{ fontFamily: "ITC Benguiat Std" }}>
                        Hacknovate 7.0 • 30-Hour National Hackathon
                    </p>

                    <div className="flex gap-4 mt-10 justify-center md:justify-start">
                        <button className="hero-btn">Join Discord</button>
                        <button className="hero-btn">Devfolio</button>
                    </div>

                    {/* MOBILE TIMER */}
                    <div className="md:hidden mt-10 flex justify-center">
                        <CountdownTimer isMenuOpen={isMenuOpen} />
                    </div>

                </div>
            </div>

            {/* DESKTOP TIMER */}
            <div ref={countdownRef} className="hidden md:flex absolute inset-0 z-40 items-center justify-end pointer-events-none">
                <div className="pointer-events-auto pr-12">
                    <CountdownTimer isMenuOpen={isMenuOpen} />
                </div>
            </div>

        </div>
    );
}