import { ParallaxHero } from "@/components/stranger-things/ParallaxHero";
import { AboutHacknovate } from "@/components/stranger-things/AboutHacknovate";
import { CinematicAbout } from "@/components/stranger-things/CinematicAbout";
import { AboutTracksSection } from "@/components/stranger-things/AboutTracksSection";
import { Footer } from "@/components/stranger-things/Footer";
import { AudioToggle } from "@/components/shared/AudioToggle";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen selection:bg-red-900 selection:text-white">
      <AudioToggle />
      <ParallaxHero />
      <AboutHacknovate />
      <CinematicAbout />
      <AboutTracksSection />
      <Footer />
    </main>
  );
}
