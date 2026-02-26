"use client";
import { useState } from "react";
import HeroScroll from "./HeroScroll";
import { Navbar } from "../stranger-things/Navbar";
import { CustomCursor } from "../stranger-things/CustomCursor";

/**
 * Portal — Dimensional Portal canvas-sequence section.
 * Activates strictly on user scroll. No auto-scroll, no mount triggers.
 */
export function Portal() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <CustomCursor />
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <HeroScroll isMenuOpen={isMenuOpen} />
        </>
    );
}
