"use client";

import { useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface NavbarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export function Navbar({ isMenuOpen, setIsMenuOpen }: NavbarProps) {
    const navContainerRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const menuIconRef = useRef<SVGSVGElement>(null);
    const xIconRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        gsap.set(xIconRef.current, { opacity: 0, scale: 0, rotation: -90 });
        gsap.set(menuIconRef.current, { opacity: 1, scale: 1, rotation: 0 });

        // Entrance animation
        gsap.fromTo(navContainerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power4.out" }
        );
    }, []);

    const handleMenuToggle = () => {
        if (isMenuOpen) {
            // Close menu
            gsap.to(menuIconRef.current, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "power2.inOut" });
            gsap.to(xIconRef.current, { opacity: 0, scale: 0, rotation: -90, duration: 0.3, ease: "power2.inOut" });

            gsap.to(".menu-item", { opacity: 0, y: 20, duration: 0.2, stagger: 0.05, ease: "power2.in" });
            gsap.to(mobileMenuRef.current, {
                opacity: 0,
                duration: 0.3,
                delay: 0.2,
                ease: "power2.inOut",
                onComplete: () => setIsMenuOpen(false),
            });
        } else {
            // Open menu
            setIsMenuOpen(true);
            gsap.to(menuIconRef.current, { opacity: 0, scale: 0, rotation: 90, duration: 0.3, ease: "power2.inOut" });
            gsap.to(xIconRef.current, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "power2.inOut" });

            gsap.from(mobileMenuRef.current, { opacity: 0, duration: 0.3, ease: "power2.inOut" });
            gsap.from(".menu-item", {
                opacity: 0,
                y: 20,
                duration: 0.3,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out",
            });
        }
    };

    return (
        <div ref={navContainerRef} className="contents">
            {/* Sticky Nav Container - Hidden on mobile to avoid overlap */}
            <div className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none px-4 hidden md:flex">
                <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-full h-16 flex items-center justify-center px-8 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    {/* Navigation Links (Desktop Only) */}
                    <nav className="flex gap-8 lg:gap-12" style={{ fontFamily: "'ITC Benguiat Std', sans-serif" }}>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Team</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Event</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Schedule</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Contact Us</a>
                    </nav>
                </div>
            </div>

            {/* Standalone Hamburger Menu Button (Mobile only) - Repositioned to top-right (standard mobile location) */}
            <button
                onClick={handleMenuToggle}
                className="md:hidden fixed top-6 right-6 z-[100] w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
                <Menu ref={menuIconRef} size={24} className="absolute" />
                <X ref={xIconRef} size={24} className="absolute" />
            </button>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div ref={mobileMenuRef} className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
                    <nav className="flex flex-col items-center gap-8" style={{ fontFamily: "'ITC Benguiat Std', sans-serif" }}>
                        <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 transition-colors text-3xl">Team</a>
                        <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 transition-colors text-3xl">Event</a>
                        <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 transition-colors text-3xl">Schedule</a>
                        <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 transition-colors text-3xl">Contact Us</a>
                    </nav>
                </div>
            )}
        </div>
    );
}
