"use client";

/**
 * CinematicAbout.tsx
 *
 * A 6-phase cinematic scroll-storytelling section for ABESIT.
 * Runs over 700vh of scroll distance with a CSS-sticky viewport.
 *
 * Phase timeline (by scroll progress 0 → 1):
 *  0.00 – 0.12  │ Phase 1  │ Black screen, "ABOUT ABESIT" fades in
 *  0.12 – 0.18  │ Handoff  │ Plain title fades out, canvas mask fades in
 *  0.18 – 0.45  │ Phase 2  │ Image visible through text cutout + parallax
 *  0.45 – 0.62  │ Phase 3  │ Text mask zooms to full-screen reveal
 *  0.62 – 0.72  │ Handoff  │ Full-screen image fades in, canvas fades out
 *  0.68 – 0.85  │ Phase 4  │ Content fades in over darkened image
 *  0.72 – 0.90  │ Phase 5  │ Cinematic slow-zoom toward center
 *  0.90 – 1.00  │ Phase 6  │ Content + image fade to black
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Local image — served from /public/
const CAMPUS_IMAGE = "/upside down.png";

export function CinematicAbout() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // REMOVED parallaxImgRef and image layer (no longer needed)
    const fullBgRef = useRef<HTMLDivElement>(null);    // full-screen reveal
    const overlayRef = useRef<HTMLDivElement>(null);    // darkening overlay
    const contentRef = useRef<HTMLDivElement>(null);    // Phase 4 content
    const introRef = useRef<HTMLDivElement>(null);    // Phase 1 plain title
    const accentRef = useRef<HTMLDivElement>(null);    // red line element
    const eLetterRef = useRef<HTMLSpanElement>(null);   // the 'E' span in ABESIT
    // Stores computed transform-origin percentages for the E letter.
    // Using a ref (not state) so updates never trigger a re-render.
    const eOriginRef = useRef<{ x: number; y: number }>({ x: 50, y: 50 });

    useGSAP(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Initialise all elements to their correct starting state
        // fullBgRef starts hidden — GSAP drives opacity based on scroll progress
        gsap.set(fullBgRef.current, { opacity: 0, scale: 1 });
        gsap.set(contentRef.current, { opacity: 0, y: 40 });
        gsap.set(overlayRef.current, { opacity: 0.35 });

        // ── Compute exact centre of 'E' relative to the sticky container ──────
        // We measure against stickyRef (the transform host) NOT window, so the
        // percentages match the coordinate space GSAP's transformOrigin lives in.
        // Wrapped in requestAnimationFrame to ensure fonts are rendered and the
        // layout is fully painted before we capture positions.
        const measureE = () => {
            requestAnimationFrame(() => {
                const eEl = eLetterRef.current;
                const sticky = stickyRef.current;
                if (!eEl || !sticky) return;

                const eRect = eEl.getBoundingClientRect();
                const stickyRect = sticky.getBoundingClientRect();

                eOriginRef.current = {
                    x: ((eRect.left + eRect.width / 2) - stickyRect.left) / stickyRect.width * 100,
                    y: ((eRect.top + eRect.height / 2) - stickyRect.top) / stickyRect.height * 100,
                };
            });
        };
        measureE();

        // ── Canvas resize ──────────────────────────────────────────────────────
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            measureE(); // recalculate E position whenever viewport changes
        };
        resize();
        window.addEventListener("resize", resize);

        // ── Draw the masked frame ──────────────────────────────────────────────
        // maskOpacity  0→1   : how opaque the black overlay is
        // textScale    1→∞   : zoom factor; pivot sits on letter 'E' in ABESIT
        // blurPx       2→0   : entrance blur, 0 after intro is complete
        const drawMask = (maskOpacity: number, textScale: number, blurPx = 0) => {
            if (!ctx) return;
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            if (maskOpacity <= 0) return;

            // Apply entrance blur before any drawing, reset after
            ctx.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "none";

            // 1. Solid black background
            ctx.globalAlpha = maskOpacity;
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w, h);

            // 2. Punch text out via destination-out (creates transparency = reveals image layer)
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Stacked two-line layout — same font as HTML intro
            const fontFamily = `'ITC Benguiat Std', serif`;
            const topFontSize = Math.min(w * 0.10, 110);   // ABOUT — smaller
            const botFontSize = Math.min(w * 0.155, 165);   // ABESIT — dominant
            const lineGap = botFontSize * 0.10;

            const totalH = topFontSize + lineGap + botFontSize;
            const topY = h / 2 - totalH / 2 + topFontSize * 0.5;
            const botY = topY + topFontSize * 0.5 + lineGap + botFontSize * 0.5;

            // Zoom pivot: calculate exact center of the "E" inside "ABESIT"
            ctx.font = `bold ${botFontSize}px ${fontFamily}`;

            const fullText = "ABESIT";
            const beforeE = "AB";   // letters before E
            const eChar = "E";

            const fullWidth = ctx.measureText(fullText).width;
            const beforeWidth = ctx.measureText(beforeE).width;
            const eWidth = ctx.measureText(eChar).width;

            const textStartX = w / 2 - fullWidth / 2;

            // Push pivot inside the inner cavity of "E"
            const pivotX = textStartX + beforeWidth + eWidth * 0.38;
            const pivotY = botY - botFontSize * 0.12;

            ctx.save();
            ctx.translate(pivotX, pivotY);
            ctx.scale(textScale, textScale);
            ctx.translate(-pivotX, -pivotY);

            // Draw ABOUT (smaller)
            ctx.font = `bold ${topFontSize}px ${fontFamily}`;
            ctx.fillText("ABOUT", w / 2, topY);

            // Draw ABESIT (dominant)
            ctx.font = `bold ${botFontSize}px ${fontFamily}`;
            ctx.fillText("ABESIT", w / 2, botY);

            ctx.restore();

            // Reset composite mode and filter
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            ctx.filter = "none";
        };

        // ── Zoom timeline — separate ScrollTrigger so GSAP owns the interpolation ──
        // Using a timeline + scrub means GSAP handles all easing internally;
        // no per-frame math means no micro-jumps or stutter.
        gsap.set(fullBgRef.current, {
            scale: 1,
            y: 0,
            transformOrigin: "50% 60%",
            force3D: true,
        });

        const zoomTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "50% top",
                end: "bottom+=80% top",   // MASSIVE zoom runway
                scrub: 4,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        zoomTl.to(fullBgRef.current, {
            scale: 8.5,              // FULL gate fill
            y: -1200,                // deep dive inside entrance
            transformOrigin: "50% 78%",
            ease: "none",
            force3D: true
        });

        // ── Main ScrollTrigger (mask + opacity phases) ──────────────────────
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            anticipatePin: 1,
            onUpdate: (self) => {
                const p = self.progress;

                // ── Image opacity: hidden before mask, visible during & after mask ──
                // Image sits at z-[2] (below canvas z-[3]).
                // Canvas destination-out punches transparency through itself revealing image.
                // After mask fades (p>=0.55) image stays fully visible for zoom phases.
                let imageOpacity = 0;
                if (p >= 0.08 && p < 0.16) {
                    imageOpacity = (p - 0.08) / 0.08; // fade in with mask
                } else if (p >= 0.16) {
                    imageOpacity = 1; // fully visible for rest of animation
                }
                gsap.set(fullBgRef.current, { opacity: imageOpacity });


                // ────────────────────────────────────────────────────────────────
                // PHASE 2  (0.14 – 0.45):  Image shows through text cutout
                // ────────────────────────────────────────────────────────────────

                // Fade mask in early — content should appear quickly after scroll begins
                const maskOpacity =
                    p < 0.08 ? 0
                        : p < 0.16 ? (p - 0.08) / 0.08
                            : p < 0.48 ? 1
                                : p < 0.55 ? 1 - (p - 0.48) / 0.07
                                    : 0;

                // ── Entrance: smooth ease-in during intro phase (p 0.05 → 0.15) ──────
                // introProgress goes 0→1 with a power-2 ease feel
                const introRaw = Math.max(0, Math.min(1, (p - 0.05) / 0.10));
                const introProgress = introRaw * introRaw * (3 - 2 * introRaw); // smoothstep

                // Blur: 2px at start, 0 once intro is done
                const blurPx = p < 0.16 ? (1 - introProgress) * 2 : 0;

                // Text scale: 0.95 → 1.0 during intro, then zoom takes over
                let textScale = 0.95 + introProgress * 0.05;  // intro ease-in
                if (p > 0.44) {
                    const zoomP = Math.min(1, (p - 0.44) / 0.22);
                    textScale = 1 + Math.pow(zoomP, 2.2) * 400;
                }

                drawMask(maskOpacity, textScale, blurPx);

                // REMOVED: Parallax image logic and GSAP set for parallaxImgRef

                // REMOVED: fullBgOpacity fade logic. Image is always visible.
                // REMOVED: Any manual scale/y/zoomScale/translateY logic for fullBgRef

                // ────────────────────────────────────────────────────────────────
                // PHASE 4  (0.68 – 0.88):  Content fades in with upward motion
                // ────────────────────────────────────────────────────────────────
                const contentOpacity =
                    p < 0.68 ? 0
                        : p < 0.78 ? (p - 0.68) / 0.10
                            : p < 0.88 ? 1
                                : Math.max(0, 1 - (p - 0.88) / 0.10);

                const contentY =
                    p < 0.68 ? 40
                        : p < 0.78 ? 40 * (1 - (p - 0.68) / 0.10)
                            : 0;

                gsap.set(contentRef.current, { opacity: contentOpacity, y: contentY });

                // ────────────────────────────────────────────────────────────────
                // Overlay: lightens as content comes in, fades to black at end
                // ────────────────────────────────────────────────────────────────
                let overlayOpacity = 0.35;

                if (p >= 0.65 && p < 0.75) {
                    const t = (p - 0.65) / 0.10;
                    overlayOpacity = 0.35 - t * 0.15; // 0.35 → 0.20
                }
                if (p >= 0.75 && p < 0.88) {
                    overlayOpacity = 0.20; // hold light during content
                }
                // FULL cinematic blackout to hide pixel stretch
                if (p >= 0.94) {
                    const t = Math.min(1, (p - 0.94) / 0.06);
                    overlayOpacity = 0.20 + t * 0.80;

                    // ensure full black and prevent lower section bleed
                    if (t >= 1) {
                        gsap.set(fullBgRef.current, { opacity: 0 });
                    }
                }

                gsap.set(overlayRef.current, { opacity: overlayOpacity });
            },
        });

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, { scope: sectionRef });

    return (
        /*
         * Outer section: 700vh tall — this is the "scroll runway".
         * The sticky child locks to the viewport for the full runway.
         */
        <section
            ref={sectionRef}
            className="relative bg-black"
            style={{ height: "550vh" }}
        >

            {/* ── Sticky Viewport (CSS sticky, 100vh)
                  NO bg-black here — the canvas destination-out would expose it.
                  Black comes from the explicit z-[0] layer below.
            ─────────────────────────────────────────────────────────────────── */}
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden bg-black"
            >
                {/* ── Black base layer — lowest z, always present ── */}
                <div className="absolute inset-0 z-[0] bg-black" />


                {/* ══════════════════════════════════════════════════════════════
                    PHASE 2 — Parallax image sits BEHIND the canvas mask.
                    The canvas punches transparent text letterforms so the
                    image is visible only through the letters.
                    z-[2] (above black bg, below canvas)
                ══════════════════════════════════════════════════════════════ */}
                {/* REMOVED: Parallax image layer (no longer needed, avoids overlap) */}

                {/* ══════════════════════════════════════════════════════════════
                    Canvas mask — black overlay with text cutout.
                    z-[3] sits above parallaxImg, below fullBg.
                ══════════════════════════════════════════════════════════════ */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-[3] pointer-events-none"
                />

                {/* ══════════════════════════════════════════════════════════════
                    PHASE 3/4/5 — Full-screen image.
                    transform-origin is set to 60% (horizontal) / botY (vertical)
                    so zoom centres on the 'E' in ABESIT.
                ══════════════════════════════════════════════════════════════ */}
                <div
                    ref={fullBgRef}
                    className="absolute inset-0 z-[2] will-change-transform"
                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                >
                    <img
                        src={CAMPUS_IMAGE}
                        alt="ABESIT Campus Full"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: "center 50%" }}
                    />

                    {/* Variable dark overlay — lightest during zoom reveal,
                        ramps to full black in Phase 6 */}
                    <div
                        ref={overlayRef}
                        className="absolute inset-0 bg-black"
                        style={{ opacity: 0.45 }}
                    />

                    {/* Subtle red vignette at edges for cinematic feel */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse at center, transparent 30%, rgba(100,0,0,0.35) 100%)",
                        }}
                    />
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    PHASE 4 — Content layer: heading + description + accent
                    Fades in with upward motion. z-[5] (top of stack).
                ══════════════════════════════════════════════════════════════ */}
                <div
                    ref={contentRef}
                    className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-white pointer-events-none select-none opacity-0"
                >
                    {/* Eyebrow label */}
                    <p
                        className="uppercase tracking-[0.5em] text-[10px] md:text-xs text-red-500 font-semibold mb-5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Est. 2000 · Ghaziabad, India
                    </p>

                    {/* Main heading */}
                    <h2
                        className="text-center font-black uppercase leading-none mb-4"
                        style={{
                            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                            fontSize: "clamp(2.8rem, 9vw, 8rem)",
                            letterSpacing: "-0.025em",
                            textShadow: "0 4px 60px rgba(0,0,0,0.8)",
                        }}
                    >
                        ABESIT
                    </h2>

                    {/* Red rule */}
                    <div className="w-20 h-[2px] bg-gradient-to-r from-red-700 via-red-500 to-red-700 mb-6" />

                    {/* Description */}
                    <p
                        className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl text-center leading-relaxed px-6"
                        style={{ fontFamily: "'ITC Benguiat Std', serif", fontWeight: "normal" }}
                    >
                        ABES Institute of Technology (ABESIT), affiliated with Dr. A.P.J. Abdul Kalam
                        Technical University, Lucknow, is a premier technical institution located in
                        Ghaziabad, Uttar Pradesh. Since its establishment in 2007, the institute has
                        focused on delivering quality technical education while fostering innovation,
                        research, and industry-oriented learning.
                        <br /><br />
                        With strong academic programs in engineering and technology, ABESIT has
                        consistently encouraged students to participate in national-level innovation
                        challenges and hackathons, achieving remarkable performances over the years.
                        The institute promotes a culture of creativity and problem-solving through
                        dedicated innovation initiatives, modern infrastructure, and collaborations
                        that expose students to real-world technological advancements.
                    </p>

                    {/* Decorative bottom dots */}
                    <div className="flex gap-2 mt-8">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="block rounded-full bg-red-600"
                                style={{
                                    width: i === 1 ? "24px" : "6px",
                                    height: "6px",
                                    opacity: i === 1 ? 1 : 0.4,
                                }}
                            />
                        ))}
                    </div>
                </div>

            </div>{/* end sticky */}
        </section>
    );
}