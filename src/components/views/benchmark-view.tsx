import { useMemo, useState, useCallback } from "react";
import { CAREER_TRACKS, COLLEGES, type CareerTrack } from "@/lib/curriculum-data";
import { Trophy, TrendingUp, Sparkles, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { extractPdfText } from "@/lib/pdf-parse";
import { Combobox } from "@/components/ui/combobox";
import { INSTITUTION_SUGGESTIONS, CAREER_TRACK_SUGGESTIONS } from "@/lib/suggestions";

type Mode = "auto" | "manual";
type AIResult = {
  areas: string[];
  a: { name: string; scores: number[] };
  b: { name: string; scores: number[] };
  summary?: string;
};

export function BenchmarkView() {
  const [a, setA] = useState(COLLEGES[0].id);
  const [b, setB] = useState(COLLEGES[1].id);
  const [track, setTrack] = useState<string>("Computer Science Engineering (CSE)");
  const [mode, setMode] = useState<Mode>("auto");
  const [nameA, setNameA] = useState("NIET");
  const [nameB, setNameB] = useState("Dayalbagh Educational Institute");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  const colA = COLLEGES.find((c) => c.id === a)!;
  const colB = COLLEGES.find((c) => c.id === b)!;

  // Use AI result when available, otherwise fall back to local data
  const fallbackTrack: CareerTrack = "Computer Science Engineering";
  const dataA = aiResult
    ? aiResult.areas.map((area, i) => ({ area, coverage: aiResult.a.scores[i] ?? 0 }))
    : colA.scoresByTrack[fallbackTrack];
  const dataB = aiResult
    ? aiResult.areas.map((area, i) => ({ area, coverage: aiResult.b.scores[i] ?? 0 }))
    : colB.scoresByTrack[fallbackTrack];
  const displayNameA = aiResult ? aiResult.a.name : colA.name;
  const displayNameB = aiResult ? aiResult.b.name : colB.name;

  const avgA = Math.round(dataA.reduce((n, x) => n + x.coverage, 0) / dataA.length);
  const avgB = Math.round(dataB.reduce((n, x) => n + x.coverage, 0) / dataB.length);
  const winner = avgA === avgB ? null : avgA > avgB ? { name: displayNameA } : { name: displayNameB };

  const radar = useMemo(() => buildRadar(dataA, dataB), [dataA, dataB]);

  const runCompare = async () => {
    setLoading(true);
    setError(null);
    setAiResult(null);
    try {
      let aText = "";
      let bText = "";
      let aName = "";
      let bName = "";
      if (mode === "auto") {
        aName = nameA.trim() || "Institution A";
        bName = nameB.trim() || "Institution B";
        aText = nameA.trim();
        bText = nameB.trim();
      } else {
        if (!fileA || !fileB) throw new Error("Upload both syllabus PDFs to compare.");
        aName = fileA.name.replace(/\.pdf$/i, "");
        bName = fileB.name.replace(/\.pdf$/i, "");
        [aText, bText] = await Promise.all([extractPdfText(fileA), extractPdfText(fileB)]);
      }
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "compare",
          payload: { a: { name: aName, text: aText }, b: { name: bName, text: bText }, track },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Compare failed");
      setAiResult(data as AIResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">College Benchmarker</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Compare two institutions across the skills that today's employers actually ask for.
        </p>
      </header>

      {/* Mode toggle */}
      <div className="inline-flex p-1 rounded-lg bg-card/60 border border-border/60">
        {(["auto", "manual"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              mode === m
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "auto" ? <Sparkles className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
            {m === "auto" ? "Auto AI Search" : "Manual PDF Upload"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {mode === "auto" ? (
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">Institution A</div>
            <Combobox value={nameA} onChange={setNameA} options={INSTITUTION_SUGGESTIONS} placeholder="NIET" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">Institution B</div>
            <Combobox value={nameB} onChange={setNameB} options={INSTITUTION_SUGGESTIONS} placeholder="Dayalbagh Educational Institute" />
          </div>
          <TrackPicker track={track} setTrack={setTrack} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          <DropZone label="Syllabus A" file={fileA} setFile={setFileA} />
          <DropZone label="Syllabus B" file={fileB} setFile={setFileB} />
          <div className="sm:col-span-2">
            <TrackPicker track={track} setTrack={setTrack} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={runCompare}
          disabled={loading}
          style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {mode === "manual" ? "Parsing & comparing…" : "Asking Gemini…"}</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Compare</>
          )}
        </Button>
        {aiResult?.summary && (
          <div className="text-xs text-muted-foreground">{aiResult.summary}</div>
        )}
        {error && (
          <div className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Scoreboard */}
        <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Industry coverage
            </h2>
            {winner && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary flex items-center gap-1">
                <Trophy className="h-3 w-3" /> {winner.name.split(" ")[0]} leads
              </span>
            )}
          </div>

          {dataA.map((row, i) => (
            <div key={row.area} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{row.area}</span>
                <span className="font-mono">
                  <span className="text-primary">{row.coverage}%</span>
                  <span className="text-muted-foreground/60"> vs </span>
                  <span className="text-accent">{dataB[i].coverage}%</span>
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
                  style={{ width: `${row.coverage}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full border-r-2 border-accent"
                  style={{ width: `${dataB[i].coverage}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-3 text-center">
            <Avg name={displayNameA} value={avgA} color="primary" leading={avgA >= avgB} />
            <Avg name={displayNameB} value={avgB} color="accent" leading={avgB > avgA} />
          </div>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <h2 className="text-sm font-semibold mb-3">Skill radar</h2>
          <div className="aspect-square max-w-md mx-auto">{radar}</div>
          <div className="flex justify-center gap-4 text-xs mt-3">
            <Legend color="var(--color-primary)" label={displayNameA} />
            <Legend color="var(--color-accent)" label={displayNameB} />
          </div>
        </div>
      </div>

      {/* Legacy local selectors for quick demo when not using AI */}
      {!aiResult && mode === "auto" && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">Use built-in demo data instead</summary>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <Selector label="Institution A" value={a} onChange={setA} options={COLLEGES} />
            <Selector label="Institution B" value={b} onChange={setB} options={COLLEGES} />
          </div>
        </details>
      )}
    </div>
  );
}

function TrackPicker({ track, setTrack }: { track: string; setTrack: (t: string) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">Career track</div>
      <Combobox
        value={track}
        onChange={setTrack}
        options={CAREER_TRACK_SUGGESTIONS}
        placeholder="Computer Science Engineering (CSE)"
      />
    </div>
  );
}

function DropZone({ label, file, setFile }: { label: string; file: File | null; setFile: (f: File | null) => void }) {
  const [over, setOver] = useState(false);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, [setFile]);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        "cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center bg-card/40 transition-all",
        over ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
      )}
    >
      <input type="file" accept=".pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
        {file ? <FileText className="h-5 w-5 text-primary" /> : <Upload className="h-5 w-5 text-primary" />}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{label}</div>
      <div className="text-xs font-medium mt-1 truncate max-w-full">{file ? file.name : "Drop syllabus PDF"}</div>
    </label>
  );
}

function Selector({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { id: string; name: string }[];
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-input border border-border/60 rounded-md px-3 py-2 text-sm">
        {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </select>
    </div>
  );
}

function Avg({ name, value, color, leading }: { name: string; value: number; color: "primary" | "accent"; leading: boolean }) {
  const ring = leading
    ? color === "primary"
      ? "border-primary/40 bg-primary/5"
      : "border-accent/40 bg-accent/5"
    : "border-border/40";
  return (
    <div className={cn("rounded-lg p-3 border", ring)}>
      <div className="text-[10px] text-muted-foreground truncate">{name}</div>
      <div className={cn("text-2xl font-bold font-mono mt-1", color === "primary" ? "text-primary" : "text-accent")}>
        {value}%
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function buildRadar(a: { area: string; coverage: number }[], b: { area: string; coverage: number }[]) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const n = a.length;

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (v / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist] as const;
  };

  const polygon = (data: typeof a) => data.map((d, i) => point(i, d.coverage).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {[20, 40, 60, 80, 100].map((p) => (
        <polygon
          key={p}
          points={a.map((_, i) => point(i, p).join(",")).join(" ")}
          fill="none"
          stroke="var(--color-border)"
          strokeOpacity={0.6}
        />
      ))}
      {a.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-border)" strokeOpacity={0.4} />;
      })}
      <polygon points={polygon(a)} fill="var(--color-primary)" fillOpacity={0.25} stroke="var(--color-primary)" strokeWidth={2} />
      <polygon points={polygon(b)} fill="var(--color-accent)" fillOpacity={0.2} stroke="var(--color-accent)" strokeWidth={2} />
      {a.map((d, i) => {
        const [x, y] = point(i, 115);
        return (
          <text key={i} x={x} y={y} fontSize="9" textAnchor="middle" fill="var(--color-muted-foreground)" dominantBaseline="middle">
            {d.area}
          </text>
        );
      })}
    </svg>
  );
}