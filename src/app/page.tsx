import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBanner from "@/components/LogoBanner";
import Problem from "@/components/Problem";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoBanner />
        <Problem />
      </main>
      <Footer />
    </>
  );
}
