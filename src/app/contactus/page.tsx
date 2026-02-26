"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FieryButton from "@/components/stranger-things/FireBtn";
import FireModeButton from "@/components/stranger-things/ContactDestBtn";
import localFont from "next/font/local";
import { Navbar } from "@/components/stranger-things/Navbar";

gsap.registerPlugin(ScrollTrigger);

const trackFont = localFont({
    src: [
        { path: '../../../public/font/BenguiatStd-Bold.woff2', weight: '700', style: 'normal' },
        { path: '../../../public/font/BenguiatStd-Bold.woff', weight: '700', style: 'normal' },
        { path: '../../../public/font/BenguiatStd-Bold.ttf', weight: '700', style: 'normal' },
    ],
    variable: '--font-track',
    display: 'swap',
});

export default function ContactSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bgImageRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    type TransportMode = "WALK" | "TRAIN" | "BUS" | "AIR";
    const [selectedMode, setSelectedMode] = useState<TransportMode>("WALK");

    const transportInfo: Record<TransportMode, string> = {
        WALK: "From nearby residential areas, the campus is accessible via NH-24 service lane.",
        TRAIN: "From Ghaziabad Railway Station: Book a cab directly to ABESIT.",
        BUS: "Take the metro to Noida Electronic City (Blue Line) and then an auto.",
        AIR: "Book a cab directly from IGI Airport or take the Airport Express.",
    };

    useEffect(() => {
        // --- 1. METEOR CANVAS LOGIC ---
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const meteors: any[] = [];
        function createMeteor(initial = false) {
            return {
                x: initial ? Math.random() * w : w + Math.random() * 200,
                y: Math.random() * h,
                len: Math.random() * 80 + 20,
                speed: Math.random() * 3 + 1.5,
                opacity: Math.random() * 0.7 + 0.1,
                width: Math.random() * 1.5 + 0.5,
            };
        }
        for (let i = 0; i < 20; i++) meteors.push(createMeteor(true));

        function draw() {
            ctx!.clearRect(0, 0, w, h);
            ctx!.shadowBlur = 5;
            ctx!.shadowColor = "#ff3b00";
            meteors.forEach((m) => {
                const gradient = ctx!.createLinearGradient(m.x, m.y, m.x + m.len, m.y - m.len);
                gradient.addColorStop(0, `rgba(255, 60, 0, ${m.opacity})`);
                gradient.addColorStop(1, "rgba(255, 60, 0, 0)");
                ctx!.strokeStyle = gradient;
                ctx!.lineWidth = m.width;
                ctx!.beginPath();
                ctx!.moveTo(m.x, m.y);
                ctx!.lineTo(m.x + m.len, m.y - m.len);
                ctx!.stroke();
                m.x -= m.speed;
                m.y += m.speed;
                if (m.x < -200 || m.y > h + 200) Object.assign(m, createMeteor());
            });
            requestAnimationFrame(draw);
        }
        draw();

        // --- 2. FIXED ORGANIC SHAKE ANIMATION ---
        let ctx_gsap = gsap.context(() => {
            if (bgImageRef.current) {
                // We define the animation inside a function for infinite recursion
                const shakeLoop = () => {
                    // Only run on desktop screens to avoid mobile jitter
                    if (window.innerWidth >= 1024) {
                        gsap.to(bgImageRef.current, {
                            x: gsap.utils.random(-15, 15),
                            y: gsap.utils.random(-15, 15),
                            rotation: gsap.utils.random(-0.5, 0.5),
                            duration: gsap.utils.random(3, 5),
                            ease: "sine.inOut",
                            force3D: true, // Uses GPU for smoother motion
                            onComplete: shakeLoop,
                        });
                    }
                };
                shakeLoop();
            }
        }, sectionRef);

        return () => {
            window.removeEventListener("resize", handleResize);
            ctx_gsap.revert();
        };
    }, []);

    const fontClass = trackFont.variable + " font-track";

    return (
        <main className="relative w-full min-h-screen bg-black overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full z-[100]">
                <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} alwaysVisible />
            </div>

            <section
                ref={sectionRef}
                className={`${fontClass} relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 md:py-12`}
                style={{ fontFamily: 'var(--font-track), serif' }}
            >
                <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none opacity-40" />

                {/* Background Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Desktop BG - will-change-transform helps GSAP performance */}
                    <div
                        ref={bgImageRef}
                        className="hidden md:block absolute inset-[-5%] w-[110%] h-[110%] opacity-60 saturate-[0.8] will-change-transform"
                    >
                        <Image
                            src="/frame-background.png"
                            alt="Desktop BG"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>

                    {/* Mobile BG */}
                    <div className="block md:hidden absolute inset-0 w-full h-full opacity-60 saturate-[0.8]">
                        <Image
                            src="/sm-frame-background.png"
                            alt="Mobile BG"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="relative z-10 w-full max-w-5xl flex flex-col md:grid md:grid-cols-2 gap-10 items-center px-6 sm:px-16 mt-8 md:mt-0">
                    
                    {/* Left Content */}
                    <div className="flex flex-col space-y-4 md:space-y-6 text-center md:text-left items-center md:items-start w-full">
                        <div className="space-y-1">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-white/90">
                                ABESIT GROUP
                            </h2>
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-[#ff3b00]/80 drop-shadow-[0_0_10px_rgba(255,59,0,0.4)]">
                                OF INSTITUTIONS
                            </h2>
                        </div>
                        <p className="text-[10px] md:text-sm text-gray-500 italic tracking-[0.2em] uppercase">
                            Ghaziabad • Uttar Pradesh • India
                        </p>

                        <div className="w-full flex flex-col items-center md:items-start space-y-6">
                            <FireModeButton
                                selectedMode={selectedMode}
                                setSelectedMode={setSelectedMode}
                            />

                            <div className="min-h-[70px] flex flex-col justify-center border-l border-white/10 pl-4 py-1 text-left self-start md:self-auto">
                                <span className="text-[10px] uppercase tracking-widest text-[#ff3b00] mb-1 font-bold">
                                    ROUTE INTEL:
                                </span>
                                <p className="text-sm md:text-base text-gray-200 font-medium leading-snug">
                                    {transportInfo[selectedMode]}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Form */}
                    <div className="relative w-full max-w-[340px] md:max-w-none mx-auto pb-12 md:pb-0">
                        <div className="absolute -inset-1 bg-[#ff3b00]/10 blur-2xl opacity-20 pointer-events-none" />
                        <div className="relative bg-black/60 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center">
                            <h3 className="text-lg md:text-2xl font-bold uppercase mb-8 tracking-[0.2em] text-white/80 text-center">
                                BECOME A <span className="text-[#ff3b00]/70">SPONSOR</span>
                            </h3>
                            {/* Pass the label prop to fix the TypeScript error */}
                            <FieryButton label="SEND MESSAGE" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}