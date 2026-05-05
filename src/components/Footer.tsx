import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-edge py-8">
      <div className="mx-auto max-w-5xl px-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Image src="/logo.png" alt="HardyGreens" width={120} height={28} className="h-6 w-auto opacity-60" />
        <div className="flex items-center gap-6">
          <a href="/platform" className="text-xs text-fg-dim transition-colors hover:text-fg-muted">Platform</a>
          <a href="/research" className="text-xs text-fg-dim transition-colors hover:text-fg-muted">Research</a>
          <a href="/contact" className="text-xs text-fg-dim transition-colors hover:text-fg-muted">Contact</a>
        </div>
        <span className="text-xs text-fg-dim">&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
