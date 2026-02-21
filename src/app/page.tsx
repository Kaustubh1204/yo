import { ParallaxHero } from "@/components/stranger-things/ParallaxHero";
import { TrailerReveal } from "@/components/stranger-things/TrailerReveal";
import { AudioToggle } from "@/components/shared/AudioToggle";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen selection:bg-red-900 selection:text-white">
      <AudioToggle />
      <ParallaxHero />
      <div className="relative z-10 bg-black">
        {/* The TrailerReveal component now handles its own internal spacing and pins itself */}
        <TrailerReveal />

        <section className="h-screen bg-black flex items-center justify-center border-t border-white/5">
          <div className="text-center space-y-4">
            <h2 className="text-white text-6xl font-serif tracking-[12px] opacity-80">COMING 2026</h2>
            <p className="text-red-600 font-serif text-xl tracking-widest uppercase">The Epic Conclusion</p>
          </div>
        </section>
      </div>
    </main>
  );
}
