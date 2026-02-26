"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const content =
    "Hacknovate 7.0 is a 30-hour international hybrid hackathon where ideas feel like discoveries beyond the ordinary. Developers and innovators unite to solve real problems and turn imagination into reality.";

export function AboutHacknovate() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const chars = gsap.utils.toArray<HTMLElement>(".reveal-char");

            // 0. Section Entrance (Smooth Fade Only, No Slide)
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: 1.5,
                    },
                }
            );

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=350%", // Tightened even further to reach ABESIT faster
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                },
            });

            // 🌌 Background ambient glow movement - Optimized with force3D
            gsap.to(glowRef.current, {
                x: 100,
                y: -50,
                scale: 1.1,
                duration: 15,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                force3D: true, // GPU acceleration
            });

            // 1. Logo fades in - Stronger initial blur as requested
            tl.fromTo(
                logoRef.current,
                { opacity: 0, scale: 0.6 }, // Removed blur for stability
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out",
                    force3D: true,
                }
            )

                // Hold logo
                .to({}, { duration: 0.6 }) // Slightly faster hold

                // Logo fades out
                .to(logoRef.current, {
                    opacity: 0,
                    scale: 1.4,
                    duration: 0.8,
                    ease: "power2.in",
                    force3D: true,
                })

                // 2. Letter-by-letter blur reveal
                .fromTo(
                    chars,
                    { opacity: 0, y: 10 }, // Removed blur
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.015,
                        ease: "power2.out",
                        duration: 0.5,
                        force3D: true,
                    }
                )

                // Hold fully visible text
                .to({}, { duration: 1 })

                // Text fades out smoothly - moved later and faster
                .to(textRef.current, {
                    opacity: 0,
                    y: -10,
                    duration: 0.4,
                    ease: "power2.in",
                    force3D: true,
                })

                // 3. Final Section Fade Out (Seamless Transition)
                .to(sectionRef.current, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in",
                    force3D: true,
                });

            // Refresh all ScrollTriggers after this pin is set up
            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-black overflow-hidden z-20"
        >
            {/* Background Image with Overlay - Balanced Visibility */}
            <div className="absolute inset-0 z-0 will-change-transform">
                <img
                    src="/assets/about hacknovate/Frame126115411.jpeg"
                    alt="About Background"
                    className="w-full h-full object-cover opacity-60 grayscale-[0.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* 🔥 Ambient moving glow layer — Reduced blur for performance */}
            <div
                ref={glowRef}
                className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none z-[1] will-change-transform"
                style={{ top: "30%", left: "20%", background: "radial-gradient(circle, rgba(180,30,30,0.8) 0%, rgba(120,0,0,0.4) 50%, transparent 70%)" }}
            />

            {/* Subtle red vignette edges for cinematic feel */}
            <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(20,0,0,0.6) 100%)" }}
            />

            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-24 max-w-[1200px] mx-auto z-[2]">
                {/* TEXT — Letter-by-letter reveal */}
                <p
                    ref={textRef}
                    className="absolute text-white/90 text-[1.6rem] md:text-[2.5rem] lg:text-[3.25rem] leading-[1.2] font-medium tracking-tight text-center max-w-[1200px] w-full px-4 will-change-[transform,opacity]"
                    style={{
                        fontFamily: "'ITC Benguiat Std', serif",
                        textWrap: "balance" as any
                    }}
                >
                    {content.split(" ").map((word, wIdx) => {
                        const hasNewline = word.includes("\n");
                        const parts = word.split("\n");

                        return (
                            <span key={wIdx} className="inline-block whitespace-nowrap">
                                {parts.map((part, pIdx) => (
                                    <span key={pIdx}>
                                        {part.split("").map((char, cIdx) => (
                                            <span
                                                key={cIdx}
                                                className="reveal-char inline-block opacity-0 will-change-transform"
                                                style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
                                            >
                                                {char}
                                            </span>
                                        ))}
                                        {pIdx < parts.length - 1 && <br />}
                                    </span>
                                ))}
                                {/* Space after the word-block */}
                                <span className="inline-block opacity-1">&nbsp;</span>
                            </span>
                        );
                    })}
                </p>

                {/* HACKNOVATE 7.0 LOGO — Substituted for text */}
                <div
                    ref={logoRef}
                    className="absolute flex flex-col items-center justify-center pointer-events-none opacity-0 will-change-[transform,opacity]"
                >
                    <img
                        src="/navlogo.png"
                        alt="Hacknovate 7.0 Logo"
                        className="h-48 md:h-72 lg:h-96 w-auto drop-shadow-[0_0_40px_rgba(255,0,0,0.4)]"
                    />
                </div>
            </div>
        </section>
    );
}