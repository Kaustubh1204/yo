'use client';

import { useRef } from 'react';
import localFont from 'next/font/local';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const trackFont = localFont({
  src: [
    { path: '../../../public/font/BenguiatStd-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.woff', weight: '700', style: 'normal' },
    { path: '../../../public/font/BenguiatStd-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-track',
  display: 'swap',
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TRACKS = [
  {
    title: 'AI / Machine Learning',
    description: 'Build intelligent systems that learn, predict, and automate. From computer vision to NLP and analytics, design scalable AI solutions that transform data into decisions and real-world impact.',
    image: '/assets/character png/ell.png',
  },
  {
    title: 'Web3 & Blockchain',
    description: 'Redefine digital trust with decentralized applications, digital identity, and secure transactions. Build transparent, resilient systems shaping the next generation of the internet.',
    image: '/assets/character png/mike.png',
  },
  {
    title: 'Cyber Security',
    description: 'Protect digital ecosystems from evolving threats. Design secure architectures, threat detection systems, and resilient infrastructures ensuring trust across connected platforms.',
    image: '/assets/character png/dustin.png',
  },
  {
    title: 'AR / VR & Immersive Tech',
    description: 'Bridge the physical and digital worlds. Build immersive experiences for education, healthcare, training, entertainment, and beyond.',
    image: '/assets/character png/vill.png',
  },
  {
    title: 'Healthcare & Wellness',
    description: 'Innovate for human well-being. Develop scalable digital health solutions, mental health tools, preventive care systems, and accessible healthcare technologies.',
    image: '/assets/character png/nancy.png',
  },
  {
    title: 'Open Innovation',
    description: 'No limits. No predefined problems. Identify real-world challenges across domains and build practical, creative, scalable solutions with complete freedom.',
    image: '/assets/character png/vil_brother.png',
  },
];

export function AboutTracksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsWrapperRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingLineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !panelsWrapperRef.current || !bgRef.current) return;

    const totalPanels = TRACKS.length;
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];

    // ── Section entrance: background scale + heading fade-in ──────────────────
    gsap.from(bgRef.current, {
      scale: 1.12,
      opacity: 0.3,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      },
    });

    gsap.from(headingRef.current, {
      opacity: 0,
      y: -30,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    gsap.from(headingLineRef.current, {
      scaleX: 0,
      duration: 1,
      ease: 'power3.out',
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // ── Floating + slow-scale loop per character image ─────────────────────────
    images.forEach((img, i) => {
      const delay = i * 0.4;
      gsap.to(img, {
        y: -18,
        repeat: -1,
        yoyo: true,
        duration: 3.5 + i * 0.3,
        ease: 'sine.inOut',
        delay,
      });
      gsap.to(img, {
        scale: 1.04,
        repeat: -1,
        yoyo: true,
        duration: 5 + i * 0.2,
        ease: 'sine.inOut',
        delay: delay + 0.5,
      });
    });

    // ── Main scroll driver ─────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const n = totalPanels;

        const segmentSize = 1 / n;
        const holdRatio = 0.7;
        const transRatio = 0.3;

        let steppedProgress = 0;

        if (p >= 1) {
          steppedProgress = 1;
        } else {
          const currentSegment = Math.floor(p / segmentSize);
          const segmentProgress = (p - currentSegment * segmentSize) / segmentSize;

          if (currentSegment >= n - 1) {
            steppedProgress = 1;
          } else if (segmentProgress <= holdRatio) {
            steppedProgress = currentSegment / (n - 1);
          } else {
            const transProgress = (segmentProgress - holdRatio) / transRatio;
            const eased = transProgress * transProgress * (3 - 2 * transProgress);
            steppedProgress = (currentSegment + eased) / (n - 1);
          }
        }

        // Translate panels wrapper
        const maxTranslate = ((n - 1) / n) * 100;
        gsap.set(panelsWrapperRef.current, {
          yPercent: -maxTranslate * steppedProgress,
          force3D: true,
        });

        // Per-panel depth: opacity, scale, blur
        const panelProgress = steppedProgress * (n - 1);

        panels.forEach((panel, i) => {
          const offset = panelProgress - i;
          const absOffset = Math.abs(offset);

          // Opacity: active = 1, neighbours fade
          let opacity = 1;
          if (absOffset > 0.15) {
            opacity = Math.max(0, 1 - (absOffset - 0.15) / 0.35);
          }

          // Scale: active = 1.0, inactive = 0.96
          const scale = 1 - Math.min(absOffset, 1) * 0.04;

          // Blur: active = 0px, inactive up to 3px
          const blur = Math.min(absOffset, 1) * 3;

          gsap.set(panel, {
            opacity,
            scale,
            filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none',
            force3D: true,
          });
        });
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{ height: `${TRACKS.length * 100}dvh` }}
      className={`${trackFont.variable} relative w-full bg-black rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.95)]`}
    >
      {/* Sticky fullscreen viewport */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden z-20">

        {/* Cinematic Background */}
        <div ref={bgRef} className="absolute inset-0 z-0 origin-center will-change-transform">
          <Image
            src="/assets/theme section/Whisk_3f03427f73c09e9a150484b9bb6f44faeg (1).png"
            alt="Hacknovate Cinematic Background"
            fill
            className="object-cover object-bottom"
            quality={90}
            priority
          />
          {/* layered overlays for depth */}
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10 pointer-events-none" />
          {/* subtle red floor glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(120,0,0,0.18), transparent)' }}
          />
          {/* Bottom fade for smooth footer transition */}
          <div className="absolute bottom-0 left-0 right-0 h-64 z-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* ── Fixed Heading — outside panels, stays static ── */}
        <div
          ref={headingRef}
          className="absolute top-12 left-0 w-full z-40 px-8 md:px-14 pointer-events-none"
        >
          <p
            className="uppercase tracking-[0.45em] text-[10px] text-red-500 font-semibold mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Hacknovate 7.0
          </p>
          <h2
            className={`${trackFont.className} text-white text-4xl md:text-6xl font-extrabold uppercase tracking-wider leading-none`}
            style={{
              textShadow: '0 0 40px rgba(220,38,38,0.35), 0 2px 0 rgba(0,0,0,0.8)',
            }}
          >
            Innovation
            <br />
            <span className="text-red-600">Tracks</span>
          </h2>
          {/* animated red underline */}
          <div
            ref={headingLineRef}
            className="mt-4 h-[2px] w-24 bg-gradient-to-r from-red-700 via-red-500 to-transparent origin-left"
          />
        </div>

        {/* ── Panels Wrapper ── */}
        <div className="absolute top-0 left-0 w-full h-full z-20 overflow-hidden">
          <div
            ref={panelsWrapperRef}
            className="w-full will-change-transform"
            style={{ height: `${TRACKS.length * 100}%` }}
          >
            {TRACKS.map((track, idx) => (
              <div
                key={idx}
                ref={(el) => { panelRefs.current[idx] = el; }}
                className="w-full flex flex-col md:flex-row items-end md:items-center justify-center px-8 md:px-14 pt-52 md:pt-0 gap-8 md:gap-0 will-change-[opacity,transform,filter]"
                style={{ height: `${100 / TRACKS.length}%` }}
              >
                {/* ── Text Block ── */}
                <div className="w-full md:w-1/2 flex flex-col justify-center pt-20 md:pt-32 z-30">
                  {/* track number */}
                  <p
                    className="text-red-700 text-xs uppercase tracking-[0.5em] font-semibold mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {String(idx + 1).padStart(2, '0')} / {String(TRACKS.length).padStart(2, '0')}
                  </p>

                  {/* title */}
                  <h1
                    className={`${trackFont.className} text-white font-bold text-3xl md:text-5xl lg:text-6xl leading-tight mb-4 tracking-wide uppercase`}
                    style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}
                  >
                    {track.title}
                  </h1>

                  {/* red accent bar */}
                  <div className="w-14 h-[2px] bg-gradient-to-r from-red-600 to-red-900 mb-5" />

                  {/* description */}
                  <p
                    className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {track.description}
                  </p>
                </div>

                {/* ── Character Image ── */}
                <div className="w-full md:w-1/2 h-[35vh] md:h-[75%] relative flex items-end justify-center md:justify-end z-20 pointer-events-none flex-shrink-0">
                  <div
                    ref={(el) => { imageRefs.current[idx] = el; }}
                    className="relative w-full h-full will-change-transform"
                  >
                    <Image
                      src={track.image}
                      alt={track.title}
                      fill
                      className="object-contain object-bottom select-none"
                      style={{
                        filter: 'drop-shadow(0 0 50px rgba(220,38,38,0.4)) brightness(0.92) contrast(1.1)',
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
