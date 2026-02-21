"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isOverRed, setIsOverRed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useGSAP(() => {
        const xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
        const yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            xTo(e.clientX);
            yTo(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements to expand cursor
            const isInteractive = !!(
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('button') ||
                target.closest('a')
            );
            setIsHovering(isInteractive);

            // Check for red objects to flip color to black
            const checkElementForRed = (el: HTMLElement | null): boolean => {
                if (!el) return false;
                const classStr = el.className?.toString() || "";
                if (
                    classStr.includes('text-red') ||
                    classStr.includes('bg-red') ||
                    el.getAttribute('data-cursor-flip') === 'true'
                ) return true;

                if (el.getAttribute('alt')?.includes('HACKNOVATE')) return true;

                return false;
            };

            setIsOverRed(checkElementForRed(target) || checkElementForRed(target.parentElement));
        };

        const handleMouseLeaveWindow = () => setIsVisible(false);
        const handleMouseEnterWindow = () => setIsVisible(true);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeaveWindow);
        document.addEventListener("mouseenter", handleMouseEnterWindow);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeaveWindow);
            document.removeEventListener("mouseenter", handleMouseEnterWindow);
        };
    }, []);

    // Hover and Color State Animation
    useGSAP(() => {
        const primaryColor = isOverRed ? "#000000" : "#ff0000";
        const glowColor = isOverRed ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 0, 0, 0.8)";

        if (isHovering) {
            gsap.to(dotRef.current, {
                scale: 2.5,
                backgroundColor: primaryColor,
                boxShadow: `0 0 15px ${glowColor}`,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            gsap.to(dotRef.current, {
                scale: 1,
                backgroundColor: primaryColor,
                boxShadow: `0 0 10px ${glowColor}`,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [isHovering, isOverRed]);

    return (
        <div className={`hidden lg:block fixed inset-0 z-[9999] pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            {/* Precise Inner Dot */}
            <div
                ref={dotRef}
                className="absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full"
            />
        </div>
    );
}
