"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const links = [
  { label: "Platform", href: "/platform" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50));

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-2xl border-b border-edge"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 flex h-16 items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="HardyGreens" width={180} height={40} className="h-10 w-auto" priority />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-fg ${
                pathname === l.href ? "text-fg" : "text-fg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`rounded-full border border-brand/30 bg-brand-pale px-5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/20 ${
              pathname === "/contact" ? "bg-brand/20" : ""
            }`}
          >
            Contact
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-fg-muted text-sm"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-edge bg-bg/95 backdrop-blur-2xl px-6 pb-6 pt-4 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 ${pathname === l.href ? "text-fg" : "text-fg-muted"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-brand">
            Contact
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
