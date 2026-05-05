"use client";

import { motion } from "framer-motion";

const institutions = [
  "UC Berkeley",
  "UC Davis",
  "Cornell University",
  "Wageningen University",
  "USDA-ARS",
  "CGIAR",
  "IRRI",
  "ETH Zürich",
];

export default function LogoBanner() {
  const doubled = [...institutions, ...institutions];

  return (
    <section className="border-y border-edge py-6 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 mb-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim"
        >
          Trusted by researchers at
        </motion.p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex animate-scroll"
        >
          {doubled.map((name, i) => (
            <span
              key={i}
              className="flex-none px-8 text-sm font-medium text-fg-muted/60 whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
