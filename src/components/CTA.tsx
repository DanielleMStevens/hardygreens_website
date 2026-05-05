"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            The next green revolution starts with better plant immunity.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-fg-muted">
            We&apos;re looking for collaborators, investors, and scientists who
            want to help protect the world&apos;s harvests.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="mailto:heardygreensai@gmail.com"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-brand-dim"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
