import { ParallaxHero } from "@/components/stranger-things/ParallaxHero";
import { AboutHacknovate } from "@/components/stranger-things/AboutHacknovate";
import { CinematicAbout } from "@/components/stranger-things/CinematicAbout";
import { AboutTracksSection } from "@/components/stranger-things/AboutTracksSection";
import  ContactSection  from "@/components/stranger-things/ContactSection";
import { CardScrollAnimation } from "@/components/stranger-things/CardScrollAnimation";
import { HacktropicaMemories } from "@/components/stranger-things/HacktropicaMemories";
import { AudioToggle } from "@/components/shared/AudioToggle";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen selection:bg-red-900 selection:text-white">
      <AudioToggle />
      <ParallaxHero />
      <AboutHacknovate />
      <CinematicAbout />
      <AboutTracksSection />
      <CardScrollAnimation />
      <HacktropicaMemories />
    </main>
  );
}
