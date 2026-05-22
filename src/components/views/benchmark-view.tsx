import { useMemo, useState } from "react";
import { CAREER_TRACKS, COLLEGES, type CareerTrack } from "@/lib/curriculum-data";
import { Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BenchmarkView() {
  const [a, setA] = useState(COLLEGES[0].id);
  const [b, setB] = useState(COLLEGES[1].id);
  const [track, setTrack] = useState<CareerTrack>("Computer Science Engineering");

  const colA = COLLEGES.find((c) => c.id === a)!;
  const colB = COLLEGES.find((c) => c.id === b)!;
  const dataA = colA.scoresByTrack[track];
  const dataB = colB.scoresByTrack[track];

  const avgA = Math.round(dataA.reduce((n, x) => n + x.coverage, 0) / dataA.length);
  const avgB = Math.round(dataB.reduce((n, x) => n + x.coverage, 0) / dataB.length);
  const winner = avgA === avgB ? null : avgA > avgB ? colA : colB;

  const radar = useMemo(() => buildRadar(dataA, dataB), [dataA, dataB]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">College Benchmarker</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Compare two institutions across the skills that today's employers actually ask for.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <Selector label="Institution A" value={a} onChange={setA} options={COLLEGES} />
        <Selector label="Institution B" value={b} onChange={setB} options={COLLEGES} />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1.5">
            Career track
          </div>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as CareerTrack)}
            className="w-full bg-input border border-border/60 rounded-md px-3 py-2 text-sm"
          >
            {CAREER_TRACKS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
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
            <Avg name={colA.name} value={avgA} color="primary" leading={avgA >= avgB} />
            <Avg name={colB.name} value={avgB} color="accent" leading={avgB > avgA} />
          </div>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <h2 className="text-sm font-semibold mb-3">Skill radar</h2>
          <div className="aspect-square max-w-md mx-auto">{radar}</div>
          <div className="flex justify-center gap-4 text-xs mt-3">
            <Legend color="var(--color-primary)" label={colA.name} />
            <Legend color="var(--color-accent)" label={colB.name} />
          </div>
        </div>
      </div>
    </div>
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
  return (
    <div className={cn("rounded-lg p-3 border", leading ? `border-${color}/40 bg-${color}/5` : "border-border/40")}>
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