"use client";

import { Lenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
        ignoreMobileResize: true,
    });
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<any>(null);

    useEffect(() => {
        if (!lenis) return;

        // Single source of truth: GSAP ticker drives Lenis RAF
        // Lenis scroll events update ScrollTrigger positions
        const onScroll = () => ScrollTrigger.update();
        lenis.on("scroll", onScroll);

        const tickerCb = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.off("scroll", onScroll);
            gsap.ticker.remove(tickerCb);
        };
    }, [lenis]);

    return (
        <Lenis
            root
            ref={(instance: any) => {
                if (instance?.lenis && !lenis) setLenis(instance.lenis);
            }}
            options={{
                duration: 1.4,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 0.8,
                touchMultiplier: 1.5,
                infinite: false,
                autoRaf: false,
            }}
        >
            {children}
        </Lenis>
    );
}
