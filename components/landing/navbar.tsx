import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4" />
        <span className="text-sm font-mono font-medium tracking-tight text-foreground">
          FLOWDOCK.
        </span>
      </div>

      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 bg-white text-black font-mono text-xs font-medium px-4 py-2 tracking-wide hover:bg-white/90 transition-colors"
      >
        SIGN-IN
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M1 9L9 1M9 1H3M9 1V7"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </header>
  );
}
