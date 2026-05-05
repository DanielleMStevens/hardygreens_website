"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 40, suffix: "%", label: "of global crop yield destroyed by pathogens each year" },
  { value: 220, suffix: "B", label: "USD in annual agricultural losses worldwide" },
  { value: 10, suffix: "B", label: "people to feed by 2050 — crops must defend themselves" },
];

export default function Problem() {
  return (
    <section id="problem" className="py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
            The problem
          </p>
          <h2 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            Plant disease is the largest unresolved threat
            to global food security.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-fg-muted">
            Chemical pesticides are losing effectiveness. Traditional breeding
            takes decades. The world needs a way to engineer crop immunity that
            is fast, precise, and doesn&apos;t require genetic modification.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="font-display text-5xl font-bold text-fg">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 mb-4 h-px w-10 bg-brand/40" />
              <p className="text-sm leading-relaxed text-fg-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
