"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const LAST_UPDATED = "May 4, 2026";

function useAnimatedValue(target: number, inView: boolean, duration = 2200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf: number;

    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setValue(e * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
}

function StatCard({
  value,
  suffix,
  label,
  detail,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  detail: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const animatedValue = useAnimatedValue(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-lg border border-edge bg-bg-alt/50 p-6 group hover:border-brand/20 transition-colors"
    >
      <div className="font-display text-4xl font-bold text-brand sm:text-5xl">
        {Math.round(animatedValue).toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-fg">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {detail}
      </p>
    </motion.div>
  );
}

const stats = [
  {
    value: 1028,
    suffix: "",
    label: "Genome accessions indexed",
    detail: "From GenBank (795) and RefSeq (233), spanning 644 unique plant species.",
  },
  {
    value: 67,
    suffix: "",
    label: "Genomes fully processed",
    detail: "42 successful + 25 passed quality filters. 842 additional accessions pending annotation.",
  },
  {
    value: 17354,
    suffix: "",
    label: "PRRs identified",
    detail: "Pattern Recognition Receptors: 11,761 receptor-like kinases (RLKs) and 5,593 receptor-like proteins (RLPs).",
  },
  {
    value: 644,
    suffix: "",
    label: "Unique plant species",
    detail: "Across 4 lineages: eudicots, monocots, embryophytes, and chlorophytes.",
  },
];

const topHits = [
  { species: "Camelina sativa", prrs: 553, type: "Oilseed" },
  { species: "Camellia sinensis", prrs: 504, type: "Tea" },
  { species: "Beta vulgaris", prrs: 488, type: "Sugar beet" },
  { species: "Brassica napus", prrs: 487, type: "Rapeseed" },
  { species: "Benincasa hispida", prrs: 474, type: "Wax gourd" },
  { species: "Camellia sinensis var. sinensis", prrs: 460, type: "Tea" },
  { species: "Camellia fascicularis", prrs: 418, type: "Camellia" },
  { species: "Arachis stenosperma", prrs: 350, type: "Wild peanut" },
  { species: "Aegilops tauschii", prrs: 349, type: "Wheat relative" },
  { species: "Alnus glutinosa", prrs: 346, type: "Alder" },
];

const maxPrr = 553;

const lineages = [
  { name: "Eudicots", count: 90, pct: 83 },
  { name: "Monocots (Liliopsida)", count: 8, pct: 7 },
  { name: "Embryophytes", count: 7, pct: 7 },
  { name: "Chlorophytes", count: 3, pct: 3 },
];

function TopSpeciesTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref}>
      <div className="space-y-2">
        {topHits.map((hit, i) => (
          <motion.div
            key={hit.species}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="flex items-center gap-4 group"
          >
            <span className="font-mono text-[10px] text-fg-dim w-5 text-right">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-fg-muted group-hover:text-fg transition-colors truncate">
                  <em>{hit.species}</em>
                  <span className="text-fg-dim ml-2 not-italic">({hit.type})</span>
                </span>
                <span className="font-mono text-xs text-brand font-bold flex-none ml-3">{hit.prrs}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-edge overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-brand/50 group-hover:bg-brand/70 transition-colors"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(hit.prrs / maxPrr) * 100}%` } : {}}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PipelineStatus() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const stages = [
    { label: "Pending", count: 842, color: "bg-fg-dim/30" },
    { label: "Rejected (BUSCO)", count: 94, color: "bg-amber-400/40" },
    { label: "Skipped (too large)", count: 23, color: "bg-fg-dim/20" },
    { label: "Passed", count: 25, color: "bg-brand/40" },
    { label: "Success", count: 42, color: "bg-brand" },
  ];

  const total = 1028;

  return (
    <div ref={ref}>
      <div className="flex h-5 rounded overflow-hidden gap-px">
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            className={`${s.color} relative group/seg cursor-default`}
            style={{ width: `${(s.count / total) * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-card border border-edge text-[10px] font-mono text-fg whitespace-nowrap opacity-0 group-hover/seg:opacity-100 transition-opacity pointer-events-none z-10">
              {s.label}: {s.count}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {stages.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-[10px] font-mono text-fg-dim">
            <span className={`w-2 h-2 rounded-sm ${s.color}`} />
            {s.label} ({s.count})
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <section className="py-28 md:py-40 pb-10 md:pb-14">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Plant immune receptor database.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                We&apos;re building an open catalog of plant defense mechanisms —
                mining PRRs (pattern recognition receptors) across hundreds of
                genomes to map the full landscape of natural disease resistance.
              </p>
              <p className="mt-3 font-mono text-[11px] text-fg-dim">
                Last updated: {LAST_UPDATED}
              </p>
            </motion.div>

            {/* Key stats */}
            <div className="mt-16 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((d, i) => (
                <StatCard
                  key={d.label}
                  value={d.value}
                  suffix={d.suffix}
                  label={d.label}
                  detail={d.detail}
                  delay={i * 0.08}
                />
              ))}
            </div>

            {/* Processing pipeline status */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 md:mt-16"
            >
              <h2 className="font-display text-lg font-bold text-fg mb-2">
                Processing pipeline
              </h2>
              <p className="text-sm text-fg-muted mb-6">
                1,028 genome accessions from GenBank and RefSeq — quality-filtered
                with BUSCO and Compleasm before PRR annotation.
              </p>
              <PipelineStatus />
            </motion.div>
          </div>
        </section>

        {/* Top species + lineage breakdown */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {/* Top species */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-lg font-bold text-fg mb-2">
                  Top species by PRR count
                </h2>
                <p className="text-sm text-fg-muted mb-6">
                  PRRs per genome range from 4 to 553 (mean: 266). Highest counts
                  in Brassicaceae and Camellia species.
                </p>
                <TopSpeciesTable />
              </motion.div>

              {/* Lineage breakdown + PRR types */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="font-display text-lg font-bold text-fg mb-2">
                    Lineage coverage
                  </h2>
                  <p className="text-sm text-fg-muted mb-6">
                    Taxonomic breadth of processed genomes across major plant lineages.
                  </p>
                  <div className="space-y-3">
                    {lineages.map((l) => (
                      <div key={l.name} className="flex items-center gap-3">
                        <span className="text-xs text-fg-muted w-36">{l.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-edge overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand/60"
                            style={{ width: `${l.pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-fg-dim w-6 text-right">{l.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <h2 className="font-display text-lg font-bold text-fg mb-2">
                    PRR composition
                  </h2>
                  <p className="text-sm text-fg-muted mb-6">
                    Receptor types across all 17,354 identified PRRs.
                  </p>
                  <div className="flex h-8 rounded overflow-hidden gap-px mb-3">
                    <div className="bg-brand/60 flex items-center justify-center" style={{ width: "67.8%" }}>
                      <span className="font-mono text-[10px] text-bg font-bold">RLK</span>
                    </div>
                    <div className="bg-emerald-500/50 flex items-center justify-center" style={{ width: "32.2%" }}>
                      <span className="font-mono text-[10px] text-bg font-bold">RLP</span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-[11px] font-mono text-fg-dim">
                    <span>RLK: 11,761 (67.8%)</span>
                    <span>RLP: 5,593 (32.2%)</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth & what's next */}
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                What&apos;s next
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-fg-muted">
                842 genome accessions are queued for processing — representing 547
                additional species. As our annotation pipeline scales, we expect the
                PRR catalog to grow from 17,000 to over 100,000 receptors, dramatically
                expanding the search space for disease-resistant variants.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Expand coverage",
                  body: "Process all 842 pending genomes, prioritizing major food crops and their wild relatives.",
                },
                {
                  title: "Cross-species transfer",
                  body: "Immune receptors in one crop often have functional homologs in others — one discovery can protect dozens of species.",
                },
                {
                  title: "Pathogen mapping",
                  body: "Map receptor-pathogen interactions across bacterial, fungal, and oomycete threats to build a comprehensive defense atlas.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-lg border border-edge bg-bg-alt/50 p-6"
                >
                  <h3 className="font-display text-base font-bold text-fg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
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
