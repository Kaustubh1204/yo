"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ── Asset paths (served from /public/assets/hacktropica/) ── */
const IMG = "/assets/hacktropica";

const MEMORY_IMAGES = [
    `${IMG}/mem-img_1147.jpg`,
    `${IMG}/mem-img_1226.jpg`,
    `${IMG}/im3.jpeg`,
    `${IMG}/mem-img_1223.jpg`,
    `${IMG}/mem-img_1189.jpg`,
    `${IMG}/mem-img_1286.jpg`,
    `${IMG}/mem-img_1139.jpg`,
    `${IMG}/im1.jpeg`,
    `${IMG}/mem-img_1237.jpg`,
    `${IMG}/mem-img_1146.jpg`,
    `${IMG}/mem-img_1386.jpg`,
    `${IMG}/mem-img_1193.jpg`,
    `${IMG}/mem-img_1385.jpg`,
    `${IMG}/mem-img_1303.jpg`,
    `${IMG}/mem-img_1149.jpg`,
    `${IMG}/im2.jpeg`,
    `${IMG}/mem-img_1345_1.jpg`,
    `${IMG}/mem-img_1258.jpg`,
    `${IMG}/mem-img_1354.jpg`,
    `${IMG}/mem-img_1153.jpg`,
    `${IMG}/mem-img_1387.jpg`,
    `${IMG}/mem-img_1376.jpg`,
    `${IMG}/mem-img_1182.jpg`,
];

/* ── Single scrolling column ── */
const Column = ({
    images,
    speed,
    className,
}: {
    images: string[];
    speed: number;
    className?: string;
}) => {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const direction = speed > 0 ? "hacktropicaDown" : "hacktropicaUp";
        const duration = 60;

        track.style.animationName = direction;
        track.style.animationDuration = `${duration}s`;
        track.style.animationTimingFunction = "linear";
        track.style.animationIterationCount = "infinite";

        return () => {
            track.style.animationName = "";
        };
    }, [speed]);

    const allImages = [...images, ...images];

    return (
        <div
            className={`flex flex-col w-full overflow-hidden h-[160vh] ${className ?? ""}`}
        >
            <div
                ref={trackRef}
                className="flex flex-col gap-5 md:gap-7 will-change-transform"
            >
                {allImages.map((src, i) => (
                    <div
                        key={`${src}-${i}`}
                        className="relative w-full aspect-[3/4.5] rounded-2xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]"
                    >
                        <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        {/* Corner accents */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Main exported component ── */
export function HacktropicaMemories() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade-in the entire section
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 100%",
                        end: "top 60%",
                        scrub: 1.5,
                    },
                }
            );

            // Heading reveal
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 92%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black overflow-hidden -mt-24"
            style={{ opacity: 0 }}
        >
            {/* Static Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0">
                    <Image
                        src={`${IMG}/bg2.jpg`}
                        alt=""
                        fill
                        className="object-cover blur-[4px] grayscale-[20%] opacity-70 brightness-[0.9]"
                    />
                </div>
                <div className="absolute inset-0 bg-neutral-900/30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
            </div>

            {/* Gallery Grid with Centered Title Overlay */}
            <div className="relative z-10 w-full px-2 md:px-8 lg:px-16 py-16 md:py-24">
                {/* Gallery Columns */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1 */}
                    <div className="relative border-r border-white/10 px-2 md:px-4">
                        <Column images={MEMORY_IMAGES.slice(0, 6)} speed={-1.2} />
                    </div>
                    {/* Column 2 */}
                    <div className="relative border-r border-white/10 px-2 md:px-4">
                        <Column images={MEMORY_IMAGES.slice(6, 12)} speed={1.8} />
                    </div>
                    {/* Column 3 */}
                    <div className="relative hidden md:block md:border-r border-white/10 px-2 md:px-4">
                        <Column images={MEMORY_IMAGES.slice(12, 18)} speed={-0.6} />
                    </div>
                    {/* Column 4 */}
                    <div className="relative hidden lg:block px-2 md:px-4">
                        <Column images={MEMORY_IMAGES.slice(18)} speed={2.2} />
                    </div>
                </div>

                {/* Centered Title Overlay — sits on top of the gallery */}
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                    <div
                        ref={headingRef}
                        className="text-center px-6"
                    >
                        <p
                            className="uppercase tracking-[0.45em] text-[10px] md:text-xs text-red-500 font-semibold mb-4"
                            style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                        >
                            The Journey So Far
                        </p>
                        <h2
                            className="text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-[1.1]"
                            style={{
                                fontFamily: "'ITC Benguiat Std', serif",
                                textShadow:
                                    "0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 0 4px 0 rgba(0,0,0,0.9)",
                            }}
                        >
                            Memories of<br />
                            Hacknovate 6.0
                        </h2>
                    </div>
                </div>
            </div>

            {/* Bottom fade to black for seamless footer transition */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </section>
    );
}
