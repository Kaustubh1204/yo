"use client";

import { Lenis } from "lenis/react";
import { ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    return (
        <Lenis
            root
            options={{
                duration: 2.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 0.8,
                touchMultiplier: 1.5,
                infinite: false,
            }}
        >
            {children}
        </Lenis>
    );
}
