import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-start justify-center px-6 pt-24 pb-16 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-8"></div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mono font-medium tracking-tight text-foreground leading-[1.05] mb-6">
        The minimal
        <br />
        task tracking
        <br />
        <span className="text-muted-foreground">platform.</span>
      </h1>
      <p className="text-sm font-mono text-muted-foreground max-w-md leading-relaxed mb-10">
        Flowdock helps you create, manage and track tasks with built-in
        analytics. Know exactly what is done, what is pending and how fast you
        are moving.
      </p>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-mono text-sm px-12 py-4.5 hover:bg-foreground/90 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center bg-transparent text-foreground font-mono text-sm px-12 py-4.5 border border-dashed border-white/40 hover:border-white/60 hover:bg-white/5 transition-colors relative"
        >
          Sign In
          <span className="absolute -bottom-1.25 -right-1.25 text-white/40 text-xs leading-none">
            +
          </span>
          <span className="absolute -top-1.25 -right-1.25 text-white/40 text-xs leading-none">
            +
          </span>
          <span className="absolute -bottom-1.25 -left-1.25 text-white/40 text-xs leading-none">
            +
          </span>
          <span className="absolute -top-1.25 -left-1.25 text-white/40 text-xs leading-none">
            +
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2 mt-8 flex-wrap">
        {[
          "Task Management",
          "Priority Tracking",
          "Analytics Dashboard",
          "Filter & Search",
          "Google Auth",
        ].map((feature) => (
          <div
            key={feature}
            className="border border-white/10 px-3 py-1 flex items-center gap-1.5"
          >
            <div className="w-1 h-1 bg-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
