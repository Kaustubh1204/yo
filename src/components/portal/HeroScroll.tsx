"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { useCanvasSequence } from "./hooks/useCanvasSequence";
import { CountdownTimer } from "@/components/stranger-things/CountdownTimer";
import CustomButton from "@/components/stranger-things/HeroButton";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const LAST_FRAME_INDEX = 208;

interface HeroScrollProps {
    isMenuOpen: boolean;
}

export default function HeroScroll({ isMenuOpen }: HeroScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const bottomBarRef = useRef<HTMLDivElement>(null);
    const treesLeftRef = useRef<HTMLDivElement>(null);
    const treesRightRef = useRef<HTMLDivElement>(null);
    const kidsRef = useRef<HTMLDivElement>(null);
    const heroUIRef = useRef<HTMLDivElement>(null);

    const lastRenderedIndex = useRef<number>(-1);

    const { images, loaded } = useImagePreloader("/portal/soss", FRAME_COUNT);
    const { drawFrame } = useCanvasSequence();

    // Canvas resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
                lastRenderedIndex.current = -1; // force redraw
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Draw frame 0 immediately once loaded so canvas isn't blank
    useEffect(() => {
        if (loaded && images[0] && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d", { alpha: false });
            if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "medium";
                drawFrame(ctx, images[0], canvasRef.current);
                lastRenderedIndex.current = 0;
            }
        }
    }, [loaded, images, drawFrame]);

    useGSAP(() => {
        if (!loaded) return;

        // Initial setup
        // Elements start in final position but are hidden
        gsap.set(treesLeftRef.current, { xPercent: -120, opacity: 0 });
        gsap.set(treesRightRef.current, { xPercent: 120, opacity: 0 });
        gsap.set(kidsRef.current, { y: "120vh", opacity: 1, scale: 0.9 });
        // Bars start fully outside viewport so they don't break full-screen canvas edge-to-edge
        gsap.set(topBarRef.current, { yPercent: -100, opacity: 0 });
        gsap.set(bottomBarRef.current, { yPercent: 100, opacity: 0 });
        gsap.set(heroUIRef.current, { opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
            },
        });

        const frameObj = { frame: 0 };

        // 1. Frame progression mapping EXACTLY 1:1 on the timeline duration.
        // Duration = 239 total "units" of time
        tl.to(frameObj, {
            frame: LAST_FRAME_INDEX,
            duration: LAST_FRAME_INDEX, // Map animation duration exactly to frame count
            ease: "none",
            onUpdate: () => {
                const index = Math.round(frameObj.frame);
                const safeIndex = Math.min(Math.max(index, 0), LAST_FRAME_INDEX);

                if (safeIndex !== lastRenderedIndex.current && images[safeIndex] && canvasRef.current) {
                    const ctx = canvasRef.current.getContext("2d", { alpha: false });
                    if (ctx) {
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = "medium";
                        drawFrame(ctx, images[safeIndex], canvasRef.current);
                        lastRenderedIndex.current = safeIndex;
                    }
                }
            }
        }, 0); // Start at abstract time 0

        // Overlay animations — start earlier and complete quicker
        const overlayStartTime = LAST_FRAME_INDEX - 40;

        tl.to([treesLeftRef.current, treesRightRef.current], {
            opacity: 1,
            duration: 2,
            ease: "none"
        }, overlayStartTime);

        tl.to(kidsRef.current, {
            opacity: 1,
            duration: 2,
            ease: "none"
        }, overlayStartTime);

        tl.to(treesLeftRef.current, {
            xPercent: -3,
            duration: 35,
            ease: "none"
        }, overlayStartTime);

        tl.to(treesRightRef.current, {
            xPercent: 3,
            duration: 35,
            ease: "none"
        }, overlayStartTime);

        tl.to(kidsRef.current, {
            y: "-5vh",
            scale: 1,
            duration: 35,
            ease: "none"
        }, overlayStartTime);

        tl.to(heroUIRef.current, {
            opacity: 1,
            duration: 15,
            ease: "none"
        }, overlayStartTime + 20);

    }, { dependencies: [loaded], scope: containerRef });

    const gpuStyle = {
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden" as const
    };

    return (
        // The outer section sets the total scrollable height declaratively based on FRAME_COUNT.
        // E.g., 240 frames * 25px per frame = 6000px total scroll distance.
        <section
            ref={containerRef}
            className="relative w-full bg-black"
            style={{ height: `${FRAME_COUNT * 15}px` }}
        >
            <div
                className="sticky top-0 h-[100vh] w-full overflow-hidden bg-black cursor-none pointer-events-none"
                style={gpuStyle}
            >
                {/* Layer 0 — Canvas sequence */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0, display: "block" }}
                />

                {/* Layer 1 — Cinematic Black Bars */}
                {/* Fixed explicitly to absolute top and bottom without altering internal layout flow */}
                <div
                    ref={topBarRef}
                    className="absolute top-0 left-0 w-full bg-black pointer-events-none"
                    style={{ ...gpuStyle, height: "12vh", zIndex: 5, position: "absolute", top: 0 }}
                />
                <div
                    ref={bottomBarRef}
                    className="absolute bottom-0 left-0 w-full bg-black pointer-events-none"
                    style={{ ...gpuStyle, height: "12vh", zIndex: 5, position: "absolute", bottom: 0 }}
                />

                {/* Layer 2 — Trees Left */}
                {/* Removed tailwind arbitrarily positions like -left-90, and fixed to left-0 tracking via GSAP transform */}
                <div
                    ref={treesLeftRef}
                    style={{ ...gpuStyle, zIndex: 10 }}
                    className="hidden md:block absolute inset-y-0 left-0 h-full pointer-events-none"
                >
                    <div className="h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/images/trees-left.png"
                            alt=""
                            className="h-full w-auto"
                            draggable={false}
                        />
                    </div>
                </div>

                {/* Layer 2 — Trees Right */}
                <div
                    ref={treesRightRef}
                    style={{ ...gpuStyle, zIndex: 10 }}
                    className="hidden md:block absolute inset-y-0 right-0 h-full pointer-events-none"
                >
                    <div className="h-full" style={{ position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/images/trees-right.png"
                            alt=""
                            className="h-full w-auto max-w-none"
                            draggable={false}
                        />
                    </div>
                </div>

                {/* Layer 3 — Strange Kids */}
                <div
                    ref={kidsRef}
                    style={{ ...gpuStyle, zIndex: 20 }}
                    className="absolute inset-x-0 bottom-[-20px] md:bottom-0 w-full pointer-events-none"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/images/strange-kids.png"
                        alt=""
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full min-w-[150%] translate-y-10"
                        draggable={false}
                    />
                </div>

                {/* Layer 4 — HERO UI OVERLAY */}
                <div
                    ref={heroUIRef}
                    style={{ ...gpuStyle, zIndex: 30 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {/* Nav logos */}
                    <div className="absolute top-0 left-0 pl-4 md:pl-6 pt-2 md:pt-4 z-50 pointer-events-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/navlogo.png" alt="Navigation Logo" className="h-16 md:h-20 w-auto" />
                    </div>

                    <div className="hidden md:block absolute top-0 right-0 p-4 md:p-6 z-50 pointer-events-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/abesit.png" alt="Abesit Logo" className="h-6 md:h-12 lg:h-16 w-auto" />
                    </div>

                    {/* Left — Branding + Buttons */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center md:justify-start pointer-events-none">
                        <div className="pointer-events-auto text-center md:text-left px-2 md:pl-10 max-w-xl">
                            <h1
                                className="text-white font-bold text-[1.8rem] sm:text-4xl lg:text-5xl leading-[0.75] lg:leading-[0.95] whitespace-nowrap"
                                style={{ fontFamily: "ITC Benguiat Std" }}
                            >
                                ENTER THE UPSIDE
                                <br />
                                DOWN OF INNOVATION
                            </h1>

                            <p className="text-gray-300 mt-4 text-lg lg:text-xl" style={{ fontFamily: "ITC Benguiat Std" }}>
                                Hacknovate 7.0 • 30-Hour National Hackathon
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center md:justify-start">
                                <CustomButton
                                    buttonText="Apply with Devfolio"
                                    imageSrc="/devfolio.png"
                                    width="180px"
                                    height="56px"
                                    iconSize="34px"
                                    gap="-2px"
                                    applyInvert={true}
                                />
                                <CustomButton
                                    buttonText="Join Discord"
                                    imageSrc="/discord-logo.svg"
                                    width="180px"
                                    height="56px"
                                    iconSize="24px"
                                    applyInvert={false}
                                />
                            </div>

                            {/* Mobile timer */}
                            <div className="md:hidden mt-10 flex justify-center">
                                <CountdownTimer isMenuOpen={isMenuOpen} />
                            </div>
                        </div>
                    </div>

                    {/* Right — Desktop Timer */}
                    <div className="hidden md:flex absolute inset-0 z-40 items-center justify-end pointer-events-none">
                        <div className="pointer-events-auto pr-12">
                            <CountdownTimer isMenuOpen={isMenuOpen} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
