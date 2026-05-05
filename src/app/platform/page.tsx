import Navbar from "@/components/Navbar";
import Platform from "@/components/Platform";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Platform — HardyGreens",
};

export default function PlatformPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <Platform />
      </main>
      <Footer />
    </>
  );
}
