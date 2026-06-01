import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, GitCompareArrows, LayoutDashboard, Target, QrCode, Github, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SupportModal } from "@/components/support-modal";

export type ViewKey = "analyzer" | "benchmark" | "sprints";

const NAV: { key: ViewKey; label: string; icon: typeof LayoutDashboard; desc: string }[] = [
  { key: "analyzer", label: "Gap Analyzer", icon: LayoutDashboard, desc: "Syllabus → roadmap" },
  { key: "benchmark", label: "College Benchmarker", icon: GitCompareArrows, desc: "Compare institutions" },
  { key: "sprints", label: "Weekly Sprints", icon: Target, desc: "Bite-sized tasks" },
];

export function AppShell({
  view,
  onViewChange,
  children,
}: {
  view: ViewKey;
  onViewChange: (v: ViewKey) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    const syncSidebarForViewport = () => {
      setOpen(window.innerWidth >= 768);
    };

    syncSidebarForViewport();
    window.addEventListener("resize", syncSidebarForViewport);
    return () => window.removeEventListener("resize", syncSidebarForViewport);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-md hover:bg-muted/60 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4 text-background" />
              </div>
              <span className="font-mono text-sm tracking-tight">
                <span className="text-foreground font-semibold">techgap</span>
                <span className="text-primary">/</span>
                <span className="text-muted-foreground">analyzer</span>
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex border-border/60 text-xs">
            <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"/></svg>
              Sign in with Google
          </Button>
        </div>
      </header>

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <aside
          className={cn(
            "shrink-0 border-r border-border/60 bg-sidebar/80 backdrop-blur-xl transition-all duration-300 overflow-hidden",
            "fixed left-0 top-14 bottom-0 z-40 md:static md:z-auto",
            open ? "w-36 md:w-52" : "w-0",
          )}
        >
          <nav className="h-full flex flex-col p-2 w-36 md:w-52 md:p-2.5">
            <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              Modules
            </div>
            <ul className="space-y-0.5 mt-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = view === item.key;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        onViewChange(item.key);
                        if (window.innerWidth < 768) setOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2 py-1.5 md:px-2.5 rounded-md flex items-start gap-2 transition-all group relative",
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />
                      )}
                      <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", active && "text-primary")} />
                      <div className="min-w-0">
                         <div className="text-[12px] md:text-[13px] font-medium leading-tight">{item.label}</div>
                        <div className="hidden md:block text-[10px] text-muted-foreground/80 mt-0.5 leading-tight">{item.desc}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setSupportOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 rounded-md text-[11px] md:text-xs font-semibold transition-transform hover:scale-[1.02] shadow-lg"
                style={{
                  background: "var(--gradient-primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "0 8px 24px rgba(95, 232, 166, 0.25)",
                }}
              >
                <QrCode className="h-3.5 w-3.5" />
                Support the Project
              </button>
            </div>

            <div className="mt-auto hidden md:block space-y-1.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                Star on GitHub
              </a>
              <div className="text-[10px] text-muted-foreground/60 text-center font-mono">
                v0.1 · guest mode
              </div>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>

          {/* Bottom ad banner */}
          <div className="border-t border-border/60 bg-background/50 px-4 py-4 flex justify-center">
            <div className="w-full max-w-[330px] h-[100px] rounded-lg border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center text-center px-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
                Sponsored · Carbon Ads
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Developer-focused ad placeholder
              </span>
            </div>
          </div>
        </main>
      </div>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}