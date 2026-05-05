"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const SEQUENCES = [
  "MKVLFALICFLLAGFSAADTPIRYNVITYEAHRQILQWHNLRPEKMSAS",
  "GDVEKGKKIFVQKCAQCHTVEKGGKHKTGPNLHGLFGRKTGQAPGFTYT",
  "MTEYKLVVVGAGGVGKSALTIQLIQNHFVDEYDPTIEDYRKQVVIDGETC",
];

const AA_NAMES: Record<string, string> = {
  A: "Alanine", R: "Arginine", N: "Asparagine", D: "Aspartate",
  C: "Cysteine", E: "Glutamate", Q: "Glutamine", G: "Glycine",
  H: "Histidine", I: "Isoleucine", L: "Leucine", K: "Lysine",
  M: "Methionine", F: "Phenylalanine", P: "Proline", S: "Serine",
  T: "Threonine", W: "Tryptophan", Y: "Tyrosine", V: "Valine",
};

function residueProperty(aa: string): string {
  if ("AILMFWVP".includes(aa)) return "Hydrophobic";
  if ("STNQYC".includes(aa)) return "Polar";
  if ("DE".includes(aa)) return "Negative";
  if ("KR".includes(aa)) return "Positive";
  if ("HG".includes(aa)) return "Special";
  return "";
}

function residueColor(aa: string): string {
  if ("AILMFWVP".includes(aa)) return "text-amber-400";
  if ("STNQYC".includes(aa)) return "text-emerald-300";
  if ("DEKR".includes(aa)) return "text-sky-300";
  if ("HG".includes(aa)) return "text-violet-300";
  return "text-fg-dim";
}

function buildRow(seq: string) {
  const chars = seq.split("");
  return chars.map((aa, i) => {
    if (aa === " ") return <span key={i} className="mx-0.5" />;
    if (aa === "·") return <span key={i} className="text-fg-dim/20 mx-1">·</span>;
    return (
      <span key={i} data-aa={aa} className={`${residueColor(aa)} px-[1px]`}>
        {aa}
      </span>
    );
  });
}

function ScrollingRow({ seq, speed, reverse, opacity }: { seq: string; speed: number; reverse: boolean; opacity: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const doubled = seq + "  ·  " + seq;

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    let raf: number;
    let offset = reverse ? -(el.scrollWidth / 2) : 0;

    function tick() {
      if (!el) return;
      const half = el.scrollWidth / 2;
      if (reverse) {
        offset += speed;
        if (offset >= 0) offset = -half;
      } else {
        offset -= speed;
        if (offset <= -half) offset = 0;
      }
      el.style.transform = `translateX(${offset}px)`;
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  return (
    <div
      ref={rowRef}
      className="flex whitespace-nowrap will-change-transform"
      style={{ opacity }}
    >
      {buildRow(doubled)}
    </div>
  );
}

const rowConfigs = [
  { seq: SEQUENCES[0] + "  ·  " + SEQUENCES[1] + "  ·  " + SEQUENCES[2], speed: 0.6, reverse: false, opacity: 0.6 },
  { seq: SEQUENCES[2] + "  ·  " + SEQUENCES[0] + "  ·  " + SEQUENCES[1], speed: 0.5, reverse: true, opacity: 0.4 },
  { seq: SEQUENCES[1] + "  ·  " + SEQUENCES[2] + "  ·  " + SEQUENCES[0], speed: 0.35, reverse: false, opacity: 0.25 },
];

function ProteinStrip() {
  const [tooltip, setTooltip] = useState<{ aa: string; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const aa = el?.getAttribute("data-aa");
    if (aa && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setTooltip({
        aa,
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-md bg-card border border-edge shadow-lg"
          style={{
            left: (containerRef.current?.getBoundingClientRect().left || 0) + tooltip.x,
            top: (containerRef.current?.getBoundingClientRect().top || 0) + tooltip.y - 44,
            transform: "translateX(-50%)",
          }}
        >
          <span className={`font-mono text-sm font-bold ${residueColor(tooltip.aa)}`}>
            {tooltip.aa}
          </span>
          <span className="text-fg text-xs ml-2">
            {AA_NAMES[tooltip.aa] || ""}
          </span>
          <span className="text-fg-muted text-[10px] ml-2">
            {residueProperty(tooltip.aa)}
          </span>
        </div>
      )}

      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div className="space-y-1.5 font-mono text-[13px] cursor-crosshair">
          {rowConfigs.map((r, i) => (
            <ScrollingRow key={i} seq={r.seq} speed={r.speed} reverse={r.reverse} opacity={r.opacity} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="mt-5 flex items-center gap-5 font-mono text-[10px] text-fg/80"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400/60" />
          Hydrophobic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-300/60" />
          Polar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-300/60" />
          Charged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-300/60" />
          Special
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-14">
      <div className="grain absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:py-32 lg:py-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/70"
        >
          UC Berkeley · Innovative Genomics Institute
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease }}
          className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Engineering food for
          <br />
          today, <span className="text-brand">not just the future.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease }}
          className="mt-8 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          We use AI and protein science to discover and engineer
          disease-resistant crop varieties. Non-GMO. From genome to field.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href="/platform"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-brand-dim"
          >
            How it works
          </a>
          <a
            href="/research"
            className="text-sm text-fg-muted underline underline-offset-4 decoration-fg-dim/30 transition-colors hover:text-fg hover:decoration-fg-muted"
          >
            Explore our data
          </a>
        </motion.div>

        <div className="mt-24 md:mt-32">
          <ProteinStrip />
        </div>
      </div>
    </section>
  );
}
