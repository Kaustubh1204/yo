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
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !panelsWrapperRef.current || !bgRef.current) return;

    const totalPanels = TRACKS.length;
    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

    // Entrance animation for the background
    gsap.from(bgRef.current, {
      scale: 1.15,
      opacity: 0.4,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      }
    });

    // Main ScrollTrigger: slides panelsWrapper up via yPercent
    // NO SNAP — user controls scroll freely, no auto-scrolling
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const n = totalPanels;

        // Convert linear scroll progress into a stepped progress.
        // Divide the total scroll into N equal segments (N = number of tracks).
        // Each segment has a hold zone (panel stays locked) and a transition zone.
        const segmentSize = 1 / n;
        const holdRatio = 0.7;
        const transRatio = 0.3;

        let steppedProgress = 0;

        if (p >= 1) {
          steppedProgress = 1;
        } else {
          const currentSegment = Math.floor(p / segmentSize);
          const segmentProgress = (p - (currentSegment * segmentSize)) / segmentSize;

          if (currentSegment >= n - 1) {
            // Last panel: just stay at the end
            steppedProgress = 1;
          } else if (segmentProgress <= holdRatio) {
            // In the hold zone -> lock to current panel
            steppedProgress = currentSegment / (n - 1);
          } else {
            // In the transition zone -> fast slide to next panel
            const transProgress = (segmentProgress - holdRatio) / transRatio;
            const eased = transProgress * transProgress * (3 - 2 * transProgress);
            steppedProgress = (currentSegment + eased) / (n - 1);
          }
        }

        // Apply the stepped yPercent
        const maxTranslate = ((n - 1) / n) * 100;
        gsap.set(panelsWrapperRef.current, {
          yPercent: -maxTranslate * steppedProgress,
        });

        // Per-panel opacity based on stepped progress
        const panelProgress = steppedProgress * (n - 1);

        panels.forEach((panel, i) => {
          const offset = panelProgress - i;
          let opacity = 1;

          if (offset > 0.15) {
            opacity = Math.max(0, 1 - (offset - 0.15) / 0.35);
          } else if (offset < -0.15) {
            opacity = Math.max(0, 1 - (Math.abs(offset) - 0.15) / 0.35);
          }

          gsap.set(panel, { opacity });
        });
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      // Explicit height: each panel gets 100dvh of scroll distance
      style={{ height: `${TRACKS.length * 100}dvh` }}
      className="relative w-full bg-black font-serif z-30 -mt-[100vh] rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.9)]"
    >
      {/* Sticky fullscreen viewport — stays pinned while section scrolls */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden z-20">

        {/* Cinematic Background */}
        <div ref={bgRef} className="absolute inset-0 z-0 origin-center will-change-transform">
          <Image
            src="/assets/theme section/Whisk_3f03427f73c09e9a150484b9bb6f44faeg (1).png"
            alt="Hacknovate Cinematic Background"
            fill
            className="object-cover object-bottom"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
        </div>

        {/* Page Title */}
        <div className="absolute top-36 left-0 w-full z-40 px-6 md:px-12 pointer-events-none">
          <h2 className={`${trackFont.className} text-red-700 text-3xl md:text-5xl font-extrabold uppercase tracking-wider`}>
            Innovation Tracks
          </h2>
        </div>

        {/* Panels Wrapper — tall column, animated with translateY */}
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
                className="w-full h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-12 pt-52 md:pt-0 gap-4 md:gap-12 will-change-[opacity] relative"
                style={{ height: `${100 / TRACKS.length}%` }}
              >
                {/* Text Content — bottom-left, flush like jaquier.dev */}
                <div className="w-full md:w-3/5 flex flex-col justify-end text-left z-30 pb-4">
                  <h1 className={`${trackFont.className} text-white font-bold text-2xl md:text-4xl leading-tight mb-3 tracking-wide uppercase`}>
                    {track.title}
                  </h1>
                  <p className="text-gray-300/90 text-sm md:text-base leading-relaxed max-w-2xl">
                    {track.description}
                  </p>
                </div>

                {/* Character Image */}
                <div className="w-full md:w-[35%] h-[30vh] md:h-[70%] relative flex items-end justify-center md:justify-end z-20 pointer-events-none origin-bottom md:-translate-x-12 lg:-translate-x-16 flex-shrink-0">
                  <Image
                    src={track.image}
                    alt={track.title}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_0_30px_rgba(220,38,38,0.3)] filter brightness-90 contrast-125"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
