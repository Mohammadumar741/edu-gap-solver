import { useRef } from "react";
import confetti from "canvas-confetti";
import { Flame, CheckCircle2, BookOpen } from "lucide-react";
import { WEEKLY_SPRINTS } from "@/lib/curriculum-data";
import { useLocalState } from "@/lib/storage";
import { CourseCard } from "@/components/course-card";
import { cn } from "@/lib/utils";

type State = "unknown" | "know" | "learn" | "done";

export function SprintsView() {
  const [state, setState] = useLocalState<Record<string, State>>("tg.sprints.state", {});
  const containerRef = useRef<HTMLDivElement>(null);

  const completedCount = Object.values(state).filter((s) => s === "done").length;

  const fire = (originY = 0.5) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: originY },
      colors: ["#5fe8a6", "#7ec5ff", "#ffd86b"],
      ticks: 120,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in" ref={containerRef}>
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">This Week's Sprint</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Three bite-sized concept checks. Build the habit, close the gap.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 border border-border/60">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-mono">{completedCount}/{WEEKLY_SPRINTS.length} this week</span>
        </div>
      </header>

      <div className="space-y-3">
        {WEEKLY_SPRINTS.map((sprint, i) => {
          const s: State = state[sprint.id] ?? "unknown";
          const isDone = s === "done";
          const needsLearn = s === "learn";

          return (
            <div
              key={sprint.id}
              className={cn(
                "rounded-xl border bg-card/60 p-5 transition-all",
                isDone ? "border-primary/50 bg-primary/5" : "border-border/60",
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-xl font-mono text-muted-foreground/60 mt-0.5">
                  0{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className={cn("font-semibold", isDone && "line-through text-muted-foreground")}>
                        {sprint.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {sprint.prompt}
                      </p>
                    </div>
                    {isDone && (
                      <span className="flex items-center gap-1 text-xs text-primary font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Done
                      </span>
                    )}
                  </div>

                  {!isDone && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          setState({ ...state, [sprint.id]: "done" });
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          fire(rect.top / window.innerHeight);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                          s === "know"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/60 hover:bg-primary/5",
                        )}
                      >
                        ✓ I know this
                      </button>
                      <button
                        onClick={() => setState({ ...state, [sprint.id]: "learn" })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                          needsLearn
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/60 hover:bg-accent/5",
                        )}
                      >
                        <BookOpen className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                        I need to learn this
                      </button>
                    </div>
                  )}

                  {needsLearn && (
                    <div className="mt-3 animate-fade-in">
                      <div className="text-[10px] uppercase tracking-widest font-mono text-accent mb-1.5">
                        Recommended path
                      </div>
                      <CourseCard course={sprint.course} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        New sprints drop every Monday · progress saved locally
      </p>
    </div>
  );
}