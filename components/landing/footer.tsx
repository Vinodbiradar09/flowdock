export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-6">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3" />
          <span className="text-xs font-mono text-muted-foreground">
            FLOWDOCK.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500" />
            <p className="text-xs font-mono text-muted-foreground">
              All systems operational
            </p>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <p className="text-xs font-mono text-muted-foreground"></p>
          <div className="w-px h-3 bg-white/10" />
          <p className="text-xs font-mono text-muted-foreground">
            © 2025 Flowdock
          </p>
        </div>
      </div>
    </footer>
  );
}
