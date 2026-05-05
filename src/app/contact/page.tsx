import Navbar from "@/components/Navbar";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact — HardyGreens",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <CTA />
      </main>
      <Footer />
    </>
  );
}
