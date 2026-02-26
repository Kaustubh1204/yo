"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardScrollAnimation.css";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const IMG = "/assets/prizes";

const CARDS = [
    {
        id: "card-1",
        src: `${IMG}/1.jpeg`,
        mobileSrc: `${IMG}/res1.png`,
        label: "(01)",
        heading: "Online",
        p1: "1st: 15000/-",
        p2: "2nd: 8000/-",
    },
    {
        id: "card-2",
        src: `${IMG}/2.jpeg`,
        mobileSrc: `${IMG}/res2.png`,
        label: "(02)",
        heading: "Offline",
        p1: "1st: 35000/-",
        p2: "2nd: 25000/-",
    },
    {
        id: "card-3",
        src: `${IMG}/3.jpeg`,
        mobileSrc: `${IMG}/res3.png`,
        label: "(03)",
        heading: "Best Beginner",
        p1: "4000/-",
        p2: "All Girls Team: 4000/-",
    },
];

export function CardScrollAnimation() {
    const stickyRef = useRef<HTMLElement | null>(null);
    const cardContainerRef = useRef<HTMLDivElement | null>(null);
    const card1Ref = useRef<HTMLDivElement | null>(null);
    const card2Ref = useRef<HTMLDivElement | null>(null);
    const card3Ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();
        const root = stickyRef.current?.closest(".card-scroll-root") as HTMLElement | null;

        // ── Section entrance fade ──
        if (root) {
            gsap.fromTo(root,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: root,
                        start: "top 85%",
                        end: "top 40%",
                        scrub: 1,
                    },
                }
            );
        }

        /* ── Mobile / Tablet (< 1000px) ── */
        mm.add("(max-width: 999px)", () => {
            const mc1 = card1Ref.current;
            const mc2 = card2Ref.current;
            const mc3 = card3Ref.current;
            const container = cardContainerRef.current;
            if (!mc1 || !mc2 || !mc3 || !container) return;

            const mobileCards = [mc1, mc2, mc3];
            const scrollDistance = window.innerHeight * 2.5;

            gsap.set([mobileCards, container], { clearProps: "all" });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: stickyRef.current,
                    start: "top top",
                    end: `+=${scrollDistance}px`,
                    scrub: 0.5,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            });

            tl.to(container, { gap: "1.25rem", duration: 1, ease: "power2.inOut", force3D: true }, 0)
                .to(mobileCards, { borderRadius: "16px", duration: 1, ease: "power2.inOut", force3D: true }, 0)
                .to(mc1, { y: -12, duration: 1, ease: "power2.inOut", force3D: true }, 0)
                .to(mc3, { y: 12, duration: 1, ease: "power2.inOut", force3D: true }, 0)
                .to(mobileCards, { rotationY: 180, duration: 1.5, ease: "power1.inOut", stagger: 0.15, force3D: true }, 0.6);

            return () => {
                tl.kill();
            };
        });

        /* ── Desktop (≥ 1000px) ── */
        mm.add("(min-width: 1000px)", () => {
            const container = cardContainerRef.current;
            const c1 = card1Ref.current;
            const c2 = card2Ref.current;
            const c3 = card3Ref.current;
            if (!container || !c1 || !c2 || !c3) return;

            const allCards = [c1, c2, c3];
            const outerCards = [c1, c3];
            const scrollDistance = window.innerHeight * 2.5;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: stickyRef.current,
                    start: "top top",
                    end: `+=${scrollDistance}px`,
                    scrub: 0.5,
                    pin: true,
                    pinSpacing: true,
                    invalidateOnRefresh: true,
                },
            });

            // Width Animation (0 - 25%)
            tl.to(container, { width: "60%", ease: "none", duration: 0.25, force3D: true }, 0);

            // Gap + Border Radius (at 35%)
            tl.to(container, { gap: "20px", ease: "power3.out", duration: 0.1, force3D: true }, 0.35)
                .to(allCards, { borderRadius: "28px", ease: "power3.out", duration: 0.1, force3D: true }, 0.35);

            // Flip Animation (at 70%)
            tl.to(allCards, { rotationY: 180, ease: "power3.inOut", stagger: 0.05, duration: 0.2, force3D: true }, 0.7)
                .to(outerCards, { y: 30, rotationZ: (i: number) => (i === 0 ? -15 : 15), ease: "power3.inOut", duration: 0.2, force3D: true }, 0.7);

            return () => {
                tl.kill();
            };
        });

        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
            mm.revert();
        };
    }, []);

    return (
        <div className="card-scroll-root">
            {/* Background layer */}
            <div className="card-scroll-bg"></div>
            {/* Overlay for readability */}
            <div className="card-scroll-overlay"></div>

            <section className="card-section sticky" ref={stickyRef}>
                <div className="prizes-heading">
                    <h2><span>Prizes</span></h2>
                </div>
                <div className="card-container" ref={cardContainerRef}>
                    {CARDS.map((card, idx) => (
                        <div
                            key={card.id}
                            className="card"
                            id={card.id}
                            ref={idx === 0 ? card1Ref : idx === 1 ? card2Ref : card3Ref}
                        >
                            <div className="card-front">
                                {/* Mobile/tablet image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={card.mobileSrc}
                                    alt={`Card ${idx + 1}`}
                                    className="card-front-mobile-img"
                                    loading="lazy"
                                />
                                {/* Desktop image */}
                                <Image
                                    src={card.src}
                                    alt={`Card ${idx + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    style={{ objectFit: "cover" }}
                                    priority={idx === 1}
                                    className="card-front-desktop-img"
                                />
                                <div className="card-slices">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="slice"
                                            style={{
                                                backgroundImage: `url(${card.src})`,
                                                backgroundPosition: `${i * 25}% 0%`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-back">
                                {/* Desktop back-image */}
                                <Image
                                    src={card.src}
                                    alt={`Card ${idx + 1} Back`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="back-image back-image-desktop"
                                />
                                {/* Mobile back-image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={card.mobileSrc}
                                    alt={`Card ${idx + 1} Back`}
                                    className="back-image back-image-mobile"
                                    loading="lazy"
                                />
                                <div className="back-overlay"></div>
                                <div className="back-content">
                                    <span>{card.label}</span>
                                    <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{card.heading}</h2>
                                    <p>{card.p1}</p>
                                    <p>{card.p2}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
