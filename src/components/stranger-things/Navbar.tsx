"use client";
import { useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    alwaysVisible?: boolean; // Skip scroll-reveal for sub-pages
}

const NAV_LINKS = [
    { label: "Team", href: "/teams" },
    { label: "Events", href: "/events" },
    { label: "Schedule", href: "/schedule" },
    { label: "Contact Us", href: "/contactus" },
];

export function Navbar({ isMenuOpen, setIsMenuOpen, alwaysVisible = false }: NavbarProps) {
    const navContainerRef = useRef<HTMLDivElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const menuIconRef = useRef<SVGSVGElement>(null);
    const xIconRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        gsap.set(xIconRef.current, { opacity: 0, scale: 0, rotation: -90 });
        gsap.set(menuIconRef.current, { opacity: 1, scale: 1, rotation: 0 });

        const nav = navContainerRef.current;

        if (alwaysVisible) {
            gsap.set(nav, { opacity: 1, pointerEvents: "auto" });
            gsap.set(mobileNavRef.current, { opacity: 1, pointerEvents: "auto" });
            return;
        }

        // Start hidden
        gsap.set(nav, { opacity: 0, pointerEvents: "none" });
        gsap.set(mobileNavRef.current, { opacity: 0, pointerEvents: "none" });

        // Hide near footer
        ScrollTrigger.create({
            trigger: "footer",
            start: "top center",
            onEnter: () => {
                gsap.to(nav, { opacity: 0, scale: 0.95, pointerEvents: "none", duration: 0.4, ease: "power2.inOut" });
                gsap.to(mobileNavRef.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
            },
            onLeaveBack: () => {
                gsap.to(nav, { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, ease: "power2.inOut" });
                gsap.to(mobileNavRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4 });
            },
        });

        // Reveal after portal ends (~3200px scroll)
        ScrollTrigger.create({
            start: "top top-=3200",
            onEnter: () => {
                gsap.to(nav, { opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" });
                gsap.to(mobileNavRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" });
            },
            onLeaveBack: () => {
                gsap.to(nav, { opacity: 0, pointerEvents: "none", duration: 0.3, ease: "power2.in" });
                gsap.to(mobileNavRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3, ease: "power2.in" });
            },
        });
    }, [alwaysVisible]);

    const handleMenuToggle = () => {
        if (isMenuOpen) {
            const tl = gsap.timeline({ onComplete: () => setIsMenuOpen(false) });
            tl.to(".menu-item", { opacity: 0, y: -10, duration: 0.2 })
                .to(mobileMenuRef.current, { height: 0, duration: 0.4, ease: "power2.inOut" })
                .to(menuIconRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 0.3 }, "-=0.3")
                .to(xIconRef.current, { rotation: -90, opacity: 0, scale: 0, duration: 0.3 }, "-=0.3");
        } else {
            setIsMenuOpen(true);
            setTimeout(() => {
                const tl = gsap.timeline();
                gsap.set(mobileMenuRef.current, { height: 0, opacity: 1 });
                tl.to(mobileMenuRef.current, { height: "auto", duration: 0.5, ease: "power2.out" })
                    .fromTo(".menu-item", { opacity: 0, y: -20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 }, "-=0.2")
                    .to(menuIconRef.current, { rotation: 90, opacity: 0, scale: 0, duration: 0.3 }, 0)
                    .to(xIconRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 0.3 }, 0);
            }, 0);
        }
    };

    return (
        <div className="contents">
            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex fixed inset-x-0 top-6 z-[100] justify-center">
                <div
                    ref={navContainerRef}
                    className="whitespace-nowrap bg-white/5 backdrop-blur-lg border border-white/10 rounded-full h-16 flex items-center justify-center pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-8 lg:px-12"
                >
                    <nav
                        className="flex gap-8 lg:gap-12"
                        style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                    >
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* ── Mobile Nav ── */}
            <div ref={mobileNavRef} className="fixed top-0 inset-x-0 w-full md:hidden z-[100]">
                <div className="flex justify-end items-center p-6">
                    <button
                        onClick={handleMenuToggle}
                        className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <Menu ref={menuIconRef} size={24} className="absolute" />
                        <X ref={xIconRef} size={24} className="absolute opacity-0" />
                    </button>
                </div>

                {isMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="absolute top-0 left-0 w-full bg-black/90 backdrop-blur-lg border-b border-white/10 overflow-hidden"
                    >
                        {/* Close button inside the menu */}
                        <button
                            onClick={handleMenuToggle}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform z-10"
                        >
                            <X size={24} />
                        </button>
                        <nav
                            className="flex flex-col items-start px-10 pt-28 pb-10 gap-6"
                            style={{ fontFamily: "'ITC Benguiat Std', serif" }}
                        >
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={handleMenuToggle}
                                    className="menu-item text-white hover:text-red-500 text-2xl"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
