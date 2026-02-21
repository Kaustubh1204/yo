"use client";
import { useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


//registered scroll triger.
gsap.registerPlugin(ScrollTrigger)
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

        const nav = navContainerRef.current;
        const targetWidth = nav?.offsetWidth; // Measure natural width

        gsap.set(nav, {
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            opacity: 0,
            overflow: "hidden",
        });

        ScrollTrigger.create({
            start: "top top-=50",
            onEnter: () => {
                gsap.to(nav, {
                    width: targetWidth,
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.set(nav, { clearProps: "width,overflow" });
                    }
                });
            },
            onLeaveBack: () => {
                gsap.set(nav, { overflow: "hidden" });
                gsap.to(nav, {
                    width: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        // Reset opacity 
                        gsap.set(nav, { opacity: 0 });
                    }
                });
            }
        });
    }, []);

    const handleMenuToggle = () => {
        if (isMenuOpen) {
            // SLIDE UP (Close)
            const tl = gsap.timeline({
                onComplete: () => setIsMenuOpen(false)
            });

            tl.to(".menu-item", { opacity: 0, y: -10, duration: 0.2 })
                .to(mobileMenuRef.current, {
                    height: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                })
                .to(menuIconRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 0.3 }, "-=0.3")
                .to(xIconRef.current, { rotation: -90, opacity: 0, scale: 0, duration: 0.3 }, "-=0.3");

        } else {
            // SLIDE DOWN (Open)
            setIsMenuOpen(true);

            setTimeout(() => {
                const tl = gsap.timeline();

                // Set initial state for slide-down
                gsap.set(mobileMenuRef.current, { height: 0, opacity: 1 });

                tl.to(mobileMenuRef.current, {
                    height: "auto", // Classic slideDown behavior
                    duration: 0.5,
                    ease: "power2.out"
                })
                    .fromTo(".menu-item",
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 },
                        "-=0.2"
                    )
                    .to(menuIconRef.current, { rotation: 90, opacity: 0, scale: 0, duration: 0.3 }, 0)
                    .to(xIconRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 0.3 }, 0);
            }, 0);
        }
    };

    return (
        <div className="contents">

            <div className="hidden md:flex fixed inset-x-0 top-6 z-50 justify-center pointer-events-none">
                {/* moved refContent inside */}
                <div
                    ref={navContainerRef}
                    className="whitespace-nowrap max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-full h-16 flex items-center justify-center pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                >
                    {/* Navigation Links (Desktop Only) */}
                    <nav className="flex gap-8 lg:gap-12" style={{ fontFamily: "'ITC Benguiat Std', sans-serif" }}>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Team</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Event</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Schedule</a>
                        <a href="#" className="text-white hover:text-red-500 transition-all hover:scale-110 text-lg lg:text-xl">Contact Us</a>
                    </nav>
                </div>
            </div>


            {/* Mobile Nav View */}
            <div className="relative w-full">
                {/* Top Bar Container - now using justify-end to push button to the right */}
                <div className="flex justify-end items-center p-6 relative z-110">
                    <button
                        onClick={handleMenuToggle}
                        className="w-12 h-12 bg-white/10 backdrop-blur-lg border md:hidden border-white/20 rounded-full text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <Menu ref={menuIconRef} size={24} className="absolute" />
                        <X ref={xIconRef} size={24} className="absolute opacity-0" />
                    </button>
                </div>
                {/* The "Slide Down" Drawer */}
                {isMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden absolute top-0 left-0 w-full bg-white/5 backdrop-blur-lg border border-white/10 z-100 overflow-hidden"
                    >
                        {/* Added pt-28 to ensure the first link doesn't sit under the button */}
                        <nav className="flex flex-col items-start px-10 pt-28 pb-10 gap-6" style={{ fontFamily: "'ITC Benguiat Std', sans-serif" }}>
                            <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 text-2xl">Team</a>
                            <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 text-2xl">Event</a>
                            <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 text-2xl">Schedule</a>
                            <a href="#" onClick={handleMenuToggle} className="menu-item text-white hover:text-red-500 text-2xl">Contact Us</a>
                        </nav>
                    </div>
                )}
            </div>

        </div>
    );
}
