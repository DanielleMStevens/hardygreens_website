"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const team = [
  {
    name: "Dr. Danielle Stevens",
    role: "CEO & Founder",
    bio: "Plant immunologist x machine learning researcher. PhD, UC Davis. Postdoc at UC Berkeley.",
    photo: "/team-danielle.jpg",
    initials: "DS",
  },
  {
    name: "Dr. Ksenia Krasileva",
    role: "Scientific Advisor",
    bio: "Associate Professor, UC Berkeley",
    photo: "/team-ksenia.jpg",
    initials: "KK",
  },
  {
    name: "Brian Su",
    role: "ML Advisor",
    bio: "",
    photo: "/team-brian.png",
    initials: "BS",
  },
];

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                The people behind HardyGreens.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                Scientists, engineers, and builders working at the intersection
                of AI and plant biology to protect the world&apos;s food supply.
              </p>
            </motion.div>

            <div className="mt-20 md:mt-24 flex gap-8 sm:gap-10">
              {team.map((member, i) => (
                <motion.div
                  key={`${member.name}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  style={{ width: 180 }}
                >
                  <div className="rounded-lg bg-bg-alt border border-edge overflow-hidden mb-4 flex items-center justify-center" style={{ width: 180, height: 180 }}>
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={180}
                        height={180}
                        className="w-full h-full object-cover object-center grayscale"
                      />
                    ) : (
                      <span className="font-display text-3xl font-bold text-brand/40">
                        {member.initials}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-fg leading-tight">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-brand">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-fg-muted">
                      {member.bio}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
