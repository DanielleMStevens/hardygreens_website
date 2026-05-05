"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

function useAnimatedValue(target: number, inView: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      setValue((1 - Math.pow(1 - p, 4)) * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.6, ease }}
      className={`group relative rounded-2xl border border-edge bg-card/30 p-6 md:p-8 overflow-hidden transition-colors duration-300 hover:border-brand/20 hover:bg-card/50 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StepLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="font-mono text-[11px] font-bold text-brand">{number}</span>
      <span className="font-mono text-[11px] text-fg-dim">{label}</span>
    </div>
  );
}

function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animated = useAnimatedValue(value, inView);

  return (
    <div ref={ref}>
      <span className="font-display text-3xl md:text-4xl font-bold text-brand">
        {Math.round(animated)}{suffix}
      </span>
      <p className="mt-1.5 text-xs text-fg-dim">{label}</p>
    </div>
  );
}

/* Pipeline flow animation inside the hero tile */
function PipelineFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const nodes = [
    { label: "Genome Mining", icon: "◇" },
    { label: "Structure AI", icon: "△" },
    { label: "Edit Design", icon: "○" },
    { label: "Validation", icon: "□" },
  ];

  return (
    <div ref={ref} className="flex items-center gap-2 mt-8">
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease }}
            className="flex items-center gap-2 rounded-full border border-edge bg-bg-alt/80 px-3 py-1.5"
          >
            <span className="text-brand text-xs">{node.icon}</span>
            <span className="font-mono text-[10px] text-fg-muted whitespace-nowrap">{node.label}</span>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
              className="w-4 h-px bg-brand/30 origin-left"
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* Genome bars for Discover tile */
function GenomeBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const crops = [
    { name: "Wheat", pct: 85 },
    { name: "Rice", pct: 72 },
    { name: "Soybean", pct: 64 },
    { name: "Tomato", pct: 48 },
    { name: "Cassava", pct: 35 },
  ];

  return (
    <div ref={ref} className="mt-6 space-y-2.5">
      {crops.map((c, i) => (
        <div key={c.name} className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-fg-dim w-14 text-right">{c.name}</span>
          <div className="flex-1 h-1 rounded-full bg-edge overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-brand/50 group-hover:bg-brand/70 transition-colors"
              initial={{ width: 0 }}
              animate={inView ? { width: `${c.pct}%` } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Domain bar for Analyze tile */
function DomainBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<string | null>(null);

  const domains = [
    { id: "sp", label: "SP", w: "2%", color: "bg-fg-dim/30" },
    { id: "lrr", label: "LRR Ectodomain", w: "64%", color: "bg-brand/50" },
    { id: "tm", label: "TM", w: "2%", color: "bg-fg-dim/30" },
    { id: "kinase", label: "Kinase", w: "32%", color: "bg-pink-400/40" },
  ];

  return (
    <div ref={ref} className="mt-6">
      <div className="flex h-6 rounded overflow-hidden gap-px">
        {domains.map((d, i) => (
          <motion.div
            key={d.id}
            className={`${d.color} cursor-pointer transition-all ${hovered && hovered !== d.id ? "opacity-30" : "opacity-100"}`}
            style={{ width: d.w }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease }}
            onMouseEnter={() => setHovered(d.id)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-fg-dim/40">
        <span>1</span><span>400</span><span>800</span><span>1173 aa</span>
      </div>
      <p className="mt-3 font-mono text-[10px] text-fg-dim">
        {hovered === "lrr" ? "28 leucine-rich repeats — pathogen sensing surface" :
         hovered === "kinase" ? "Intracellular signaling — activates immune defense" :
         "FLS2 receptor · PDB 4MN8 · hover to explore"}
      </p>
    </div>
  );
}

/* Sequence snippet for Design tile */
function SequenceSnippet() {
  const [showEdits, setShowEdits] = useState(false);
  const bases = "ATCGATCGTTACGATCGATCG".split("");
  const edits: Record<number, string> = { 2: "G", 5: "C", 9: "A", 13: "T", 16: "C" };
  const colors: Record<string, string> = { A: "text-emerald-400", T: "text-amber-400", C: "text-sky-400", G: "text-violet-400" };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-fg-dim">20-nt editing window</span>
        <button
          onClick={() => setShowEdits(!showEdits)}
          className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-brand/20 text-brand hover:bg-brand/10 transition-colors"
        >
          {showEdits ? "Original" : "Show edits"}
        </button>
      </div>
      <div className="font-mono text-sm flex gap-0.5 overflow-hidden">
        {bases.map((b, i) => {
          const edited = showEdits && edits[i];
          const display = edited || b;
          return (
            <motion.span
              key={i}
              className={`w-4 text-center ${colors[display] || "text-fg-dim"} ${edited ? "font-bold" : ""}`}
              animate={edited ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {display}
            </motion.span>
          );
        })}
      </div>
      {showEdits && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2"
        >
          <span className="font-mono text-[10px] text-brand font-bold">5 edits</span>
          <span className="px-2 py-0.5 rounded bg-brand/10 font-mono text-[9px] text-brand">Non-GMO</span>
        </motion.div>
      )}
    </div>
  );
}

/* Accuracy ring for Validate tile */
function AccuracyRing() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const accuracy = useAnimatedValue(73, inView, 2200);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (accuracy / 100) * circ;

  return (
    <div ref={ref} className="mt-6 flex items-center gap-6">
      <div className="relative flex-none">
        <svg width="88" height="88" className="-rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-edge)" strokeWidth="5" />
          <motion.circle
            cx="44" cy="44" r={r}
            fill="none" stroke="var(--color-brand)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={inView ? offset : circ}
            animate={{ strokeDashoffset: inView ? offset : circ }}
            transition={{ duration: 2.2, ease }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg font-bold text-brand">{Math.round(accuracy)}%</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div>
          <div className="flex justify-between font-mono text-[10px] text-fg-dim mb-1">
            <span>Sensitivity</span><span>81%</span>
          </div>
          <div className="h-1 rounded-full bg-edge overflow-hidden">
            <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={inView ? { width: "81%" } : {}} transition={{ duration: 2, ease }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[10px] text-fg-dim mb-1">
            <span>Specificity</span><span>68%</span>
          </div>
          <div className="h-1 rounded-full bg-edge overflow-hidden">
            <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={inView ? { width: "68%" } : {}} transition={{ duration: 2.2, ease }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Platform() {
  return (
    <>
      {/* Bento grid */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-6xl px-6">

          {/* Row 1: Hero + AI badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Tile className="md:col-span-2" delay={0}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand mb-4">Our Platform</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight">
                AI agents that engineer disease resistance.
              </h1>
              <p className="mt-5 text-sm md:text-base leading-relaxed text-fg-muted max-w-lg">
                An autonomous pipeline — from genome mining to field-ready candidates — powered by agentic AI at every step.
              </p>
              <PipelineFlow />
            </Tile>

            <Tile delay={0.1} className="flex flex-col justify-between">
              <div>
                <p className="font-mono text-[11px] text-fg-dim mb-3">What makes us different</p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  Traditional breeding: <span className="text-fg font-medium">7–15 years.</span>
                </p>
                <p className="text-sm leading-relaxed text-fg-muted mt-1">
                  Our AI pipeline: <span className="text-brand font-medium">weeks.</span>
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-pale px-3 py-1.5 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="font-mono text-[10px] text-brand">Agentic AI</span>
              </div>
            </Tile>
          </div>

          {/* Row 2: Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { value: 1028, suffix: "+", label: "Plant genomes" },
              { value: 8, suffix: "", label: "Global regions" },
              { value: 73, suffix: "%", label: "Prediction accuracy" },
              { value: 20, suffix: "nt", label: "Non-GMO window" },
            ].map((s, i) => (
              <Tile key={s.label} delay={0.1 + i * 0.05}>
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </Tile>
            ))}
          </div>

          {/* Row 3: Discover + Analyze */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Tile delay={0.1}>
              <StepLabel number="01" label="Genome Mining" />
              <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                Nature already solved it. Our AI finds where.
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-fg-muted">
                Agents scan 1,000+ plant genomes for natural immune receptors — PRRs that evolution optimized over millions of years.
              </p>
              <GenomeBars />
            </Tile>

            <Tile delay={0.15}>
              <StepLabel number="02" label="Structure Prediction" />
              <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                Every receptor has a shape. AI maps it in minutes.
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-fg-muted">
                AlphaFold2 predicts 3D structures to identify the surfaces where pathogen recognition occurs.
              </p>
              <DomainBar />
            </Tile>
          </div>

          {/* Row 4: Design (wide) + Validate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Tile delay={0.1} className="md:col-span-2">
              <StepLabel number="03" label="Precision Editing" />
              <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                5 edits. 20 nucleotides. Non-GMO.
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-fg-muted max-w-md">
                Protein language models propose precise mutations that strengthen pathogen binding — all within the 20-nt regulatory threshold.
              </p>
              <SequenceSnippet />
            </Tile>

            <Tile delay={0.15}>
              <StepLabel number="04" label="In Silico Validation" />
              <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">
                Predict before planting.
              </h3>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-fg-muted">
                mamp-ml validates candidates against 2,135 receptor-pathogen pairs.
              </p>
              <AccuracyRing />
            </Tile>
          </div>

          {/* Row 5: CTA */}
          <Tile delay={0.1} className="mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold">
                  Ready to protect your crops?
                </h3>
                <p className="mt-2 text-sm text-fg-muted">
                  We&apos;re working with breeders to bring AI-designed disease resistance to wheat, rice, and soybean.
                </p>
              </div>
              <div className="flex items-center gap-4 flex-none">
                <a
                  href="/contact"
                  className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-brand-dim"
                >
                  Get in touch
                </a>
                <a
                  href="/research"
                  className="text-sm text-fg-muted underline underline-offset-4 decoration-fg-dim/30 hover:text-fg hover:decoration-fg-muted transition-colors"
                >
                  Research
                </a>
              </div>
            </div>

            {/* Plant variety line art */}
            <div className="mt-8 pt-6 border-t border-edge flex items-end justify-around gap-2 overflow-hidden">
              {/* Wheat */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}>
                <path d="M30 115 L30 42" stroke="#F59E0B" strokeWidth="1.3" />
                <ellipse cx="30" cy="75" rx="1.8" ry="0.7" stroke="#F59E0B" strokeWidth="0.7" />
                <path d="M30 72 C34 66 40 62 46 60 C44 63 38 66 30 70" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.04" />
                <path d="M30 85 C26 80 20 78 14 78 C16 80 22 82 30 84" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.04" />
                <path d="M30 42 L30 10" stroke="#F59E0B" strokeWidth="0.9" />
                {/* Spikelets — smooth ellipses along rachis */}
                <ellipse cx="25" cy="39" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(-5 25 39)" />
                <ellipse cx="35" cy="36" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(5 35 36)" />
                <ellipse cx="25" cy="33" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(-5 25 33)" />
                <ellipse cx="35" cy="30" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(5 35 30)" />
                <ellipse cx="25" cy="27" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(-5 25 27)" />
                <ellipse cx="35" cy="24" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(5 35 24)" />
                <ellipse cx="25" cy="21" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(-5 25 21)" />
                <ellipse cx="35" cy="18" rx="5" ry="2" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(5 35 18)" />
                <ellipse cx="25" cy="15" rx="4" ry="1.8" stroke="#F59E0B" strokeWidth="0.7" fill="#F59E0B" fillOpacity="0.05" transform="rotate(-5 25 15)" />
                {/* Awns — smooth curves */}
                <path d="M20 39 C17 34 14 30 12 26" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M40 36 C43 31 45 27 47 23" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M20 33 C17 28 15 24 13 20" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M40 30 C43 25 45 21 46 17" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M20 27 C18 23 16 19 15 15" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M40 24 C42 20 44 16 45 12" stroke="#F59E0B" strokeWidth="0.45" opacity="0.45" />
                <path d="M20 21 C18 17 17 13 16 9" stroke="#F59E0B" strokeWidth="0.45" opacity="0.4" />
                <path d="M40 18 C42 14 43 10 43 6" stroke="#F59E0B" strokeWidth="0.45" opacity="0.4" />
                <path d="M21 15 C19 11 18 7 17 3" stroke="#F59E0B" strokeWidth="0.45" opacity="0.4" />
                <path d="M30 10 C30 7 30 4 30 2" stroke="#F59E0B" strokeWidth="0.45" opacity="0.4" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#F59E0B" opacity="0.6">Wheat</text>
              </motion.svg>

              {/* Rice */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
                <path d="M30 115 L30 40" stroke="#4ade80" strokeWidth="1.2" />
                <path d="M30 80 C24 74 16 70 12 68 C14 72 22 76 30 78" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.04" />
                <path d="M30 65 C36 60 44 57 48 56 C46 59 38 62 30 64" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.04" />
                {/* Panicle — graceful arc */}
                <path d="M30 40 C32 32 35 24 34 16 C33 10 30 8 28 7" stroke="#4ade80" strokeWidth="0.9" />
                {/* Panicle branches with grains */}
                <path d="M33 30 C36 31 40 34 42 36" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="43" cy="37" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <ellipse cx="41" cy="40" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M34 25 C38 26 42 28 44 30" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="45" cy="31" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <ellipse cx="43" cy="33" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M35 20 C38 20 42 21 44 23" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="45" cy="24" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M34 15 C37 14 40 15 42 16" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="43" cy="17" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M32 11 C34 9 37 8 39 10" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="39.5" cy="11" rx="1.5" ry="2" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M31 34 C28 35 24 38 22 40" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="21" cy="41" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <path d="M32 28 C29 28 25 29 23 31" stroke="#4ade80" strokeWidth="0.55" />
                <ellipse cx="22" cy="32" rx="1.5" ry="2.5" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.08" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#4ade80" opacity="0.6">Rice</text>
              </motion.svg>

              {/* Tomato */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }}>
                <path d="M30 115 C29 95 28 80 28 70 C28 58 29 50 30 45" stroke="#4ade80" strokeWidth="1.2" />
                {/* Compound leaf left */}
                <path d="M28 85 C24 83 18 82 14 84" stroke="#4ade80" strokeWidth="0.65" />
                <path d="M14 84 C12 81 10 81 8 82 C10 84 12 84 14 84" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                <path d="M18 83 C16 80 14 80 12 81 C14 82 16 83 18 83" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                <path d="M22 83 C21 80 19 80 17 81 C19 82 21 83 22 83" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                {/* Compound leaf right */}
                <path d="M29 72 C33 69 39 68 44 70" stroke="#4ade80" strokeWidth="0.65" />
                <path d="M44 70 C46 67 48 67 50 68 C48 70 46 70 44 70" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                <path d="M40 69 C42 66 44 66 46 67 C44 69 42 69 40 69" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                <path d="M36 69 C37 66 39 66 41 67 C39 69 37 69 36 69" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.05" />
                {/* Fruit truss */}
                <path d="M30 48 C27 45 24 42 22 40" stroke="#4ade80" strokeWidth="0.7" />
                <circle cx="20" cy="32" r="8" stroke="#EF4444" strokeWidth="0.9" fill="#EF4444" fillOpacity="0.06" />
                <path d="M20 24 C18 28 18 36 20 40" stroke="#EF4444" strokeWidth="0.35" opacity="0.2" />
                <path d="M14 28 C17 30 23 30 26 28" stroke="#EF4444" strokeWidth="0.35" opacity="0.2" />
                <path d="M13 34 C16 32 24 32 27 34" stroke="#EF4444" strokeWidth="0.35" opacity="0.2" />
                {/* Calyx — gentle curves instead of straight lines */}
                <path d="M20 24 C19 22 18 20 17 19" stroke="#4ade80" strokeWidth="0.65" />
                <path d="M20 24 C21 22 22 20 23 19" stroke="#4ade80" strokeWidth="0.65" />
                <path d="M20 24 C18 22 16 21 15 21" stroke="#4ade80" strokeWidth="0.55" opacity="0.7" />
                <path d="M20 24 C22 22 24 21 25 21" stroke="#4ade80" strokeWidth="0.55" opacity="0.7" />
                <path d="M20 24 C20 22 20 20 20 18" stroke="#4ade80" strokeWidth="0.65" />
                {/* Second tomato */}
                <path d="M22 40 C26 39 30 37 34 36" stroke="#4ade80" strokeWidth="0.55" />
                <circle cx="38" cy="33" r="5" stroke="#EF4444" strokeWidth="0.7" fill="#EF4444" fillOpacity="0.04" />
                <path d="M38 28 C37.5 27 37 26 37 25" stroke="#4ade80" strokeWidth="0.45" />
                <path d="M38 28 C38.5 27 39 26 39 25" stroke="#4ade80" strokeWidth="0.45" />
                <path d="M38 28 C38 27 38 26 38 24" stroke="#4ade80" strokeWidth="0.45" />
                {/* Small green tomato */}
                <circle cx="42" cy="42" r="3" stroke="#4ade80" strokeWidth="0.55" fill="#4ade80" fillOpacity="0.04" />
                <path d="M34 36 C37 39 40 41 42 42" stroke="#4ade80" strokeWidth="0.45" opacity="0.5" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#EF4444" opacity="0.6">Tomato</text>
              </motion.svg>

              {/* Soybean */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}>
                <path d="M30 115 L30 18" stroke="#A78BFA" strokeWidth="1.2" />
                {/* Top trifoliate */}
                <path d="M30 20 L30 14" stroke="#A78BFA" strokeWidth="0.7" />
                <ellipse cx="30" cy="10" rx="5" ry="6" stroke="#A78BFA" strokeWidth="0.6" fill="#A78BFA" fillOpacity="0.04" />
                <path d="M30 14 C24 14 20 10 18 8" stroke="#A78BFA" strokeWidth="0.6" />
                <ellipse cx="16" cy="6" rx="4" ry="5" stroke="#A78BFA" strokeWidth="0.6" fill="#A78BFA" fillOpacity="0.04" transform="rotate(-15 16 6)" />
                <path d="M30 14 C36 14 40 10 42 8" stroke="#A78BFA" strokeWidth="0.6" />
                <ellipse cx="44" cy="6" rx="4" ry="5" stroke="#A78BFA" strokeWidth="0.6" fill="#A78BFA" fillOpacity="0.04" transform="rotate(15 44 6)" />
                <line x1="30" y1="6" x2="30" y2="14" stroke="#A78BFA" strokeWidth="0.3" opacity="0.25" />
                <line x1="16" y1="3" x2="17" y2="9" stroke="#A78BFA" strokeWidth="0.3" opacity="0.25" />
                <line x1="44" y1="3" x2="43" y2="9" stroke="#A78BFA" strokeWidth="0.3" opacity="0.25" />
                {/* Left trifoliate */}
                <path d="M30 40 C24 38 18 36 16 34" stroke="#A78BFA" strokeWidth="0.6" />
                <ellipse cx="14" cy="32" rx="4" ry="5" stroke="#A78BFA" strokeWidth="0.55" fill="#A78BFA" fillOpacity="0.03" transform="rotate(-20 14 32)" />
                <path d="M18 36 C14 37 10 36 8 34" stroke="#A78BFA" strokeWidth="0.55" />
                <ellipse cx="6" cy="32" rx="3.5" ry="4.5" stroke="#A78BFA" strokeWidth="0.55" fill="#A78BFA" fillOpacity="0.03" transform="rotate(-30 6 32)" />
                <path d="M18 36 C16 39 12 41 10 40" stroke="#A78BFA" strokeWidth="0.55" />
                <ellipse cx="8" cy="39" rx="3.5" ry="4.5" stroke="#A78BFA" strokeWidth="0.55" fill="#A78BFA" fillOpacity="0.03" transform="rotate(10 8 39)" />
                {/* Right trifoliate */}
                <path d="M30 55 C36 53 42 50 44 48" stroke="#A78BFA" strokeWidth="0.6" />
                <ellipse cx="46" cy="46" rx="4" ry="5" stroke="#A78BFA" strokeWidth="0.55" fill="#A78BFA" fillOpacity="0.03" transform="rotate(20 46 46)" />
                <path d="M42 50 C46 50 50 48 52 46" stroke="#A78BFA" strokeWidth="0.55" />
                <ellipse cx="54" cy="44" rx="3.5" ry="4.5" stroke="#A78BFA" strokeWidth="0.55" fill="#A78BFA" fillOpacity="0.03" transform="rotate(30 54 44)" />
                {/* Pods — smooth curved shapes */}
                <path d="M30 68 C27 67 24 64 23 62 C25 63 28 66 30 67" stroke="#A78BFA" strokeWidth="0.7" fill="#A78BFA" fillOpacity="0.06" />
                <circle cx="25.5" cy="63.5" r="1" fill="#A78BFA" fillOpacity="0.12" />
                <circle cx="26.5" cy="65.5" r="1" fill="#A78BFA" fillOpacity="0.12" />
                <path d="M30 72 C27 71 25 68 24 66 C26 67 28 70 30 71" stroke="#A78BFA" strokeWidth="0.7" fill="#A78BFA" fillOpacity="0.06" />
                <path d="M30 76 C33 75 36 72 37 70 C35 71 33 74 30 75" stroke="#A78BFA" strokeWidth="0.7" fill="#A78BFA" fillOpacity="0.06" />
                <circle cx="35.5" cy="71.5" r="1" fill="#A78BFA" fillOpacity="0.12" />
                <circle cx="34.5" cy="73.5" r="1" fill="#A78BFA" fillOpacity="0.12" />
                <path d="M30 80 C33 79 35 76 36 74 C34 75 32 78 30 79" stroke="#A78BFA" strokeWidth="0.7" fill="#A78BFA" fillOpacity="0.06" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#A78BFA" opacity="0.6">Soybean</text>
              </motion.svg>

              {/* Cassava */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
                <path d="M30 115 L30 55" stroke="#38BDF8" strokeWidth="1.4" />
                <ellipse cx="30" cy="70" rx="1.5" ry="0.6" stroke="#38BDF8" strokeWidth="0.5" opacity="0.35" />
                <ellipse cx="30" cy="80" rx="1.5" ry="0.6" stroke="#38BDF8" strokeWidth="0.5" opacity="0.35" />
                <ellipse cx="30" cy="90" rx="1.5" ry="0.6" stroke="#38BDF8" strokeWidth="0.5" opacity="0.35" />
                <path d="M30 55 L30 34" stroke="#38BDF8" strokeWidth="0.8" />
                {/* Palmate leaf — smooth curves radiating out */}
                <path d="M30 34 C30 24 30 14 30 6" stroke="#38BDF8" strokeWidth="0.8" />
                <path d="M30 34 C27 26 20 16 15 6" stroke="#38BDF8" strokeWidth="0.8" />
                <path d="M30 34 C33 26 40 16 45 6" stroke="#38BDF8" strokeWidth="0.8" />
                <path d="M30 34 C24 28 14 18 6 10" stroke="#38BDF8" strokeWidth="0.7" opacity="0.65" />
                <path d="M30 34 C36 28 46 18 54 10" stroke="#38BDF8" strokeWidth="0.7" opacity="0.65" />
                <path d="M30 34 C22 30 12 26 4 20" stroke="#38BDF8" strokeWidth="0.6" opacity="0.45" />
                <path d="M30 34 C38 30 48 26 56 20" stroke="#38BDF8" strokeWidth="0.6" opacity="0.45" />
                {/* Second smaller leaf */}
                <path d="M30 65 C34 61 38 56 40 52" stroke="#38BDF8" strokeWidth="0.55" />
                <path d="M40 52 C40 48 40 44 40 40" stroke="#38BDF8" strokeWidth="0.45" opacity="0.45" />
                <path d="M40 52 C37 48 34 44 32 40" stroke="#38BDF8" strokeWidth="0.45" opacity="0.45" />
                <path d="M40 52 C43 48 46 44 48 40" stroke="#38BDF8" strokeWidth="0.45" opacity="0.45" />
                {/* Tuberous roots */}
                <path d="M30 115 C27 114 23 112 20 108 C22 110 26 113 30 114" stroke="#38BDF8" strokeWidth="0.6" fill="#38BDF8" fillOpacity="0.04" opacity="0.45" />
                <path d="M30 115 C33 114 37 112 40 108 C38 110 34 113 30 114" stroke="#38BDF8" strokeWidth="0.6" fill="#38BDF8" fillOpacity="0.04" opacity="0.45" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#38BDF8" opacity="0.6">Cassava</text>
              </motion.svg>

              {/* Maize */}
              <motion.svg viewBox="0 0 60 120" className="w-10 md:w-14 flex-none hidden sm:block" fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.6 }}>
                <path d="M30 115 L30 20" stroke="#FB923C" strokeWidth="1.5" />
                {/* Tassel — smooth branching */}
                <path d="M30 20 L30 8" stroke="#FB923C" strokeWidth="1" />
                <path d="M30 10 C27 7 24 4 22 2" stroke="#FB923C" strokeWidth="0.55" opacity="0.55" />
                <path d="M30 10 C33 7 36 4 38 2" stroke="#FB923C" strokeWidth="0.55" opacity="0.55" />
                <path d="M30 12 C26 9 22 7 18 6" stroke="#FB923C" strokeWidth="0.55" opacity="0.45" />
                <path d="M30 12 C34 9 38 7 42 6" stroke="#FB923C" strokeWidth="0.55" opacity="0.45" />
                <path d="M30 14 C26 12 22 11 18 10" stroke="#FB923C" strokeWidth="0.45" opacity="0.35" />
                <path d="M30 14 C34 12 38 11 42 10" stroke="#FB923C" strokeWidth="0.45" opacity="0.35" />
                <path d="M30 8 C30 6 30 4 30 2" stroke="#FB923C" strokeWidth="0.55" opacity="0.55" />
                <path d="M30 8 C28 5 27 3 26 1" stroke="#FB923C" strokeWidth="0.45" opacity="0.45" />
                <path d="M30 8 C32 5 33 3 34 1" stroke="#FB923C" strokeWidth="0.45" opacity="0.45" />
                {/* Broad arching leaves — smooth curves */}
                <path d="M30 35 C24 30 16 27 10 26 C8 30 14 30 24 32" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.03" />
                <path d="M30 50 C36 44 44 41 50 40 C52 44 46 44 36 46" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.03" />
                <path d="M30 70 C24 66 14 64 8 66 C6 70 14 68 24 68" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.03" />
                <path d="M30 85 C36 80 46 78 50 80 C52 84 46 82 36 82" stroke="#4ade80" strokeWidth="0.7" fill="#4ade80" fillOpacity="0.03" />
                {/* Ear of corn */}
                <path d="M30 55 C33 54 35 53 36 52" stroke="#4ade80" strokeWidth="0.6" />
                <ellipse cx="42" cy="50" rx="5" ry="10" stroke="#FB923C" strokeWidth="0.9" fill="#FB923C" fillOpacity="0.06" transform="rotate(-10 42 50)" />
                <line x1="40" y1="42" x2="40" y2="58" stroke="#FB923C" strokeWidth="0.35" opacity="0.2" />
                <line x1="42" y1="41" x2="42" y2="59" stroke="#FB923C" strokeWidth="0.35" opacity="0.2" />
                <line x1="44" y1="42" x2="44" y2="58" stroke="#FB923C" strokeWidth="0.35" opacity="0.2" />
                {/* Husk */}
                <path d="M36 52 C35 48 33 44 32 42 C34 45 36 49 37 54" stroke="#4ade80" strokeWidth="0.65" fill="#4ade80" fillOpacity="0.04" />
                <path d="M36 52 C35 56 33 58 32 60 C34 58 36 55 36 52" stroke="#4ade80" strokeWidth="0.65" fill="#4ade80" fillOpacity="0.04" />
                {/* Silk */}
                <path d="M42 40 C41 37 39 34 38 31" stroke="#FB923C" strokeWidth="0.35" opacity="0.35" />
                <path d="M42 40 C42 36 42 33 42 29" stroke="#FB923C" strokeWidth="0.35" opacity="0.35" />
                <path d="M42 40 C43 37 45 34 46 31" stroke="#FB923C" strokeWidth="0.35" opacity="0.35" />
                <text x="30" y="119" textAnchor="middle" fontSize="5" fill="#FB923C" opacity="0.6">Maize</text>
              </motion.svg>
            </div>
          </Tile>

        </div>
      </section>
    </>
  );
}
